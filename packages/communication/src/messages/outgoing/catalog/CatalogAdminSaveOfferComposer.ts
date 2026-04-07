import { IMessageComposer } from '@nitrots/api';

export class CatalogAdminSaveOfferComposer implements IMessageComposer<ConstructorParameters<typeof CatalogAdminSaveOfferComposer>>
{
    private _data: ConstructorParameters<typeof CatalogAdminSaveOfferComposer>;

    constructor(offerId: number, pageId: number, itemId: number, catalogName: string, costCredits: number, costPoints: number, pointsType: number, amount: number, clubOnly: number, extradata: string, haveOffer: boolean, offerIdGroup: number, limitedStack: number, orderNumber: number, catalogMode: string = 'NORMAL')
    {
        this._data = [ offerId, pageId, itemId, catalogName, costCredits, costPoints, pointsType, amount, clubOnly, extradata, haveOffer, offerIdGroup, limitedStack, orderNumber, catalogMode ];
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
