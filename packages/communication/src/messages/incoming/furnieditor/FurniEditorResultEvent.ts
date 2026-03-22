import { IMessageEvent } from '@nitrots/api';
import { MessageEvent } from '@nitrots/events';
import { FurniEditorResultParser } from '../../parser';

export class FurniEditorResultEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, FurniEditorResultParser);
    }

    public getParser(): FurniEditorResultParser
    {
        return this.parser as FurniEditorResultParser;
    }
}
