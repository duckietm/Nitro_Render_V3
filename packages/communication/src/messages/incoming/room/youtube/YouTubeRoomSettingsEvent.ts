import { IMessageEvent } from '@nitrots/api';
import { MessageEvent } from '@nitrots/events';
import { YouTubeRoomSettingsParser } from '../../../parser';

export class YouTubeRoomSettingsEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, YouTubeRoomSettingsParser);
    }

    public getParser(): YouTubeRoomSettingsParser
    {
        return this.parser as YouTubeRoomSettingsParser;
    }
}
