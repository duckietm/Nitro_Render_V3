import { IMessageComposer } from '@nitrots/api';

export class CatalogAdminMoveOfferComposer implements IMessageComposer<ConstructorParameters<typeof CatalogAdminMoveOfferComposer>>
{
    private _data: ConstructorParameters<typeof CatalogAdminMoveOfferComposer>;

    constructor(offerId: number, orderNumber: number)
    {
        this._data = [ offerId, orderNumber ];
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
