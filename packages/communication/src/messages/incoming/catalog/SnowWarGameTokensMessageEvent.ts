import { IMessageEvent } from '@octane/api';
import { MessageEvent } from '@octane/events';
import { SnowWarGameTokensMessageParser } from '../../parser';

export class SnowWarGameTokensMessageEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, SnowWarGameTokensMessageParser);
    }

    public getParser(): SnowWarGameTokensMessageParser
    {
        return this.parser as SnowWarGameTokensMessageParser;
    }
}
