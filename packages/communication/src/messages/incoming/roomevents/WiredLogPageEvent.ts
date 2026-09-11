import { IMessageEvent } from '@octane/api';
import { MessageEvent } from '@octane/events';
import { WiredLogPageParser } from '../../parser';

export class WiredLogPageEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, WiredLogPageParser);
    }

    public getParser(): WiredLogPageParser
    {
        return this.parser as WiredLogPageParser;
    }
}
