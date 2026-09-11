import { IMessageEvent } from '@octane/api';
import { MessageEvent } from '@octane/events';
import { WiredAllVariablesDiffParser } from '../../parser';

export class WiredAllVariablesDiffEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, WiredAllVariablesDiffParser);
    }

    public getParser(): WiredAllVariablesDiffParser
    {
        return this.parser as WiredAllVariablesDiffParser;
    }
}
