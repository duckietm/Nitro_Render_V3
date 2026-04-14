import { IMessageComposer } from '@nitrots/api';

export class CatalogAdminDeletePageComposer implements IMessageComposer<ConstructorParameters<typeof CatalogAdminDeletePageComposer>>
{
    private _data: ConstructorParameters<typeof CatalogAdminDeletePageComposer>;

    constructor(pageId: number, catalogMode: string = 'NORMAL')
    {
        this._data = [ pageId, catalogMode ];
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
