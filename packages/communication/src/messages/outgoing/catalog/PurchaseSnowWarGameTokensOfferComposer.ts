import { IMessageComposer } from '@octane/api';

/**
 * AIR `PurchaseSnowWarGameTokensOfferComposer`: buys one game-token offer by
 * its id, charging credits and/or activity points.
 */
export class PurchaseSnowWarGameTokensOfferComposer implements IMessageComposer<ConstructorParameters<typeof PurchaseSnowWarGameTokensOfferComposer>>
{
    private _data: ConstructorParameters<typeof PurchaseSnowWarGameTokensOfferComposer>;

    constructor(offerId: number)
    {
        this._data = [ offerId ];
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
