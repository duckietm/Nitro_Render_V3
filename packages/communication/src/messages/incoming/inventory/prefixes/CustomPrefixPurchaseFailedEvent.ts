import { IMessageEvent } from '@nitrots/api';
import { MessageEvent } from '@nitrots/events';
import { CustomPrefixPurchaseFailedParser } from '../../../parser';

export class CustomPrefixPurchaseFailedEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, CustomPrefixPurchaseFailedParser);
    }

    public getParser(): CustomPrefixPurchaseFailedParser
    {
        return this.parser as CustomPrefixPurchaseFailedParser;
    }
}
