import { IMessageEvent } from '@octane/api';
import { MessageEvent } from '@octane/events';
import { UserHabbiconsParser } from '../../parser/habbicons';

export class UserHabbiconsEvent extends MessageEvent implements IMessageEvent
{
    constructor(callback: (event: UserHabbiconsEvent) => void)
    {
        super(callback, UserHabbiconsParser);
    }

    public getParser(): UserHabbiconsParser
    {
        return this.parser as UserHabbiconsParser;
    }
}
