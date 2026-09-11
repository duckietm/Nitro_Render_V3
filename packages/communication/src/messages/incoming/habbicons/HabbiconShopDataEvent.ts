import { IMessageEvent } from '@octane/api';
import { MessageEvent } from '@octane/events';
import { HabbiconShopDataParser } from '../../parser/habbicons';

export class HabbiconShopDataEvent extends MessageEvent implements IMessageEvent
{
    constructor(callback: (event: HabbiconShopDataEvent) => void)
    {
        super(callback, HabbiconShopDataParser);
    }

    public getParser(): HabbiconShopDataParser
    {
        return this.parser as HabbiconShopDataParser;
    }
}
