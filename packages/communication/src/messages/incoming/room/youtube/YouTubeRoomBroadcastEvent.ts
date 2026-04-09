import { IMessageEvent } from '@nitrots/api';
import { MessageEvent } from '@nitrots/events';
import { YouTubeRoomBroadcastParser } from '../../../parser';

export class YouTubeRoomBroadcastEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, YouTubeRoomBroadcastParser);
    }

    public getParser(): YouTubeRoomBroadcastParser
    {
        return this.parser as YouTubeRoomBroadcastParser;
    }
}
