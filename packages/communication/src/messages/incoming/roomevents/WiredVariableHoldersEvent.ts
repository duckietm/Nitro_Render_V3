import { IMessageEvent } from '@octane/api';
import { MessageEvent } from '@octane/events';
import { WiredVariableHoldersParser } from '../../parser';

export class WiredVariableHoldersEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, WiredVariableHoldersParser);
    }

    public getParser(): WiredVariableHoldersParser
    {
        return this.parser as WiredVariableHoldersParser;
    }
}
