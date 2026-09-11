import { IMessageEvent } from '@octane/api';
import { MessageEvent } from '@octane/events';
import { TreasureHuntFirstWinnerMessageParser } from '../../parser';

export class TreasureHuntFirstWinnerMessageEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, TreasureHuntFirstWinnerMessageParser);
    }

    public getParser(): TreasureHuntFirstWinnerMessageParser
    {
        return this.parser as TreasureHuntFirstWinnerMessageParser;
    }
}
