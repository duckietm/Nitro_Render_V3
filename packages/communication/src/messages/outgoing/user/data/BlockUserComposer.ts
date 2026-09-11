import { IMessageComposer } from '@octane/api';

/** Official `BlockedUsersManager.blockUser(userId)` (composer 697). */
export class BlockUserComposer implements IMessageComposer<ConstructorParameters<typeof BlockUserComposer>>
{
    private _data: ConstructorParameters<typeof BlockUserComposer>;

    constructor(userId: number)
    {
        this._data = [userId];
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
