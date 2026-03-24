import { IMessageComposer } from '@nitrots/api';

export class CatalogAdminMovePageComposer implements IMessageComposer<ConstructorParameters<typeof CatalogAdminMovePageComposer>>
{
    private _data: ConstructorParameters<typeof CatalogAdminMovePageComposer>;

    constructor(pageId: number, newParentId: number, newIndex: number)
    {
        this._data = [ pageId, newParentId, newIndex ];
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
