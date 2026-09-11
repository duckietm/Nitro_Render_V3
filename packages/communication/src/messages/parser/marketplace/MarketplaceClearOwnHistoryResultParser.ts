import { IMessageDataWrapper, IMessageParser } from '@octane/api';

/**
 * Official AIR 13 event 175 (`MarketPlaceLogic.onClearOwnHistoryResult`): a single flag
 * saying whether the sold/expired rows the player asked to clear were removed.
 */
export class MarketplaceClearOwnHistoryResultParser implements IMessageParser
{
    private _success: boolean;

    public flush(): boolean
    {
        this._success = false;

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._success = wrapper.readBoolean();

        return true;
    }

    public get success(): boolean
    {
        return this._success;
    }
}
