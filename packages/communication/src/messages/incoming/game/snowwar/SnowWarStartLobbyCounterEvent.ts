import { IMessageEvent } from '@nitrots/api';
import { MessageEvent } from '@nitrots/events';
import { SnowWarStartLobbyCounterParser } from '../../../parser';

export class SnowWarStartLobbyCounterEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, SnowWarStartLobbyCounterParser);
    }

    public getParser(): SnowWarStartLobbyCounterParser
    {
        return this.parser as SnowWarStartLobbyCounterParser;
    }
}
