import { IMessageEvent } from '@octane/api';
import { MessageEvent } from '@octane/events';
import { UserGameAchievementsMessageParser } from '../../../parser';

export class UserGameAchievementsMessageEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: (event: IMessageEvent) => void)
    {
        super(callBack, UserGameAchievementsMessageParser);
    }

    public getParser(): UserGameAchievementsMessageParser
    {
        return this.parser as UserGameAchievementsMessageParser;
    }
}
