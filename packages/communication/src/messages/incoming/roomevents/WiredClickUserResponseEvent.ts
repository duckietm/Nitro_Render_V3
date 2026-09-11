import { IMessageEvent } from '@octane/api';
import { MessageEvent } from '@octane/events';
import { WiredClickUserResponseParser } from '../../parser';

export class WiredClickUserResponseEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, WiredClickUserResponseParser);
    }

    public getParser(): WiredClickUserResponseParser
    {
        return this.parser as WiredClickUserResponseParser;
    }
}
