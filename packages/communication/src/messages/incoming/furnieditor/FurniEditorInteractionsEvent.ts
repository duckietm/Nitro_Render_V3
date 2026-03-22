import { IMessageEvent } from '@nitrots/api';
import { MessageEvent } from '@nitrots/events';
import { FurniEditorInteractionsParser } from '../../parser';

export class FurniEditorInteractionsEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, FurniEditorInteractionsParser);
    }

    public getParser(): FurniEditorInteractionsParser
    {
        return this.parser as FurniEditorInteractionsParser;
    }
}
