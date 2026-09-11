import { IMessageEvent } from '@octane/api';
import { MessageEvent } from '@octane/events';
import { WiredEnvironmentParser } from '../../parser';

export class WiredEnvironmentEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, WiredEnvironmentParser);
    }

    public getParser(): WiredEnvironmentParser
    {
        return this.parser as WiredEnvironmentParser;
    }
}
