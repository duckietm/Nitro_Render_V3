import { IMessageEvent } from '@octane/api';
import { MessageEvent } from '@octane/events';
import { HabbiconInfoParser } from '../../parser/habbicons';

export class HabbiconInfoEvent extends MessageEvent implements IMessageEvent
{
    constructor(callback: (event: HabbiconInfoEvent) => void)
    {
        super(callback, HabbiconInfoParser);
    }

    public getParser(): HabbiconInfoParser
    {
        return this.parser as HabbiconInfoParser;
    }
}
