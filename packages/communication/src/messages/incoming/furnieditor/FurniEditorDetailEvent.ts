import { IMessageEvent } from '@nitrots/api';
import { MessageEvent } from '@nitrots/events';
import { FurniEditorDetailParser } from '../../parser';

export class FurniEditorDetailEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, FurniEditorDetailParser);
    }

    public getParser(): FurniEditorDetailParser
    {
        return this.parser as FurniEditorDetailParser;
    }
}
