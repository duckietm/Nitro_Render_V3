import { IMessageEvent } from '@octane/api';
import { MessageEvent } from '@octane/events';
import { WiredVariableHoldersPageParser } from '../../parser';

export class WiredVariableHoldersPageEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, WiredVariableHoldersPageParser);
    }

    public getParser(): WiredVariableHoldersPageParser
    {
        return this.parser as WiredVariableHoldersPageParser;
    }
}
