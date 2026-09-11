import { IMessageComposer } from '@octane/api';

/**
 * Official `RoomSession.unmuteUser(userId)` -> composer 3302 `(userId, roomId)`: the
 * ambassador `ambassador_unmute` row of the avatar menu (`AvatarMenuView.as:180`).
 */
export class RoomUnmuteUserComposer implements IMessageComposer<ConstructorParameters<typeof RoomUnmuteUserComposer>>
{
    private _data: ConstructorParameters<typeof RoomUnmuteUserComposer>;

    constructor(userId: number, roomId: number = 0)
    {
        this._data = [userId, roomId];
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
