import { IMessageEvent } from '@nitrots/api';
import { MessageEvent } from '@nitrots/events';
import { FurniEditorSearchParser } from '../../parser';

export class FurniEditorSearchEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, FurniEditorSearchParser);
    }

    public getParser(): FurniEditorSearchParser
    {
        return this.parser as FurniEditorSearchParser;
    }
}
