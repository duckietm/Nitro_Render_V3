import { IMessageDataWrapper, IMessageParser } from '@octane/api';
import { LeaderboardEntry } from './LeaderboardEntry';

/**
 * AIR `Game2LeaderboardParser`: the all-time (friends / total) table. Unlike
 * the weekly tables it carries no week header, only the page and its size.
 */
export class Game2LeaderboardParser implements IMessageParser
{
    private _leaderboard: LeaderboardEntry[];
    private _totalListSize: number;
    private _gameTypeId: number;

    public flush(): boolean
    {
        this._leaderboard = [];
        this._totalListSize = -1;
        this._gameTypeId = -1;

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
}
