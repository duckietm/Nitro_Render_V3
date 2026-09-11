import { IMessageEvent } from '@octane/api';
import { MessageEvent } from '@octane/events';
import { TreasureHuntFailMessageParser } from '../../parser';

export class TreasureHuntFailMessageEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, TreasureHuntFailMessageParser);
    }

    public getParser(): TreasureHuntFailMessageParser
    {
        return this.parser as TreasureHuntFailMessageParser;
    }
}
