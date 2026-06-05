import { IMessageComposer } from '@nitrots/api';

export class CatalogAdminLoadPageComposer implements IMessageComposer<ConstructorParameters<typeof CatalogAdminLoadPageComposer>>
{
    private _data: ConstructorParameters<typeof CatalogAdminLoadPageComposer>;

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
