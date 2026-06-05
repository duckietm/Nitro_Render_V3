import { IMessageComposer } from '@nitrots/api';

export class CatalogAdminLoadOfferComposer implements IMessageComposer<ConstructorParameters<typeof CatalogAdminLoadOfferComposer>>
{
    private _data: ConstructorParameters<typeof CatalogAdminLoadOfferComposer>;

    constructor(offerId: number, catalogMode: string = 'NORMAL')
    {
        this._data = [ offerId, catalogMode ];
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
