import { IMessageEvent } from '@octane/api';
import { MessageEvent } from '@octane/events';
import { HabbiconActionResultParser } from '../../parser/habbicons';

export class HabbiconActionResultEvent extends MessageEvent implements IMessageEvent
{
    constructor(callback: (event: HabbiconActionResultEvent) => void)
    {
        super(callback, HabbiconActionResultParser);
    }

    public getParser(): HabbiconActionResultParser
    {
        return this.parser as HabbiconActionResultParser;
    }
}
