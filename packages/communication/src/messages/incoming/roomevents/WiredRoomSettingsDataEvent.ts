import { IMessageEvent } from '@nitrots/api';
import { MessageEvent } from '@nitrots/events';
import { WiredRoomSettingsDataParser } from '../../parser';

export class WiredRoomSettingsDataEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, WiredRoomSettingsDataParser);
    }

    public getParser(): WiredRoomSettingsDataParser
    {
        return this.parser as WiredRoomSettingsDataParser;
    }
}
