import { IMessageEvent } from '@octane/api';
import { MessageEvent } from '@octane/events';
import { Game2WeeklyGroupLeaderboardParser } from '../../../parser';

export class Game2WeeklyGroupLeaderboardEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, Game2WeeklyGroupLeaderboardParser);
    }

    public getParser(): Game2WeeklyGroupLeaderboardParser
    {
        return this.parser as Game2WeeklyGroupLeaderboardParser;
    }
}
