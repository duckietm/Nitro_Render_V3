import { IMessageEvent } from '@nitrots/api';
import { MessageEvent } from '@nitrots/events';
import { SnowWarPlayerExitedArenaParser } from '../../../parser';

export class SnowWarPlayerExitedArenaEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, SnowWarPlayerExitedArenaParser);
    }

    public getParser(): SnowWarPlayerExitedArenaParser
    {
        return this.parser as SnowWarPlayerExitedArenaParser;
    }
}
