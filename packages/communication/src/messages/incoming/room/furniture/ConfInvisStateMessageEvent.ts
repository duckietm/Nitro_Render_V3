import { IMessageEvent } from '@nitrots/api';
import { MessageEvent } from '@nitrots/events';
import { ConfInvisStateMessageParser } from '../../../parser';

export class ConfInvisStateMessageEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, ConfInvisStateMessageParser);
    }

    public getParser(): ConfInvisStateMessageParser
    {
        return this.parser as ConfInvisStateMessageParser;
    }
}
