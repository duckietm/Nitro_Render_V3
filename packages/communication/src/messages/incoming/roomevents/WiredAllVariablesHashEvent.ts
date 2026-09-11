import { IMessageEvent } from '@octane/api';
import { MessageEvent } from '@octane/events';
import { WiredAllVariablesHashParser } from '../../parser';

export class WiredAllVariablesHashEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, WiredAllVariablesHashParser);
    }

    public getParser(): WiredAllVariablesHashParser
    {
        return this.parser as WiredAllVariablesHashParser;
    }
}
