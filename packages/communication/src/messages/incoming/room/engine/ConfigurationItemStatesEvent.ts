import { IMessageEvent } from '@octane/api';
import { MessageEvent } from '@octane/events';
import { ConfigurationItemStatesParser } from '../../../parser';

export class ConfigurationItemStatesEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, ConfigurationItemStatesParser);
    }

    public getParser(): ConfigurationItemStatesParser
    {
        return this.parser as ConfigurationItemStatesParser;
    }
}
