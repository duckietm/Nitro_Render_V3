import { IMessageComposer } from '@nitrots/api';

export class CatalogAdminDeletePageComposer implements IMessageComposer<ConstructorParameters<typeof CatalogAdminDeletePageComposer>>
{
    private _data: ConstructorParameters<typeof CatalogAdminDeletePageComposer>;

    constructor(pageId: number)
    {
        this._data = [ pageId ];
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
