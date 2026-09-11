import { IMessageEvent } from '@octane/api';
import { MessageEvent } from '@octane/events';
import { MyReportsStatusMessageParser } from '../../parser';

export class MyReportsStatusMessageEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, MyReportsStatusMessageParser);
    }

    public getParser(): MyReportsStatusMessageParser
    {
        return this.parser as MyReportsStatusMessageParser;
    }
}
