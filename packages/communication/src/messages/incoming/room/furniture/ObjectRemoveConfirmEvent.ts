import { IMessageEvent } from '@octane/api';
import { MessageEvent } from '@octane/events';
import { ObjectRemoveConfirmParser } from '../../../parser';

export class ObjectRemoveConfirmEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, ObjectRemoveConfirmParser);
    }

    public getParser(): ObjectRemoveConfirmParser
    {
        return this.parser as ObjectRemoveConfirmParser;
    }
}
