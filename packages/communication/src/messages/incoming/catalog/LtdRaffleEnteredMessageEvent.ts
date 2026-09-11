import { IMessageEvent } from '@octane/api';
import { MessageEvent } from '@octane/events';
import { LtdRaffleEnteredMessageParser } from '../../parser';

export class LtdRaffleEnteredMessageEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, LtdRaffleEnteredMessageParser);
    }

    public getParser(): LtdRaffleEnteredMessageParser
    {
        return this.parser as LtdRaffleEnteredMessageParser;
    }
}
