import { IMessageDataWrapper, IMessageParser } from '@octane/api';

/**
 * Official AIR 13 event 2580 (`SessionDataManager.onPurchasableChatStyleChanged`): one
 * purchasable chat bubble style was added to (or taken away from) this account, so the
 * selector updates without asking for the whole list again.
 */
export class ChatStyleNotificationMessageParser implements IMessageParser
{
    private _added: boolean;
    private _styleId: number;

    public flush(): boolean
    {
        this._added = false;
        this._styleId = 0;

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._added = wrapper.readBoolean();
        this._styleId = wrapper.readInt();

        return true;
    }

    public get added(): boolean
    {
        return this._added;
    }

    public get styleId(): number
    {
        return this._styleId;
    }
}
