import { IMessageEvent } from '@octane/api';
import { MessageEvent } from '@octane/events';
import { BlockedUsersParser } from '../../parser';

export class BlockedUsersEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, BlockedUsersParser);
    }

    public getParser(): BlockedUsersParser
    {
        return this.parser as BlockedUsersParser;
    }
}
