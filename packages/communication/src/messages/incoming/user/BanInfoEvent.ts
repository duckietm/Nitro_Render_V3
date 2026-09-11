import { IMessageEvent } from '@octane/api';
import { MessageEvent } from '@octane/events';
import { BanInfoParser } from '../../parser';

export class BanInfoEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, BanInfoParser);
    }

    public getParser(): BanInfoParser
    {
        return this.parser as BanInfoParser;
    }
}
