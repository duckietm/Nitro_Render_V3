import { IMessageComposer } from '@octane/api';

/**
 * AIR `WeeklyGroupLeaderboardTable.getMessageComposer`: the weekly group table
 * page request (game type, week offset, first rank, scroll direction, view
 * size, window size).
 */
export class Game2GetWeeklyGroupLeaderboardComposer implements IMessageComposer<ConstructorParameters<typeof Game2GetWeeklyGroupLeaderboardComposer>>
{
    private _data: ConstructorParameters<typeof Game2GetWeeklyGroupLeaderboardComposer>;

    constructor(gameTypeId: number, weekOffset: number, startRank: number, direction: number, viewSize: number, windowSize: number)
    {
        this._data = [ gameTypeId, weekOffset, startRank, direction, viewSize, windowSize ];
    }

    public getMessageArray()
    {
        return this._data;
    }

    public dispose(): void
    {
        this._data = null;
    }
}
