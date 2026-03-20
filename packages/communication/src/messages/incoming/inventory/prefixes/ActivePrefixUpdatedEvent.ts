import { IMessageEvent } from '@nitrots/api';
import { MessageEvent } from '@nitrots/events';
import { ActivePrefixUpdatedParser } from '../../../parser';

export class ActivePrefixUpdatedEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, ActivePrefixUpdatedParser);
    }

    public getParser(): ActivePrefixUpdatedParser
    {
        return this.parser as ActivePrefixUpdatedParser;
    }
}
