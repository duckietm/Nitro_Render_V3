import { IMessageEvent } from '@octane/api';
import { MessageEvent } from '@octane/events';
import { RaidProtectionCapabilityParser } from '../../parser';

export class RaidProtectionCapabilityEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, RaidProtectionCapabilityParser);
    }

    public getParser(): RaidProtectionCapabilityParser
    {
        return this.parser as RaidProtectionCapabilityParser;
    }
}
