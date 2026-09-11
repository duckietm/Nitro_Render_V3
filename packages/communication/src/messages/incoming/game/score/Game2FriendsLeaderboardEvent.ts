import { IMessageEvent } from '@octane/api';
import { MessageEvent } from '@octane/events';
import { Game2LeaderboardParser } from '../../../parser';

export class Game2FriendsLeaderboardEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, Game2LeaderboardParser);
    }

    public getParser(): Game2LeaderboardParser
    {
        return this.parser as Game2LeaderboardParser;
    }
}
