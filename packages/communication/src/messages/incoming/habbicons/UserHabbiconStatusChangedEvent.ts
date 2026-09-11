import { IMessageEvent } from '@octane/api';
import { MessageEvent } from '@octane/events';
import { UserHabbiconStatusChangedParser } from '../../parser/habbicons';

export class UserHabbiconStatusChangedEvent extends MessageEvent implements IMessageEvent
{
    constructor(callback: (event: UserHabbiconStatusChangedEvent) => void)
    {
        super(callback, UserHabbiconStatusChangedParser);
    }

    public getParser(): UserHabbiconStatusChangedParser
    {
        return this.parser as UserHabbiconStatusChangedParser;
    }
}
