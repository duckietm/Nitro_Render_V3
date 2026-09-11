import { IMessageEvent } from '@octane/api';
import { MessageEvent } from '@octane/events';
import { LatencyPingResponseParser } from '../../parser';

export class LatencyPingResponseEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, LatencyPingResponseParser);
    }

    public getParser(): LatencyPingResponseParser
    {
        return this.parser as LatencyPingResponseParser;
    }
}
