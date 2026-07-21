import { IMessageEvent } from '@nitrots/api';
import { MessageEvent } from '@nitrots/events';
import { SnowWarUserRematchedParser } from '../../../parser';

export class SnowWarUserRematchedEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, SnowWarUserRematchedParser);
    }

    public getParser(): SnowWarUserRematchedParser
    {
        return this.parser as SnowWarUserRematchedParser;
    }
}
