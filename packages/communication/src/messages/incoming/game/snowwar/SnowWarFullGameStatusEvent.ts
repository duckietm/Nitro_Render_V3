import { IMessageEvent } from '@nitrots/api';
import { MessageEvent } from '@nitrots/events';
import { SnowWarFullGameStatusParser } from '../../../parser';

export class SnowWarFullGameStatusEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, SnowWarFullGameStatusParser);
    }

    public getParser(): SnowWarFullGameStatusParser
    {
        return this.parser as SnowWarFullGameStatusParser;
    }
}
