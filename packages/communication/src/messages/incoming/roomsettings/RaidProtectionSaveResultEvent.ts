import { IMessageEvent } from '@octane/api';
import { MessageEvent } from '@octane/events';
import { RaidProtectionSaveResultParser } from '../../parser';

export class RaidProtectionSaveResultEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, RaidProtectionSaveResultParser);
    }

    public getParser(): RaidProtectionSaveResultParser
    {
        return this.parser as RaidProtectionSaveResultParser;
    }
}
