import { IMessageEvent } from '@octane/api';
import { MessageEvent } from '@octane/events';
import { ItemRemoveMultipleParser } from '../../../../parser';

export class ItemRemoveMultipleEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, ItemRemoveMultipleParser);
    }

    public getParser(): ItemRemoveMultipleParser
    {
        return this.parser as ItemRemoveMultipleParser;
    }
}
