import { IMessageEvent } from '@octane/api';
import { MessageEvent } from '@octane/events';
import { PurchasableChatStylesMessageParser } from '../../parser';

export class PurchasableChatStylesMessageEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, PurchasableChatStylesMessageParser);
    }

    public getParser(): PurchasableChatStylesMessageParser
    {
        return this.parser as PurchasableChatStylesMessageParser;
    }
}
