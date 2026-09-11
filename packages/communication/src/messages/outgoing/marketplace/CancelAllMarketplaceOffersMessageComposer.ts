import { IMessageComposer } from '@octane/api';

/**
 * Official `MarketPlaceLogic.recallAllOffers()` -> `HabboCatalog.cancelAllMarketPlaceOffers()`
 * (AIR 13 composer 1228, no payload). The server answers with the cancel-all result event.
 */
export class CancelAllMarketplaceOffersMessageComposer implements IMessageComposer<ConstructorParameters<typeof CancelAllMarketplaceOffersMessageComposer>>
{
    private _data: ConstructorParameters<typeof CancelAllMarketplaceOffersMessageComposer>;

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
        this._data = null;
    }
}
