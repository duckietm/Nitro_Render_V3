import { ICodec, IConnection, IMessageComposer, IMessageConfiguration, IMessageDataWrapper, IMessageEvent, WebSocketEventEnum } from '@nitrots/api';
import { GetConfiguration } from '@nitrots/configuration';
import { GetEventDispatcher, NitroEvent, NitroEventType, ReconnectEvent } from '@nitrots/events';
import { NitroLogger } from '@nitrots/utils';
import { EvaWireFormat } from './codec';
import { aesGcmDecrypt, aesGcmEncrypt, buildClientHello, deriveAesKey, deriveSharedSecret, exportPublicKeySpki, generateEphemeralKeyPair, importPublicKeySpki, importSigningPublicKeyFromBase64, NONCE_LEN, parseServerHello, randomNonce, verifyEphemeralSignature } from './crypto';
import { MessageClassManager } from './messages';

type CryptoState = 'disabled' | 'awaiting_server_hello' | 'ready' | 'error';

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
    private _onOpenCallback: (event: Event) => void = null;
    private _onCloseCallback: (event: Event) => void = null;
    private _onErrorCallback: (event: Event) => void = null;
    private _onMessageCallback: (event: MessageEvent) => void = null;
    private _socketUrl: string = null;
    private _reconnectAttempt: number = 0;
    private _reconnectTimer: ReturnType<typeof setTimeout> = null;
    private _isReconnecting: boolean = false;
    private _intentionalClose: boolean = false;
    private _wasAuthenticated: boolean = false;
	
    public static readonly MAX_RECONNECT_ATTEMPTS: number = 7;
    public static readonly BASE_RECONNECT_DELAY_MS: number = 1000;
    public static readonly MAX_RECONNECT_DELAY_MS: number = 30000;

    private _cryptoState: CryptoState = 'disabled';
    private _sessionKey: CryptoKey = null;
    private _pendingEncryptedSends: ArrayBuffer[] = [];

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
        const cryptoEnabled = !!GetConfiguration().getValue<boolean>('crypto.ws.enabled', false);
        if(cryptoEnabled && !this.subtleCryptoAvailable())
        {
            NitroLogger.error('[ws-crypto] crypto.ws.enabled=true but window.crypto.subtle is unavailable. '
                + 'This page must be served from a secure context - HTTPS, localhost, or 127.0.0.1. '
                + 'Current origin: ' + (typeof window !== 'undefined' ? window.location.origin : 'unknown'));
            this._cryptoState = 'error';
        }
        else
        {
            this._cryptoState = cryptoEnabled ? 'awaiting_server_hello' : 'disabled';
        }
        this._sessionKey = null;
        this._pendingEncryptedSends = [];

        this._socket = new WebSocket(socketUrl);
        this._socket.binaryType = 'arraybuffer';
        this._onOpenCallback = () => this.onSocketOpened();
        this._onCloseCallback = (event: Event) => this.onSocketClosed(event as CloseEvent);
        this._onErrorCallback = () => this.onSocketError();
        this._onMessageCallback = (event: MessageEvent) => this.onSocketMessage(event.data as ArrayBuffer);
        this._socket.addEventListener(WebSocketEventEnum.CONNECTION_OPENED, this._onOpenCallback);
        this._socket.addEventListener(WebSocketEventEnum.CONNECTION_CLOSED, this._onCloseCallback);
        this._socket.addEventListener(WebSocketEventEnum.CONNECTION_ERROR, this._onErrorCallback);
        this._socket.addEventListener(WebSocketEventEnum.CONNECTION_MESSAGE, this._onMessageCallback);
    }

    private subtleCryptoAvailable(): boolean
    {
        return typeof window !== 'undefined'
            && typeof window.crypto !== 'undefined'
            && typeof window.crypto.subtle !== 'undefined';
    }

    private onSocketMessage(data: ArrayBuffer): void
    {
        if(this._cryptoState === 'error')
        {
            this._intentionalClose = true;
            if(this._socket) this._socket.close();
            return;
        }

        if(this._cryptoState === 'awaiting_server_hello')
        {
            this.handleServerHello(data)
                .catch(err =>
                {
                    NitroLogger.error('[ws-crypto] handshake failed', err);
                    this._cryptoState = 'error';
                    this._intentionalClose = true;
                    if(this._socket) this._socket.close();
                });
            return;
        }

        if(this._cryptoState === 'ready')
        {
            this.decryptFrame(data)
                .then(plain =>
                {
                    this._dataBuffer = this.concatArrayBuffers(this._dataBuffer, plain);
                    this.processReceivedData();
                })
                .catch(err =>
                {
                    NitroLogger.error('[ws-crypto] decrypt failed', err);
                    this._cryptoState = 'error';
                    this._intentionalClose = true;
                    if(this._socket) this._socket.close();
                });
            return;
        }

        this._dataBuffer = this.concatArrayBuffers(this._dataBuffer, data);
        this.processReceivedData();
    }

    private async handleServerHello(frame: ArrayBuffer): Promise<void>
    {
        const { pubkeySpki: serverPubkeySpki, signature } = parseServerHello(frame);
        const signingRequired = !!GetConfiguration().getValue<boolean>('crypto.ws.signing.enabled', false);
        if(signingRequired)
        {
            if(!signature) throw new Error('crypto.ws.signing.enabled=true but server_hello had no signature');

            const signingPub = await this.getSigningPublicKey();
            const ok = await verifyEphemeralSignature(signingPub, signature, serverPubkeySpki);
            if(!ok) throw new Error('server_hello signature verification failed (MITM?)');
        }

        const serverPubkey = await importPublicKeySpki(serverPubkeySpki);
        const ourKeys = await generateEphemeralKeyPair();
        const ourPubkeySpki = await exportPublicKeySpki(ourKeys.publicKey);
        const shared = await deriveSharedSecret(ourKeys.privateKey, serverPubkey);
        this._sessionKey = await deriveAesKey(shared);
        this._socket.send(buildClientHello(ourPubkeySpki));
        this._cryptoState = 'ready';

        if(this._pendingEncryptedSends.length)
        {
            const queued = this._pendingEncryptedSends;
            this._pendingEncryptedSends = [];
            for(const buf of queued) await this.encryptAndSend(buf);
        }
    }

    private _cachedSigningPublicKey: CryptoKey = null;
    private async getSigningPublicKey(): Promise<CryptoKey>
    {
        if(this._cachedSigningPublicKey) return this._cachedSigningPublicKey;

        const pinned = GetConfiguration().getValue<string>('crypto.ws.signing.public_key', '');
        if(pinned)
        {
            this._cachedSigningPublicKey = await importSigningPublicKeyFromBase64(pinned);
            return this._cachedSigningPublicKey;
        }

        const endpointTemplate = GetConfiguration().getValue<string>('login.server_key.endpoint', '/api/auth/server-key');
        const endpoint = GetConfiguration().interpolate(endpointTemplate);
        const resp = await fetch(endpoint, { credentials: 'include' });
        if(!resp.ok) throw new Error(`server-key fetch failed: HTTP ${ resp.status }`);
        const payload = await resp.json();
        const b64 = typeof payload?.publicKey === 'string' ? payload.publicKey : '';
        if(!b64) throw new Error('server-key response missing publicKey');
        this._cachedSigningPublicKey = await importSigningPublicKeyFromBase64(b64);
        return this._cachedSigningPublicKey;
    }

    private async decryptFrame(frame: ArrayBuffer): Promise<ArrayBuffer>
    {
        if(frame.byteLength < NONCE_LEN + 16) throw new Error('encrypted frame too short');
        const nonce = new Uint8Array(frame, 0, NONCE_LEN);
        const ct = frame.slice(NONCE_LEN);
        return aesGcmDecrypt(this._sessionKey, nonce, ct);
    }

    private async encryptAndSend(plaintext: ArrayBuffer): Promise<void>
    {
        if(!this._sessionKey) return;
        const nonce = randomNonce();
        const ct = await aesGcmEncrypt(this._sessionKey, nonce, plaintext);
        const framed = new Uint8Array(NONCE_LEN + ct.byteLength);
        framed.set(nonce, 0);
        framed.set(new Uint8Array(ct), NONCE_LEN);
        if(this._socket && this._socket.readyState === WebSocket.OPEN) this._socket.send(framed.buffer);
    }

    private onSocketOpened(): void
    {
        if(this._isReconnecting)
        {
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
            try { this._socket.close(); } catch(e) {}
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

        if(this._cryptoState === 'disabled')
        {
            this._socket.send(buffer);
            return;
        }

        if(this._cryptoState === 'ready')
        {
            this.encryptAndSend(buffer).catch(err => NitroLogger.error('[ws-crypto] encrypt failed', err));
            return;
        }

        if(this._cryptoState === 'awaiting_server_hello')
        {
            this._pendingEncryptedSends.push(buffer);
            return;
        }
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
