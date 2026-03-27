import { IMessageEvent } from '@nitrots/api';
import { MessageEvent } from '@nitrots/events';
import { FurniEditorDetailResultMessageParser } from '../../parser';

export class FurniEditorDetailResultEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, FurniEditorDetailResultMessageParser);
    }

    public getParser(): FurniEditorDetailResultMessageParser
    {
        return this.parser as FurniEditorDetailResultMessageParser;
    }
}
