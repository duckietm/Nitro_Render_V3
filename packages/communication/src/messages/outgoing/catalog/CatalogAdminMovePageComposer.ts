import { IMessageComposer } from '@nitrots/api';

export class CatalogAdminMovePageComposer implements IMessageComposer<ConstructorParameters<typeof CatalogAdminMovePageComposer>>
{
    private _data: ConstructorParameters<typeof CatalogAdminMovePageComposer>;

    constructor(pageId: number, newParentId: number, newIndex: number, catalogMode: string = 'NORMAL')
    {
        this._data = [ pageId, newParentId, newIndex, catalogMode ];
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
