import { IMessageComposer } from '@octane/api';

export class RoomNetworkOpenConnectionMessageComposer implements IMessageComposer<ConstructorParameters<typeof RoomNetworkOpenConnectionMessageComposer>>
{
    private _data: ConstructorParameters<typeof RoomNetworkOpenConnectionMessageComposer>;

    /**
     * Official `class_2150` via `RoomSessionManager.gotoRoomNetwork`: the room
     * network to hop into and the home room the server may prefer (0 when it
     * must not).
     */
    constructor(networkId: number, homeRoomId: number)
    {
        this._data = [networkId, homeRoomId];
    }

    public getMessageArray()
    {
        return this._data;
    }

    public dispose(): void
    {
        return;
    }
}
