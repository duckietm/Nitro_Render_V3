import { IMessageEvent } from '@nitrots/api';
import { MessageEvent } from '@nitrots/events';
import { HousekeepingUserDetailParser } from '../../parser';

export class HousekeepingUserDetailEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, HousekeepingUserDetailParser);
    }

    public getParser(): HousekeepingUserDetailParser
    {
        return this.parser as HousekeepingUserDetailParser;
    }
}
