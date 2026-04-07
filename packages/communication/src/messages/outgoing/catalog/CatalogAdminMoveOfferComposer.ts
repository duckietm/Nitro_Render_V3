import { IMessageComposer } from '@nitrots/api';

export class CatalogAdminMoveOfferComposer implements IMessageComposer<ConstructorParameters<typeof CatalogAdminMoveOfferComposer>>
{
    private _data: ConstructorParameters<typeof CatalogAdminMoveOfferComposer>;

    constructor(offerId: number, orderNumber: number, catalogMode: string = 'NORMAL')
    {
        this._data = [ offerId, orderNumber, catalogMode ];
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
