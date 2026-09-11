import { IMessageEvent } from '@octane/api';
import { MessageEvent } from '@octane/events';
import { DiscordPreferencesParser } from '../../parser';

export class DiscordPreferencesEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, DiscordPreferencesParser);
    }

    public getParser(): DiscordPreferencesParser
    {
        return this.parser as DiscordPreferencesParser;
    }
}
