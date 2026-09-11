import { IMessageComposer } from '@octane/api';

/**
 * Official `MarketPlaceLogic.clearOwnHistory(state)` -> `HabboCatalog.clearOwnMarketPlaceHistory(state)`
 * (AIR 13 composer 2058). `state` is the own-offers tab being cleared and is only ever
 * `SOLD` (2) or `EXPIRED` (3): the official client refuses anything else
 * (`MarketPlaceOfferState.isClearable`).
 */
export class ClearOwnMarketplaceHistoryMessageComposer implements IMessageComposer<ConstructorParameters<typeof ClearOwnMarketplaceHistoryMessageComposer>>
{
    private _data: ConstructorParameters<typeof ClearOwnMarketplaceHistoryMessageComposer>;

    constructor(state: number)
    {
        this._data = [state];
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
