import { IMessageEvent } from '@nitrots/api';
import { MessageEvent } from '@nitrots/events';
import { EarningsCenterParser } from '../../parser';

export class EarningsCenterEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, EarningsCenterParser);
    }

    public getParser(): EarningsCenterParser
    {
        return this.parser as EarningsCenterParser;
    }
}
