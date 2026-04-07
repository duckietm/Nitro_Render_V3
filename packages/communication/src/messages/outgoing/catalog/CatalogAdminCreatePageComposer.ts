import { IMessageComposer } from '@nitrots/api';

export class CatalogAdminCreatePageComposer implements IMessageComposer<ConstructorParameters<typeof CatalogAdminCreatePageComposer>>
{
    private _data: ConstructorParameters<typeof CatalogAdminCreatePageComposer>;

    constructor(caption: string, caption2: string, layout: string, iconType: number, minRank: number, visible: boolean, enabled: boolean, orderNum: number, parentId: number, targetCatalogType: string, catalogMode: string = 'NORMAL')
    {
        this._data = [ caption, caption2, layout, iconType, minRank, visible, enabled, orderNum, parentId, targetCatalogType, catalogMode ];
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
