import { IMessageEvent } from '@nitrots/api';
import { MessageEvent } from '@nitrots/events';
import { UiSettingsDataParser } from '../../parser/uisettings/UiSettingsDataParser';

export class UiSettingsDataEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, UiSettingsDataParser);
    }

    public getParser(): UiSettingsDataParser
    {
        return this.parser as UiSettingsDataParser;
    }
}
