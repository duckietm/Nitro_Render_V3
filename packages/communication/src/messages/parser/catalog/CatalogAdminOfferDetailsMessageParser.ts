import { IMessageDataWrapper, IMessageParser } from '@nitrots/api';

export class CatalogAdminOfferDetailsMessageParser implements IMessageParser
{
    private _offerId: number;
    private _offerIdGroup: number;
    private _limitedStack: number;
    private _orderNumber: number;

    public flush(): boolean
    {
        this._offerId = -1;
        this._offerIdGroup = 0;
        this._limitedStack = 0;
        this._orderNumber = 0;

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._offerId = wrapper.readInt();
        this._offerIdGroup = wrapper.readInt();
        this._limitedStack = wrapper.readInt();
        this._orderNumber = wrapper.readInt();

        return true;
    }

    public get offerId(): number
    {
        return this._offerId;
    }

    public get offerIdGroup(): number
    {
        return this._offerIdGroup;
    }

    public get limitedStack(): number
    {
        return this._limitedStack;
    }

    public get orderNumber(): number
    {
        return this._orderNumber;
    }
}
