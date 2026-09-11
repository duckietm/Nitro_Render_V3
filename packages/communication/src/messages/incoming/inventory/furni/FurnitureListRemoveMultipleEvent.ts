import { IMessageEvent } from '@octane/api';
import { MessageEvent } from '@octane/events';
import { FurnitureListRemoveMultipleParser } from '../../../parser';

export class FurnitureListRemoveMultipleEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, FurnitureListRemoveMultipleParser);
    }

    public getParser(): FurnitureListRemoveMultipleParser
    {
        return this.parser as FurnitureListRemoveMultipleParser;
    }
}
