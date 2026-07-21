import { IMessageEvent } from '@nitrots/api';
import { MessageEvent } from '@nitrots/events';
import { SnowWarGameStatusParser } from '../../../parser';

export class SnowWarGameStatusEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, SnowWarGameStatusParser);
    }

    public getParser(): SnowWarGameStatusParser
    {
        return this.parser as SnowWarGameStatusParser;
    }
}
