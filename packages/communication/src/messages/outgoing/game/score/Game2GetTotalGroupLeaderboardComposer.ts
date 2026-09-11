import { IMessageComposer } from '@octane/api';

/**
 * AIR `TotalGroupLeaderboardTable.getMessageComposer`: the all-time group
 * table page request (game type, first rank, scroll direction, view size,
 * window size).
 */
export class Game2GetTotalGroupLeaderboardComposer implements IMessageComposer<ConstructorParameters<typeof Game2GetTotalGroupLeaderboardComposer>>
{
    private _data: ConstructorParameters<typeof Game2GetTotalGroupLeaderboardComposer>;

    constructor(gameTypeId: number, startRank: number, direction: number, viewSize: number, windowSize: number)
    {
        this._data = [ gameTypeId, startRank, direction, viewSize, windowSize ];
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
