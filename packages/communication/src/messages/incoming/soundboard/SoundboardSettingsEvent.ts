import { IMessageEvent } from '@nitrots/api';
import { MessageEvent } from '@nitrots/events';
import { SoundboardSettingsParser } from '../../parser';

export class SoundboardSettingsEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, SoundboardSettingsParser);
    }

    public getParser(): SoundboardSettingsParser
    {
        return this.parser as SoundboardSettingsParser;
    }
}
