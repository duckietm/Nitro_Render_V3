import { IMessageEvent } from '@octane/api';
import { MessageEvent } from '@octane/events';
import { SelfDonationResultMessageParser } from '../../parser';

export class SelfDonationResultMessageEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, SelfDonationResultMessageParser);
    }

    public getParser(): SelfDonationResultMessageParser
    {
        return this.parser as SelfDonationResultMessageParser;
    }
}
