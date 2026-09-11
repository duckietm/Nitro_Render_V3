import { IMessageEvent } from '@octane/api';
import { MessageEvent } from '@octane/events';
import { MarketplaceClearOwnHistoryResultParser } from '../../parser';

export class MarketplaceClearOwnHistoryResultEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, MarketplaceClearOwnHistoryResultParser);
    }

    public getParser(): MarketplaceClearOwnHistoryResultParser
    {
        return this.parser as MarketplaceClearOwnHistoryResultParser;
    }
}
