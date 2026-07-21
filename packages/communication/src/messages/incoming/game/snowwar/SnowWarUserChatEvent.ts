import { IMessageEvent } from '@nitrots/api';
import { MessageEvent } from '@nitrots/events';
import { SnowWarUserChatParser } from '../../../parser';

export class SnowWarUserChatEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, SnowWarUserChatParser);
    }

    public getParser(): SnowWarUserChatParser
    {
        return this.parser as SnowWarUserChatParser;
    }
}
