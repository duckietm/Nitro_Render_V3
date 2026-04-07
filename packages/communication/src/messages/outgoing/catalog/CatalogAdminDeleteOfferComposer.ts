import { IMessageComposer } from '@nitrots/api';

export class CatalogAdminDeleteOfferComposer implements IMessageComposer<ConstructorParameters<typeof CatalogAdminDeleteOfferComposer>>
{
    private _data: ConstructorParameters<typeof CatalogAdminDeleteOfferComposer>;

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
