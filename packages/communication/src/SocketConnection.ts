import { ICodec, IConnection, IMessageComposer, IMessageConfiguration, IMessageDataWrapper, IMessageEvent, WebSocketEventEnum } from '@nitrots/api';
import { GetEventDispatcher, NitroEvent, NitroEventType, ReconnectEvent } from '@nitrots/events';
import { NitroLogger } from '@nitrots/utils';
import { EvaWireFormat } from './codec';
import { MessageClassManager } from './messages';

export class SocketConnection implements IConnection
{
    private _socket: WebSocket = null;
    private _messages: MessageClassManager = new MessageClassManager();
    private _codec: ICodec = new EvaWireFormat();
    private _dataBuffer: ArrayBuffer = null;
    private _isReady: boolean = false;

    private _pendingClientMessages: IMessageComposer<unknown[]>[] = [];
    private _pendingServerMessages: IMessageDataWrapper[] = [];

    private _isAuthenticated: boolean = false;

    // Store callbacks for cleanup
    private _onOpenCallback: (event: Event) => void = null;
    private _onCloseCallback: (event: Event) => void = null;
    private _onErrorCallback: (event: Event) => void = null;
    private _onMessageCallback: (event: MessageEvent) => void = null;

    // Reconnection state
    private _socketUrl: string = null;
    private _reconnectAttempt: number = 0;
    private _reconnectTimer: ReturnType<typeof setTimeout> = null;
    private _isReconnecting: boolean = false;
    private _intentionalClose: boolean = false;
    private _wasAuthenticated: boolean = false;

    public static readonly MAX_RECONNECT_ATTEMPTS: number = 7;
    public static readonly BASE_RECONNECT_DELAY_MS: number = 1000;
    public static readonly MAX_RECONNECT_DELAY_MS: number = 30000;

    public init(socketUrl: string): void
    {
        if(!socketUrl || !socketUrl.length) return;

        this._socketUrl = socketUrl;
        this._intentionalClose = false;

        this.createSocket(socketUrl);
    }

    private createSocket(socketUrl: string): void
    {
        this._dataBuffer = new ArrayBuffer(0);

        this._socket = new WebSocket(socketUrl);
        this._socket.binaryType = 'arraybuffer';

        // Store callbacks for cleanup
        this._onOpenCallback = () => this.onSocketOpened();
        this._onCloseCallback = (event: Event) => this.onSocketClosed(event as CloseEvent);
        this._onErrorCallback = () => this.onSocketError();
        this._onMessageCallback = (event: MessageEvent) =>
        {
            this._dataBuffer = this.concatArrayBuffers(this._dataBuffer, event.data);
            this.processReceivedData();
        };

        this._socket.addEventListener(WebSocketEventEnum.CONNECTION_OPENED, this._onOpenCallback);
        this._socket.addEventListener(WebSocketEventEnum.CONNECTION_CLOSED, this._onCloseCallback);
        this._socket.addEventListener(WebSocketEventEnum.CONNECTION_ERROR, this._onErrorCallback);
        this._socket.addEventListener(WebSocketEventEnum.CONNECTION_MESSAGE, this._onMessageCallback);
    }

    private onSocketOpened(): void
    {
        if(this._isReconnecting)
        {
            NitroLogger.log('[SocketConnection] Reconnected successfully after ' + this._reconnectAttempt + ' attempt(s)');

            this._reconnectAttempt = 0;
            this._isReconnecting = false;

            GetEventDispatcher().dispatchEvent(new NitroEvent(NitroEventType.SOCKET_RECONNECTED));
        }
        else
        {
            GetEventDispatcher().dispatchEvent(new NitroEvent(NitroEventType.SOCKET_OPENED));
        }
    }

    private onSocketClosed(event: CloseEvent): void
    {
        NitroLogger.log('[SocketConnection] Socket closed, code: ' + (event?.code ?? 'unknown') + ', reason: ' + (event?.reason || 'none'));

        if(this._intentionalClose)
        {
            GetEventDispatcher().dispatchEvent(new NitroEvent(NitroEventType.SOCKET_CLOSED));
            return;
        }

        const code = event?.code ?? 0;

        if(code === 1000 || code === 1001)
        {
            NitroLogger.log('[SocketConnection] Server closed cleanly (code ' + code + ') - not reconnecting');

            this._isAuthenticated = false;
            this._isReady = false;

            GetEventDispatcher().dispatchEvent(new NitroEvent(NitroEventType.SOCKET_CLOSED));
            return;
        }

        if(this._isAuthenticated) this._wasAuthenticated = true;

        this._isAuthenticated = false;
        this._isReady = false;
        this._pendingClientMessages = [];
        this._pendingServerMessages = [];

        this.attemptReconnect();
    }

    private onSocketError(): void
    {
        if(this._isReconnecting)
        {
            NitroLogger.log('[SocketConnection] Reconnect attempt ' + this._reconnectAttempt + ' failed');
            return;
        }

        if(!this._wasAuthenticated && !this._isAuthenticated)
        {
            GetEventDispatcher().dispatchEvent(new NitroEvent(NitroEventType.SOCKET_ERROR));
        }
    }

    private attemptReconnect(): void
    {
        if(this._reconnectAttempt >= SocketConnection.MAX_RECONNECT_ATTEMPTS)
        {
            NitroLogger.log('[SocketConnection] Max reconnect attempts reached (' + SocketConnection.MAX_RECONNECT_ATTEMPTS + ')');

            this._isReconnecting = false;
            this._wasAuthenticated = false;

            GetEventDispatcher().dispatchEvent(new ReconnectEvent(
                NitroEventType.SOCKET_RECONNECT_FAILED,
                this._reconnectAttempt,
                SocketConnection.MAX_RECONNECT_ATTEMPTS
            ));

            GetEventDispatcher().dispatchEvent(new NitroEvent(NitroEventType.SOCKET_CLOSED));

            return;
        }

        this._isReconnecting = true;
        this._reconnectAttempt++;

        const delay = Math.min(
            SocketConnection.BASE_RECONNECT_DELAY_MS * Math.pow(2, this._reconnectAttempt - 1) + Math.random() * 1000,
            SocketConnection.MAX_RECONNECT_DELAY_MS
        );

        NitroLogger.log('[SocketConnection] Reconnecting in ' + Math.round(delay) + 'ms (attempt ' + this._reconnectAttempt + '/' + SocketConnection.MAX_RECONNECT_ATTEMPTS + ')');

        GetEventDispatcher().dispatchEvent(new ReconnectEvent(
            NitroEventType.SOCKET_RECONNECTING,
            this._reconnectAttempt,
            SocketConnection.MAX_RECONNECT_ATTEMPTS
        ));

        this._reconnectTimer = setTimeout(() =>
        {
            this._reconnectTimer = null;

            this.cleanupSocket();

            this.createSocket(this._socketUrl);
        }, delay);
    }

    private cleanupSocket(): void
    {
        if(!this._socket) return;

        if(this._onOpenCallback) this._socket.removeEventListener(WebSocketEventEnum.CONNECTION_OPENED, this._onOpenCallback);
        if(this._onCloseCallback) this._socket.removeEventListener(WebSocketEventEnum.CONNECTION_CLOSED, this._onCloseCallback);
        if(this._onErrorCallback) this._socket.removeEventListener(WebSocketEventEnum.CONNECTION_ERROR, this._onErrorCallback);
        if(this._onMessageCallback) this._socket.removeEventListener(WebSocketEventEnum.CONNECTION_MESSAGE, this._onMessageCallback);

        if(this._socket.readyState === WebSocket.OPEN || this._socket.readyState === WebSocket.CONNECTING)
        {
            try { this._socket.close(); } catch(e) { /* ignore */ }
        }

        this._socket = null;
        this._onOpenCallback = null;
        this._onCloseCallback = null;
        this._onErrorCallback = null;
        this._onMessageCallback = null;
    }

    public dispose(): void
    {
        this._intentionalClose = true;

        if(this._reconnectTimer)
        {
            clearTimeout(this._reconnectTimer);
            this._reconnectTimer = null;
        }

        this._isReconnecting = false;
        this._reconnectAttempt = 0;
        this._wasAuthenticated = false;

        this.cleanupSocket();

        this._pendingClientMessages = [];
        this._pendingServerMessages = [];
        this._dataBuffer = null;
    }

    public ready(): void
    {
        if(this._isReady) return;

        this._isReady = true;

        if(this._pendingServerMessages && this._pendingServerMessages.length) this.processWrappers(...this._pendingServerMessages);

        if(this._pendingClientMessages && this._pendingClientMessages.length) this.send(...this._pendingClientMessages);

        this._pendingServerMessages = [];
        this._pendingClientMessages = [];
    }

    public authenticated(): void
    {
        this._isAuthenticated = true;
    }

    public send(...composers: IMessageComposer<unknown[]>[]): boolean
    {
        if(!composers) return false;

        composers = [...composers];

        if(this._isAuthenticated && !this._isReady)
        {
            this._pendingClientMessages.push(...composers);

            return false;
        }

        for(const composer of composers)
        {
            if(!composer) continue;

            const header = this._messages.getComposerId(composer);

            if(header === -1)
            {
                NitroLogger.packets('Unknown Composer', composer.constructor.name);

                continue;
            }

            const message = composer.getMessageArray();
            const encoded = this._codec.encode(header, message);

            if(!encoded)
            {
                NitroLogger.packets('Encoding Failed', composer.constructor.name);

                continue;
            }

            NitroLogger.packets('OutgoingComposer', header, composer.constructor.name, message);

            this.write(encoded.getBuffer());
        }

        return true;
    }

    private write(buffer: ArrayBuffer): void
    {
        if(!this._socket || this._socket.readyState !== WebSocket.OPEN) return;

        this._socket.send(buffer);
    }

    public processReceivedData(): void
    {
        try
        {
            this.processData();
        }

        catch (err)
        {
            NitroLogger.error(err);
        }
    }

    private processData(): void
    {
        const wrappers = this.splitReceivedMessages();

        if(!wrappers || !wrappers.length) return;

        if(this._isAuthenticated && !this._isReady)
        {
            if(!this._pendingServerMessages) this._pendingServerMessages = [];

            this._pendingServerMessages.push(...wrappers);

            return;
        }

        this.processWrappers(...wrappers);
    }

    private processWrappers(...wrappers: IMessageDataWrapper[]): void
    {
        if(!wrappers || !wrappers.length) return;

        for(const wrapper of wrappers)
        {
            if(!wrapper) continue;

            const messages = this.getMessagesForWrapper(wrapper);

            if(!messages || !messages.length) continue;

            NitroLogger.packets('IncomingMessage', wrapper.header, messages[0].constructor.name, messages[0].parser);

            this.handleMessages(...messages);
        }
    }

    private splitReceivedMessages(): IMessageDataWrapper[]
    {
        if(!this._dataBuffer || !this._dataBuffer.byteLength) return null;

        return this._codec.decode(this);
    }

    private concatArrayBuffers(buffer1: ArrayBuffer, buffer2: ArrayBuffer): ArrayBuffer
    {
        const array = new Uint8Array(buffer1.byteLength + buffer2.byteLength);

        array.set(new Uint8Array(buffer1), 0);
        array.set(new Uint8Array(buffer2), buffer1.byteLength);

        return array.buffer;
    }

    private getMessagesForWrapper(wrapper: IMessageDataWrapper): IMessageEvent[]
    {
        if(!wrapper) return null;

        const events = this._messages.getEvents(wrapper.header);

        if(!events || !events.length)
        {
            NitroLogger.packets('IncomingMessage', wrapper.header, 'UNREGISTERED', wrapper);

            return null;
        }

        try
        {
            //@ts-ignore
            const parser = new events[0].parserClass();

            if(!parser || !parser.flush() || !parser.parse(wrapper)) return null;

            for(const event of events) (event.parser = parser);
        }

        catch (e)
        {
            NitroLogger.error('Error parsing message', e, events[0].constructor.name);

            return null;
        }

        return events;
    }

    private handleMessages(...messages: IMessageEvent[]): void
    {
        messages = [...messages];

        for(const message of messages)
        {
            if(!message) continue;

            message.connection = this;

            if(message.callBack) message.callBack(message);
        }
    }

    public registerMessages(configuration: IMessageConfiguration): void
    {
        if(!configuration) return;

        this._messages.registerMessages(configuration);
    }

    public addMessageEvent(event: IMessageEvent): void
    {
        if(!event || !this._messages) return;

        this._messages.registerMessageEvent(event);
    }

    public removeMessageEvent(event: IMessageEvent): void
    {
        if(!event || !this._messages) return;

        this._messages.removeMessageEvent(event);
    }

    public get isAuthenticated(): boolean
    {
        return this._isAuthenticated;
    }

    public get isReconnecting(): boolean
    {
        return this._isReconnecting;
    }

    public get wasAuthenticated(): boolean
    {
        return this._wasAuthenticated;
    }

    public get dataBuffer(): ArrayBuffer
    {
        return this._dataBuffer;
    }

    public set dataBuffer(buffer: ArrayBuffer)
    {
        this._dataBuffer = buffer;
    }
}
