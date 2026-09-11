import { IMessageEvent } from '@octane/api';
import { MessageEvent } from '@octane/events';
import { IncomeRewardNotificationParser } from '../../parser';

export class IncomeRewardNotificationEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, IncomeRewardNotificationParser);
    }

    public getParser(): IncomeRewardNotificationParser
    {
        return this.parser as IncomeRewardNotificationParser;
    }
}
