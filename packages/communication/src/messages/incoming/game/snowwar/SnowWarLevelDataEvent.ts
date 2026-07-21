import { IMessageEvent } from '@nitrots/api';
import { MessageEvent } from '@nitrots/events';
import { SnowWarLevelDataParser } from '../../../parser';

export class SnowWarLevelDataEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, SnowWarLevelDataParser);
    }

    public getParser(): SnowWarLevelDataParser
    {
        return this.parser as SnowWarLevelDataParser;
    }
}
