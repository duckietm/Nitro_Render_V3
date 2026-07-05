import { IMessageEvent } from '@nitrots/api';
import { MessageEvent } from '@nitrots/events';
import { ChestOpenMessageParser } from '../../../parser';

export class ChestOpenEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, ChestOpenMessageParser);
    }

    public getParser(): ChestOpenMessageParser
    {
        return this.parser as ChestOpenMessageParser;
    }
}
