import { IMessageComposer } from '@octane/api';

/**
 * Official AIR 13 wired settings room-state buttons: `false` reloads the room's
 * wired configuration from storage, `true` rolls it back to the last saved state.
 */
export class WiredRoomStateActionComposer implements IMessageComposer<ConstructorParameters<typeof WiredRoomStateActionComposer>>
{
    private _data: ConstructorParameters<typeof WiredRoomStateActionComposer>;

    constructor(rollback: boolean)
    {
        this._data = [ rollback ];
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
