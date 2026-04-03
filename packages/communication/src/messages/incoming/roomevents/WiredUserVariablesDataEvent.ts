import { IMessageEvent } from '@nitrots/api';
import { MessageEvent } from '@nitrots/events';
import { WiredUserVariablesDataParser } from '../../parser';

export class WiredUserVariablesDataEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, WiredUserVariablesDataParser);
    }

    public getParser(): WiredUserVariablesDataParser
    {
        return this.parser as WiredUserVariablesDataParser;
    }
}
