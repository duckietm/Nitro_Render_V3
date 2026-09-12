import { IMessageEvent } from '@octane/api';
import { MessageEvent } from '@octane/events';
import { RaidProtectionSettingsParser } from '../../parser';

export class RaidProtectionSettingsEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, RaidProtectionSettingsParser);
    }

    public getParser(): RaidProtectionSettingsParser
    {
        return this.parser as RaidProtectionSettingsParser;
    }
}
