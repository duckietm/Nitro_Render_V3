import { IMessageComposer } from '@octane/api';

/** Official `BlockedUsersManager.unblockUser(userId)` (composer 1886). */
export class UnblockUserComposer implements IMessageComposer<ConstructorParameters<typeof UnblockUserComposer>>
{
    private _data: ConstructorParameters<typeof UnblockUserComposer>;

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
