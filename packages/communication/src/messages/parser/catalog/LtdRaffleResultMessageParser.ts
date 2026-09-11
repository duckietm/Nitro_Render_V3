import { IMessageDataWrapper, IMessageParser } from '@octane/api';

/**
 * Official AIR 13 event 2316 (`HabboCatalog.onLtdRaffleResult`): the raffle for a
 * limited-edition item is over. The official client treats result code 0 as a win
 * (`notification.raffle.won`) and anything else as a loss (`notification.raffle.lost`).
 */
export class LtdRaffleResultMessageParser implements IMessageParser
{
    /** The player got the item. */
    public static readonly RESULT_WON: number = 0;
    /** Somebody else got it. */
    public static readonly RESULT_LOST: number = 1;
    /** The raffle was cancelled before it ended. */
    public static readonly RESULT_CANCELLED: number = 2;
    /** The raffle could not be resolved. */
    public static readonly RESULT_ERROR: number = 3;

    private _className: string;
    private _resultCode: number;

    public flush(): boolean
    {
        this._className = null;
        this._resultCode = 0;

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._className = wrapper.readString();
        this._resultCode = wrapper.readByte();

        return true;
    }

    public get className(): string
    {
        return this._className;
    }

    public get resultCode(): number
    {
        return this._resultCode;
    }

    public get hasWon(): boolean
    {
        return this._resultCode === LtdRaffleResultMessageParser.RESULT_WON;
    }
}
