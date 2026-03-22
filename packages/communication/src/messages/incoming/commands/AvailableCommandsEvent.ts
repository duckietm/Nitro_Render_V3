import { IMessageEvent } from '@nitrots/api';
import { MessageEvent } from '@nitrots/events';
import { AvailableCommandsParser } from '../../parser';

export class AvailableCommandsEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, AvailableCommandsParser);
    }

    public getParser(): AvailableCommandsParser
    {
        return this.parser as AvailableCommandsParser;
    }
}