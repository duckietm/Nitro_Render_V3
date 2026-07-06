import { IMessageEvent } from '@nitrots/api';
import { MessageEvent } from '@nitrots/events';
import { ChestLogMessageParser } from '../../../parser';

export class ChestLogEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, ChestLogMessageParser);
    }

    public getParser(): ChestLogMessageParser
    {
        return this.parser as ChestLogMessageParser;
    }
}
