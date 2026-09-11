import { IMessageComposer } from '@octane/api';

/**
 * Official `SessionDataManager.replenishRespect()` (composer 3728): buys the daily respect
 * points back with duckets when `respectsLeft` hit zero and `respectReplenishesLeft` is left.
 */
export class ReplenishRespectComposer implements IMessageComposer<ConstructorParameters<typeof ReplenishRespectComposer>>
{
    private _data: ConstructorParameters<typeof ReplenishRespectComposer>;

    constructor()
    {
        this._data = [];
    }

    public getMessageArray()
    {
        return this._data;
    }

    public dispose(): void
    {
        return;
    }
}
