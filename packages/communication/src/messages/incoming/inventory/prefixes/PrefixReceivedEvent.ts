import { IMessageEvent } from '@nitrots/api';
import { MessageEvent } from '@nitrots/events';
import { PrefixReceivedParser } from '../../../parser';

export class PrefixReceivedEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, PrefixReceivedParser);
    }

    public getParser(): PrefixReceivedParser
    {
        return this.parser as PrefixReceivedParser;
    }
}
