import { IMessageEvent } from '@octane/api';
import { MessageEvent } from '@octane/events';
import { ObjectRemoveMultipleParser } from '../../../../parser';

export class ObjectRemoveMultipleEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, ObjectRemoveMultipleParser);
    }

    public getParser(): ObjectRemoveMultipleParser
    {
        return this.parser as ObjectRemoveMultipleParser;
    }
}
