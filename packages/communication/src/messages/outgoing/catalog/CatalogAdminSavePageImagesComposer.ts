import { IMessageComposer } from '@nitrots/api';

export class CatalogAdminSavePageImagesComposer implements IMessageComposer<ConstructorParameters<typeof CatalogAdminSavePageImagesComposer>>
{
    private _data: ConstructorParameters<typeof CatalogAdminSavePageImagesComposer>;

    constructor(pageId: number, headerImage: string, teaserImage: string)
    {
        this._data = [ pageId, headerImage, teaserImage ];
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
