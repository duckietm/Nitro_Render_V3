import { IMessageDataWrapper, IMessageParser } from '@octane/api';

/**
 * Official AIR 13 event 933 (`HabboCatalog.onLtdRaffleEntered`): the purchase of a
 * limited-edition item went into a raffle, so the confirmation dialog starts its
 * "hold on while we process your LTD purchase" animation instead of closing.
 * The payload is the class name of the item being raffled.
 */
export class LtdRaffleEnteredMessageParser implements IMessageParser
{
    private _className: string;

    public flush(): boolean
    {
        this._className = null;

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._className = wrapper.readString();

        return true;
    }

    public get className(): string
    {
        return this._className;
    }
}
