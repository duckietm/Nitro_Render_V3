import { IMessageEvent } from '@octane/api';
import { MessageEvent } from '@octane/events';
import { TreasureHuntUpdateMessageParser } from '../../parser';

export class TreasureHuntUpdateMessageEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, TreasureHuntUpdateMessageParser);
    }

    public getParser(): TreasureHuntUpdateMessageParser
    {
        return this.parser as TreasureHuntUpdateMessageParser;
    }
}
