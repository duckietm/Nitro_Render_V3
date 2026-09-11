import { IMessageEvent } from '@octane/api';
import { MessageEvent } from '@octane/events';
import { BlockResultParser } from '../../parser';

export class BlockResultEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, BlockResultParser);
    }

    public getParser(): BlockResultParser
    {
        return this.parser as BlockResultParser;
    }
}
