import { IMessageComposer } from '@octane/api';

/**
 * Official `BlockedUsersManager.initBlockList()` (composer 485): asks the server for the
 * session block list, which is separate from the ignore list.
 */
export class GetBlockedUsersComposer implements IMessageComposer<ConstructorParameters<typeof GetBlockedUsersComposer>>
{
    private _data: ConstructorParameters<typeof GetBlockedUsersComposer>;

    constructor()
    {
        this._data = [];
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
