import { IMessageDataWrapper, IMessageParser } from '@octane/api';
import { LeaderboardEntry } from './LeaderboardEntry';

/**
 * AIR `Game2GroupLeaderboardParser`: the all-time group table. Rows carry the
 * group id in `userId`, the badge code in `figure` and the gender marker `g`;
 * `favouriteGroupId` is the viewer's own group, highlighted in the list.
 */
export class Game2GroupLeaderboardParser implements IMessageParser
{
    private _leaderboard: LeaderboardEntry[];
    private _totalListSize: number;
    private _gameTypeId: number;
    private _favouriteGroupId: number;

    public flush(): boolean
    {
        this._leaderboard = [];
        this._totalListSize = -1;
        this._gameTypeId = -1;
        this._favouriteGroupId = -1;

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        const count = wrapper.readInt();
        this._leaderboard = [];
        for(let index = 0; index < count; index++) this._leaderboard.push(new LeaderboardEntry(wrapper));
        this._totalListSize = wrapper.readInt();
        this._gameTypeId = wrapper.readInt();
        this._favouriteGroupId = wrapper.readInt();

        return true;
    }

    public get leaderboard(): LeaderboardEntry[]
    {
        return this._leaderboard;
    }

    public get totalListSize(): number
    {
        return this._totalListSize;
    }

    public get gameTypeId(): number
    {
        return this._gameTypeId;
    }

    public get favouriteGroupId(): number
    {
        return this._favouriteGroupId;
    }
}
