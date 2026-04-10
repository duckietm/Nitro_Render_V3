import { IMessageComposer } from '@nitrots/api';

export class CatalogAdminSavePageIconComposer implements IMessageComposer<ConstructorParameters<typeof CatalogAdminSavePageIconComposer>>
{
    private _data: ConstructorParameters<typeof CatalogAdminSavePageIconComposer>;

    constructor(pageId: number, iconId: number)
    {
        this._data = [ pageId, iconId ];
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
