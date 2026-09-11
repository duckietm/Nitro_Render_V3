import { IMessageDataWrapper, IMessageParser } from '@octane/api';

/**
 * Official AIR 13 event 1949 (`MarketPlaceLogic.onCancelAllResult`): the ids of the
 * offers the server actually pulled back, then whether the batch succeeded.
 */
export class MarketplaceCancelAllOffersResultParser implements IMessageParser
{
    private _offerIds: number[];
    private _success: boolean;

    public flush(): boolean
    {
        this._offerIds = [];
        this._success = false;

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._offerIds = [];

        let totalOffers = wrapper.readInt();

        while(totalOffers > 0)
        {
            this._offerIds.push(wrapper.readInt());

            totalOffers--;
        }

        this._success = wrapper.readBoolean();

        return true;
    }

    public get offerIds(): number[]
    {
        return this._offerIds;
    }

    public get success(): boolean
    {
        return this._success;
    }
}
