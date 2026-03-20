import { IMessageEvent } from '@nitrots/api';
import { MessageEvent } from '@nitrots/events';
import { UserPrefixesParser } from '../../../parser';

export class UserPrefixesEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, UserPrefixesParser);
    }

    public getParser(): UserPrefixesParser
    {
        return this.parser as UserPrefixesParser;
    }
}
