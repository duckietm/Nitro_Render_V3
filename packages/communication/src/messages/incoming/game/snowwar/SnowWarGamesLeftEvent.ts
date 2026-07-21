import { IMessageEvent } from '@nitrots/api';
import { MessageEvent } from '@nitrots/events';
import { SnowWarGamesLeftParser } from '../../../parser';

export class SnowWarGamesLeftEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, SnowWarGamesLeftParser);
    }

    public getParser(): SnowWarGamesLeftParser
    {
        return this.parser as SnowWarGamesLeftParser;
    }
}
