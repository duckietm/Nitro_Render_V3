import { IMessageDataWrapper, IMessageParser } from '@octane/api';
import { TreasureHuntWinnerInfo } from './TreasureHuntWinnerInfo';

/** Official `class_2486`: the first winner of a treasure hunt. */
export class TreasureHuntFirstWinnerMessageParser implements IMessageParser
{
    private _winnerInfo: TreasureHuntWinnerInfo;

    public flush(): boolean
    {
        this._winnerInfo = null;

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._winnerInfo = new TreasureHuntWinnerInfo(wrapper);

        return true;
    }

    public get winnerInfo(): TreasureHuntWinnerInfo
    {
        return this._winnerInfo;
    }
}
