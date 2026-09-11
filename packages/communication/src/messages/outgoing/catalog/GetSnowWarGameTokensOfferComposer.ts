import { IMessageComposer } from '@octane/api';

/**
 * AIR `GetSnowWarGameTokensOfferComposer`: sent by `buySnowWarTokensOffer`
 * when the offers are not cached yet; the server answers with the offer list.
 */
export class GetSnowWarGameTokensOfferComposer implements IMessageComposer<ConstructorParameters<typeof GetSnowWarGameTokensOfferComposer>>
{
    private _data: ConstructorParameters<typeof GetSnowWarGameTokensOfferComposer>;

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
