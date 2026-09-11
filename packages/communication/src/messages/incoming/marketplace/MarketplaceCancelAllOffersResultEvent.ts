import { IMessageEvent } from '@octane/api';
import { MessageEvent } from '@octane/events';
import { MarketplaceCancelAllOffersResultParser } from '../../parser';

export class MarketplaceCancelAllOffersResultEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, MarketplaceCancelAllOffersResultParser);
    }

    public getParser(): MarketplaceCancelAllOffersResultParser
    {
        return this.parser as MarketplaceCancelAllOffersResultParser;
    }
}
