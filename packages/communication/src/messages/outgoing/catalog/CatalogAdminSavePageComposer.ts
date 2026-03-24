import { IMessageComposer } from '@nitrots/api';

export class CatalogAdminSavePageComposer implements IMessageComposer<ConstructorParameters<typeof CatalogAdminSavePageComposer>>
{
    private _data: ConstructorParameters<typeof CatalogAdminSavePageComposer>;

    constructor(pageId: number, caption: string, caption2: string, layout: string, iconType: number, minRank: number, visible: boolean, enabled: boolean, orderNum: number, parentId: number, headline: string, teaser: string, textDetails: string)
    {
        this._data = [ pageId, caption, caption2, layout, iconType, minRank, visible, enabled, orderNum, parentId, headline, teaser, textDetails ];
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
