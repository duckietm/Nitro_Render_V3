import { IMessageComposer } from '@nitrots/api';

export class CatalogAdminDeleteOfferComposer implements IMessageComposer<ConstructorParameters<typeof CatalogAdminDeleteOfferComposer>>
{
    private _data: ConstructorParameters<typeof CatalogAdminDeleteOfferComposer>;

    constructor(offerId: number)
    {
        this._data = [ offerId ];
    }

    dispose(): void
    {
        this._data = null;
    }

    public getMessageArray()
    {
        return this._data;
    }
}
