import { IMessageComposer } from '@nitrots/api';

export class CatalogAdminCreateOfferComposer implements IMessageComposer<ConstructorParameters<typeof CatalogAdminCreateOfferComposer>>
{
    private _data: ConstructorParameters<typeof CatalogAdminCreateOfferComposer>;

    constructor(pageId: number, itemId: number, catalogName: string, costCredits: number, costPoints: number, pointsType: number, amount: number, clubOnly: number, extradata: string, haveOffer: boolean, offerIdGroup: number, limitedStack: number, orderNumber: number, catalogMode: string = 'NORMAL')
    {
        this._data = [ pageId, itemId, catalogName, costCredits, costPoints, pointsType, amount, clubOnly, extradata, haveOffer, offerIdGroup, limitedStack, orderNumber, catalogMode ];
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
