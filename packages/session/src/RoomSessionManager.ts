import { IRoomHandlerListener, IRoomSession, IRoomSessionManager } from '@nitrots/api';
import { GetCommunication, RoomEnterComposer, RoomUnitWalkComposer } from '@nitrots/communication';
import { GetEventDispatcher, NitroEventType, RoomSessionEvent } from '@nitrots/events';
import { NitroLogger } from '@nitrots/utils';
import { RoomSession } from './RoomSession';
import { BaseHandler, GenericErrorHandler, PetPackageHandler, PollHandler, RoomChatHandler, RoomDataHandler, RoomDimmerPresetsHandler, RoomPermissionsHandler, RoomPresentHandler, RoomSessionHandler, RoomUsersHandler, WordQuizHandler } from './handler';

const STORAGE_KEY_ROOM_ID = 'nitro.session.lastRoomId';
const STORAGE_KEY_ROOM_PASSWORD = 'nitro.session.lastRoomPassword';
const STORAGE_KEY_POS_X = 'nitro.session.lastPosX';
const STORAGE_KEY_POS_Y = 'nitro.session.lastPosY';

export class RoomSessionManager implements IRoomSessionManager, IRoomHandlerListener
{
    private _handlers: BaseHandler[] = [];
    private _sessions: Map<string, IRoomSession> = new Map();
    private _pendingSession: IRoomSession = null;

    private _sessionStarting: boolean = false;
    private _viewerSession: IRoomSession = null;

    // Reconnection state tracking
    private _lastRoomId: number = -1;
    private _lastRoomPassword: string = null;
    private _isReconnecting: boolean = false;
    private _reconnectGuardTimer: ReturnType<typeof setTimeout> = null;
    private _pendingRoomClear: ReturnType<typeof setTimeout> = null;
    private _savedPosX: number = -1;
    private _savedPosY: number = -1;

    public async init(): Promise<void>
    {
        console.log('[RoomSessionManager] init() called');
        this.createHandlers();
        this.processPendingSession();
        this.setupReconnectListener();

        // Check if there's a persisted room from a network disconnect (Vite page reload).
        // sessionStorage survives same-tab reloads but is cleared on browser close.
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

            NitroLogger.log('[RoomSessionManager] Found persisted room ' + roomId + ' - setting guard for page-reload restore');

            // Pre-load memory state so attemptRoomReEntry and tryRestoreSession can use it
            this._lastRoomId = roomId;
            this._lastRoomPassword = sessionStorage.getItem(STORAGE_KEY_ROOM_PASSWORD) || null;

            // Enable guard to block DesktopViewEvent until we enter the stored room
            this._isReconnecting = true;
        }
        catch(e)
        {
            // sessionStorage not available
        }
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
        console.log('[RoomSessionManager] setupReconnectListener() - registering event listeners');

        // Mark reconnecting state early so DesktopViewEvent / home room redirects
        // don't clear the tracked room before we can re-enter it
        GetEventDispatcher().addEventListener(NitroEventType.SOCKET_RECONNECTING, () =>
        {
            // Cancel any pending room ID clear from removeSession().
            // The server sends DesktopViewEvent before closing the socket, which
            // schedules a delayed clear. We need to preserve the room ID for re-entry.
            this.cancelRoomIdClear();

            // Re-persist room to sessionStorage (it was cleared in removeSession)
            if(this._lastRoomId > 0)
            {
                this.persistRoom(this._lastRoomId, this._lastRoomPassword);
            }

            console.log('[RoomSessionManager] SOCKET_RECONNECTING fired! lastRoomId=' + this._lastRoomId);
            this._isReconnecting = true;
        });

        // SOCKET_RECONNECTED: the WebSocket is open but NOT yet authenticated.
        // We set up a fallback timer here in case the server doesn't send
        // AuthenticatedEvent (e.g. SSO ticket consumed).
        GetEventDispatcher().addEventListener(NitroEventType.SOCKET_RECONNECTED, () =>
        {
            console.log('[RoomSessionManager] SOCKET_RECONNECTED fired! lastRoomId=' + this._lastRoomId);

            // Fallback: if REAUTHENTICATED doesn't fire within 5 seconds,
            // try to re-enter the room anyway (the connection might still work)
            this.clearGuardTimer();
            this._reconnectGuardTimer = setTimeout(() =>
            {
                this._reconnectGuardTimer = null;

                if(!this._isReconnecting) return;

                NitroLogger.log('[RoomSessionManager] REAUTHENTICATED timeout - attempting fallback room re-entry for room ' + this._lastRoomId);
                this.attemptRoomReEntry();
            }, 5000);
        });

        // REAUTHENTICATED: SSO handshake completed, connection is ready to send messages
        GetEventDispatcher().addEventListener(NitroEventType.SOCKET_REAUTHENTICATED, () =>
        {
            console.log('[RoomSessionManager] SOCKET_REAUTHENTICATED fired! lastRoomId=' + this._lastRoomId);

            // Snapshot the saved position BEFORE re-entering (re-entry overwrites sessionStorage)
            this.snapshotSavedPosition();

            this.clearGuardTimer();
            this.attemptRoomReEntry();
        });

        GetEventDispatcher().addEventListener(NitroEventType.SOCKET_RECONNECT_FAILED, () =>
        {
            NitroLogger.log('[RoomSessionManager] SOCKET_RECONNECT_FAILED - clearing state');
            this.clearGuardTimer();
            this._isReconnecting = false;
            this._lastRoomId = -1;
            this._lastRoomPassword = null;
            this.clearPersistedRoom();
            this.clearPersistedPosition();
        });

        // When the socket is permanently closed (server shutdown, max retries),
        // clear the persisted room so the next page load uses normal navigation
        GetEventDispatcher().addEventListener(NitroEventType.SOCKET_CLOSED, () =>
        {
            NitroLogger.log('[RoomSessionManager] SOCKET_CLOSED - clearing persisted room');
            this.clearGuardTimer();
            this._isReconnecting = false;
            this._lastRoomId = -1;
            this._lastRoomPassword = null;
            this.clearPersistedRoom();
            this.clearPersistedPosition();
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

    private scheduleRoomIdClear(): void
    {
        if(this._pendingRoomClear)
        {
            clearTimeout(this._pendingRoomClear);
        }

        this._pendingRoomClear = setTimeout(() =>
        {
            this._pendingRoomClear = null;
            this._lastRoomId = -1;
            this._lastRoomPassword = null;
        }, 5000);
    }

    private cancelRoomIdClear(): void
    {
        if(this._pendingRoomClear)
        {
            clearTimeout(this._pendingRoomClear);
            this._pendingRoomClear = null;
        }
    }

    private attemptRoomReEntry(): void
    {
        const roomId = this._lastRoomId;
        const password = this._lastRoomPassword;

        if(roomId <= 0)
        {
            NitroLogger.log('[RoomSessionManager] No room to re-enter (lastRoomId=' + roomId + '), dropping guard');
            this._isReconnecting = false;

            return;
        }

        // Check if we already have a session for this room (seamless reconnection).
        // The server-side SessionResumeManager kept the habbo alive in the room
        // during the grace period. The client's room view is still rendered behind
        // the reconnection overlay. Instead of tearing it down and rebuilding,
        // just drop the guard so the room view "unfreezes" in place.
        const existingSession = this.getSession(roomId);

        if(existingSession)
        {
            NitroLogger.log('[RoomSessionManager] Existing session found for room ' + roomId + ' — sending room enter request');

            // Re-send room enter request to the server with saved spawn coordinates.
            // The server will place the habbo directly at the saved position
            // instead of the door tile, providing a seamless reconnection experience.
            GetCommunication().connection.send(new RoomEnterComposer(roomId, password, this._savedPosX, this._savedPosY));

            // Keep the guard up briefly to absorb any stray server-side redirects
            // (DesktopViewEvent, etc.) from the login packet sequence, then drop it.
            this.clearGuardTimer();
            this._reconnectGuardTimer = setTimeout(() =>
            {
                this._reconnectGuardTimer = null;

                if(this._isReconnecting)
                {
                    NitroLogger.log('[RoomSessionManager] Session resume guard timeout - dropping guard');
                    this._isReconnecting = false;
                }
            }, 5000);

            return;
        }

        NitroLogger.log('[RoomSessionManager] Re-entering room ' + roomId);

        // No existing session — full room entry (e.g. page reload restore)
        this._sessions.clear();
        this._viewerSession = null;

        // Send the room enter request with saved spawn coordinates. The server
        // will place the habbo at the saved position instead of the door tile.
        this.createSession(roomId, password, this._savedPosX, this._savedPosY);

        // Keep the guard up for a generous window to absorb any DesktopViewEvent
        // or other server-side redirects that arrive after authentication.
        // The guard drops when:
        // 1. RS_CONNECTED/RS_READY fires (positive room entry confirmation), OR
        // 2. This safety timeout expires (10 seconds)
        this.clearGuardTimer();
        this._reconnectGuardTimer = setTimeout(() =>
        {
            this._reconnectGuardTimer = null;

            if(this._isReconnecting)
            {
                NitroLogger.log('[RoomSessionManager] Guard timeout (10s) - dropping guard');
                this._isReconnecting = false;
            }
        }, 10000);
    }

    /**
     * Called on page load (from MainView). Checks sessionStorage for a
     * persisted room ID from a network disconnect and enters it instead
     * of following the normal home room / hotel view flow.
     *
     * Returns true if a room restore was initiated.
     */
    public tryRestoreSession(): boolean
    {
        try
        {
            const storedRoomId = sessionStorage.getItem(STORAGE_KEY_ROOM_ID);

            if(!storedRoomId) return false;

            const roomId = parseInt(storedRoomId, 10);

            if(isNaN(roomId) || roomId <= 0) return false;

            const password = sessionStorage.getItem(STORAGE_KEY_ROOM_PASSWORD) || null;

            // Read saved position for page-reload restore
            let spawnX = -1;
            let spawnY = -1;

            try
            {
                const posX = sessionStorage.getItem(STORAGE_KEY_POS_X);
                const posY = sessionStorage.getItem(STORAGE_KEY_POS_Y);

                if(posX && posY)
                {
                    spawnX = parseInt(posX, 10);
                    spawnY = parseInt(posY, 10);

                    if(isNaN(spawnX) || isNaN(spawnY)) { spawnX = -1; spawnY = -1; }
                }
            }
            catch(e) { /* ignore */ }

            NitroLogger.log('[RoomSessionManager] Restoring session for room ' + roomId + ' from sessionStorage (spawn: ' + spawnX + ', ' + spawnY + ')');

            // Set the guard so DesktopViewEvent from the server's login sequence
            // doesn't kick us to hotel view before we enter the room
            this._isReconnecting = true;

            this.createSession(roomId, password, spawnX, spawnY);

            // Drop the guard when room entry succeeds or after timeout
            this.clearGuardTimer();
            this._reconnectGuardTimer = setTimeout(() =>
            {
                this._reconnectGuardTimer = null;

                if(this._isReconnecting)
                {
                    NitroLogger.log('[RoomSessionManager] Restore guard timeout (10s) - dropping guard');
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
        catch(e)
        {
            // sessionStorage not available (private browsing, etc.) - fail silently
        }
    }

    private clearPersistedRoom(): void
    {
        try
        {
            sessionStorage.removeItem(STORAGE_KEY_ROOM_ID);
            sessionStorage.removeItem(STORAGE_KEY_ROOM_PASSWORD);
            // Note: position keys (POS_X, POS_Y) are NOT cleared here.
            // They persist across the disconnect→reconnect cycle and are
            // sent to the server as spawn coordinates during re-entry.
        }
        catch(e)
        {
            // ignore
        }
    }

    private clearPersistedPosition(): void
    {
        try
        {
            sessionStorage.removeItem(STORAGE_KEY_POS_X);
            sessionStorage.removeItem(STORAGE_KEY_POS_Y);
        }
        catch(e)
        {
            // ignore
        }
    }

    private snapshotSavedPosition(): void
    {
        try
        {
            const posX = sessionStorage.getItem(STORAGE_KEY_POS_X);
            const posY = sessionStorage.getItem(STORAGE_KEY_POS_Y);

            if(!posX || !posY) return;

            this._savedPosX = parseInt(posX, 10);
            this._savedPosY = parseInt(posY, 10);

            NitroLogger.log('[RoomSessionManager] Snapshot saved position (' + this._savedPosX + ', ' + this._savedPosY + ')');
        }
        catch(e)
        {
            this._savedPosX = -1;
            this._savedPosY = -1;
        }
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

    public createSession(roomId: number, password: string = null, spawnX: number = -1, spawnY: number = -1): boolean
    {
        const session = new RoomSession();

        session.roomId = roomId;
        session.password = password;
        session.spawnX = spawnX;
        session.spawnY = spawnY;

        return this.addSession(session);
    }

    private addSession(roomSession: IRoomSession): boolean
    {
        this._sessionStarting = true;

        if(this._sessions.get(this.getRoomId(roomSession.roomId))) this.removeSession(roomSession.roomId, false);

        this._sessions.set(this.getRoomId(roomSession.roomId), roomSession);

        GetEventDispatcher().dispatchEvent(new RoomSessionEvent(RoomSessionEvent.CREATED, roomSession));

        this._viewerSession = roomSession;

        // Track room for reconnection (memory + sessionStorage)
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

        // During reconnection, block BOTH the session map deletion AND the ENDED event.
        // This preserves the session so attemptRoomReEntry can find it, and prevents
        // the UI from flashing hotel view during the reconnection flow.
        if(this._isReconnecting)
        {
            NitroLogger.log('[RoomSessionManager] removeSession fully blocked by reconnect guard (room=' + id + ', openLandingView=' + openLandingView + ')');

            return;
        }

        this._sessions.delete(this.getRoomId(id));

        if(openLandingView)
        {
            // Don't clear _lastRoomId immediately. During server shutdown the server
            // sends DesktopViewEvent (which triggers removeSession) BEFORE closing the
            // socket. If we clear the room ID now, the SOCKET_RECONNECTING handler
            // won't know which room to re-enter. Instead, delay the clear so that
            // SOCKET_RECONNECTING can cancel it and preserve the room info.
            this.clearPersistedRoom();
            this.scheduleRoomIdClear();
        }

        GetEventDispatcher().dispatchEvent(new RoomSessionEvent(RoomSessionEvent.ENDED, session, openLandingView));
    }

    public sessionUpdate(id: number, type: string): void
    {
        const session = this.getSession(id);

        if(!session)
        {
            NitroLogger.log('[RoomSessionManager] sessionUpdate(' + type + ') - no session found for id ' + id);

            return;
        }

        switch(type)
        {
            case RoomSessionHandler.RS_CONNECTED:
                NitroLogger.log('[RoomSessionManager] RS_CONNECTED for room ' + id);

                // Positive signal: we successfully entered the room.
                // Do NOT drop the guard yet — the server's login sequence may still
                // send a DesktopViewEvent that arrives after this. Keep the guard up
                // and let RS_READY (or the existing timeout) handle the final drop.
                if(this._isReconnecting)
                {
                    NitroLogger.log('[RoomSessionManager] Room entry confirmed - guard stays up until RS_READY');
                }

                return;
            case RoomSessionHandler.RS_READY:
                NitroLogger.log('[RoomSessionManager] RS_READY for room ' + id);

                // Room is fully loaded. Keep the guard up for a short grace period
                // to absorb any late DesktopViewEvent from the server's login sequence,
                // then drop it. This prevents a race where the login sequence's
                // DesktopViewEvent arrives after the room entry confirmation.
                if(this._isReconnecting)
                {
                    NitroLogger.log('[RoomSessionManager] Room ready confirmed - dropping guard in 3s');

                    // If we have saved spawn coordinates, send a walk command so the
                    // avatar moves to their previous position. This handles the EMU-restart
                    // case where the server has no ghost session and spawns at the door.
                    if(this._savedPosX >= 0 && this._savedPosY >= 0)
                    {
                        NitroLogger.log('[RoomSessionManager] Walking to saved position (' + this._savedPosX + ', ' + this._savedPosY + ')');
                        GetCommunication().connection.send(new RoomUnitWalkComposer(this._savedPosX, this._savedPosY));
                        this._savedPosX = -1;
                        this._savedPosY = -1;
                    }

                    this.clearGuardTimer();
                    this._reconnectGuardTimer = setTimeout(() =>
                    {
                        this._reconnectGuardTimer = null;

                        if(this._isReconnecting)
                        {
                            NitroLogger.log('[RoomSessionManager] Post-ready grace period elapsed - dropping guard');
                            this._isReconnecting = false;
                        }
                    }, 3000);
                }

                return;
            case RoomSessionHandler.RS_DISCONNECTED:
                NitroLogger.log('[RoomSessionManager] RS_DISCONNECTED for room ' + id + ' (isReconnecting=' + this._isReconnecting + ')');

                // During reconnection, don't process server-side disconnects
                // (DesktopViewEvent / home room redirect) - we'll re-enter the room
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

        // Update tracked room
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

    public get isReconnecting(): boolean
    {
        return this._isReconnecting;
    }
}
