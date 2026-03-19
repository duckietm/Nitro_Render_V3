import { IRoomHandlerListener, IRoomSession, IRoomSessionManager } from '@nitrots/api';
import { GetCommunication } from '@nitrots/communication';
import { GetEventDispatcher, NitroEventType, RoomSessionEvent } from '@nitrots/events';
import { NitroLogger } from '@nitrots/utils';
import { RoomSession } from './RoomSession';
import { BaseHandler, GenericErrorHandler, PetPackageHandler, PollHandler, RoomChatHandler, RoomDataHandler, RoomDimmerPresetsHandler, RoomPermissionsHandler, RoomPresentHandler, RoomSessionHandler, RoomUsersHandler, WordQuizHandler } from './handler';

const STORAGE_KEY_ROOM_ID = 'nitro.session.lastRoomId';
const STORAGE_KEY_ROOM_PASSWORD = 'nitro.session.lastRoomPassword';

export class RoomSessionManager implements IRoomSessionManager, IRoomHandlerListener
{
    private _handlers: BaseHandler[] = [];
    private _sessions: Map<string, IRoomSession> = new Map();
    private _pendingSession: IRoomSession = null;
    private _sessionStarting: boolean = false;
    private _viewerSession: IRoomSession = null;
    private _lastRoomId: number = -1;
    private _lastRoomPassword: string = null;
    private _isReconnecting: boolean = false;
    private _reconnectGuardTimer: ReturnType<typeof setTimeout> = null;

    public async init(): Promise<void>
    {
        this.createHandlers();
        this.processPendingSession();
        this.setupReconnectListener();
        this.checkPersistedRoom();
    }

    private checkPersistedRoom(): void
    {
        try
        {
            const storedRoomId = sessionStorage.getItem(STORAGE_KEY_ROOM_ID);

            if(!storedRoomId) return;

            const roomId = parseInt(storedRoomId, 10);

            if(isNaN(roomId) || roomId <= 0) return;
            this._lastRoomId = roomId;
            this._lastRoomPassword = sessionStorage.getItem(STORAGE_KEY_ROOM_PASSWORD) || null;
            this._isReconnecting = true;
        }
        catch(e) {}
    }

    private createHandlers(): void
    {
        const connection = GetCommunication().connection;

        if(!connection) return;

        this._handlers.push(
            new RoomChatHandler(connection, this),
            new RoomDataHandler(connection, this),
            new RoomDimmerPresetsHandler(connection, this),
            new RoomPermissionsHandler(connection, this),
            new RoomSessionHandler(connection, this),
            new RoomUsersHandler(connection, this),
            new RoomPresentHandler(connection, this),
            new GenericErrorHandler(connection, this),
            new WordQuizHandler(connection, this),
            new PollHandler(connection, this),
            new PetPackageHandler(connection, this),
        );
    }

    private setupReconnectListener(): void
    {
        GetEventDispatcher().addEventListener(NitroEventType.SOCKET_RECONNECTING, () =>
        {
              this._isReconnecting = true;
        });

        GetEventDispatcher().addEventListener(NitroEventType.SOCKET_RECONNECTED, () =>
        {
            this.clearGuardTimer();
            this._reconnectGuardTimer = setTimeout(() =>
            {
                this._reconnectGuardTimer = null;

                if(!this._isReconnecting) return;
                this.attemptRoomReEntry();
            }, 5000);
        });

        GetEventDispatcher().addEventListener(NitroEventType.SOCKET_REAUTHENTICATED, () =>
        {
            this.clearGuardTimer();
            this.attemptRoomReEntry();
        });

        GetEventDispatcher().addEventListener(NitroEventType.SOCKET_RECONNECT_FAILED, () =>
        {
            this.clearGuardTimer();
            this._isReconnecting = false;
            this._lastRoomId = -1;
            this._lastRoomPassword = null;
            this.clearPersistedRoom();
        });

        GetEventDispatcher().addEventListener(NitroEventType.SOCKET_CLOSED, () =>
        {
            this.clearGuardTimer();
            this._isReconnecting = false;
            this._lastRoomId = -1;
            this._lastRoomPassword = null;
            this.clearPersistedRoom();
        });
    }

    private clearGuardTimer(): void
    {
        if(this._reconnectGuardTimer)
        {
            clearTimeout(this._reconnectGuardTimer);
            this._reconnectGuardTimer = null;
        }
    }

    private attemptRoomReEntry(): void
    {
        const roomId = this._lastRoomId;
        const password = this._lastRoomPassword;

        if(roomId <= 0)
        {
            this._isReconnecting = false;

            return;
        }

        this._sessions.clear();
        this._viewerSession = null;
        this.createSession(roomId, password);
        this.clearGuardTimer();
        this._reconnectGuardTimer = setTimeout(() =>
        {
            this._reconnectGuardTimer = null;

            if(this._isReconnecting)
            {
                this._isReconnecting = false;
            }
        }, 10000);
    }

    public tryRestoreSession(): boolean
    {
        try
        {
            const storedRoomId = sessionStorage.getItem(STORAGE_KEY_ROOM_ID);

            if(!storedRoomId) return false;

            const roomId = parseInt(storedRoomId, 10);

            if(isNaN(roomId) || roomId <= 0) return false;

            const password = sessionStorage.getItem(STORAGE_KEY_ROOM_PASSWORD) || null;

            this._isReconnecting = true;

            this.createSession(roomId, password);

            this.clearGuardTimer();
            this._reconnectGuardTimer = setTimeout(() =>
            {
                this._reconnectGuardTimer = null;

                if(this._isReconnecting)
                {
                    this._isReconnecting = false;
                }
            }, 10000);

            return true;
        }
        catch(e)
        {
            return false;
        }
    }

    private persistRoom(roomId: number, password: string): void
    {
        try
        {
            if(roomId > 0)
            {
                sessionStorage.setItem(STORAGE_KEY_ROOM_ID, roomId.toString());

                if(password)
                {
                    sessionStorage.setItem(STORAGE_KEY_ROOM_PASSWORD, password);
                }
                else
                {
                    sessionStorage.removeItem(STORAGE_KEY_ROOM_PASSWORD);
                }
            }
            else
            {
                this.clearPersistedRoom();
            }
        }
        catch(e) {}
    }

    private clearPersistedRoom(): void
    {
        try
        {
            sessionStorage.removeItem(STORAGE_KEY_ROOM_ID);
            sessionStorage.removeItem(STORAGE_KEY_ROOM_PASSWORD);
        }
        catch(e) {}
    }

    private setHandlers(session: IRoomSession): void
    {
        if(!this._handlers || !this._handlers.length) return;

        for(const handler of this._handlers)
        {
            if(!handler) continue;

            handler.setRoomId(session.roomId);
        }
    }

    private processPendingSession(): void
    {
        if(!this._pendingSession) return;

        this.addSession(this._pendingSession);

        this._pendingSession = null;
    }

    public getSession(id: number): IRoomSession
    {
        const existing = this._sessions.get(this.getRoomId(id));

        if(!existing) return null;

        return existing;
    }

    public createSession(roomId: number, password: string = null): boolean
    {
        const session = new RoomSession();

        session.roomId = roomId;
        session.password = password;

        return this.addSession(session);
    }

    private addSession(roomSession: IRoomSession): boolean
    {
        this._sessionStarting = true;

        if(this._sessions.get(this.getRoomId(roomSession.roomId))) this.removeSession(roomSession.roomId, false);

        this._sessions.set(this.getRoomId(roomSession.roomId), roomSession);

        GetEventDispatcher().dispatchEvent(new RoomSessionEvent(RoomSessionEvent.CREATED, roomSession));

        this._viewerSession = roomSession;

        this._lastRoomId = roomSession.roomId;
        this._lastRoomPassword = roomSession.password;
        this.persistRoom(roomSession.roomId, roomSession.password);

        this.startSession(this._viewerSession);

        return true;
    }

    public startSession(session: IRoomSession): boolean
    {
        if(session.state === RoomSessionEvent.STARTED) return false;

        this._sessionStarting = false;

        if(!session.start())
        {
            this.removeSession(session.roomId);

            return false;
        }

        GetEventDispatcher().dispatchEvent(new RoomSessionEvent(RoomSessionEvent.STARTED, session));

        this.setHandlers(session);

        return true;
    }

    public removeSession(id: number, openLandingView: boolean = true): void
    {
        const session = this.getSession(id);

        if(!session) return;

        this._sessions.delete(this.getRoomId(id));

        if(openLandingView && !this._isReconnecting)
        {
            this._lastRoomId = -1;
            this._lastRoomPassword = null;
            this.clearPersistedRoom();
        }

        if(this._isReconnecting)
        {
            return;
        }

        GetEventDispatcher().dispatchEvent(new RoomSessionEvent(RoomSessionEvent.ENDED, session, openLandingView));
    }

    public sessionUpdate(id: number, type: string): void
    {
        const session = this.getSession(id);

        if(!session)
        {
            return;
        }

        switch(type)
        {
            case RoomSessionHandler.RS_CONNECTED:
                if(this._isReconnecting)
                {
                    this.clearGuardTimer();
                    this._isReconnecting = false;
                }

                return;
            case RoomSessionHandler.RS_READY:

                if(this._isReconnecting)
                {
                    this.clearGuardTimer();
                    this._isReconnecting = false;
                }

                return;
            case RoomSessionHandler.RS_DISCONNECTED:

                if(this._isReconnecting) return;

                this.removeSession(id);
                return;
        }
    }

    public sessionReinitialize(fromRoomId: number, toRoomId: number): void
    {
        const existing = this.getSession(fromRoomId);

        if(!existing) return;

        this._sessions.delete(this.getRoomId(fromRoomId));

        existing.reset(toRoomId);

        this._sessions.set(this.getRoomId(toRoomId), existing);

        this._lastRoomId = toRoomId;
        this.persistRoom(toRoomId, existing.password);

        this.setHandlers(existing);
    }

    private getRoomId(id: number): string
    {
        return 'hard_coded_room_id';
    }

    public get viewerSession(): IRoomSession
    {
        return this._viewerSession;
    }
}
