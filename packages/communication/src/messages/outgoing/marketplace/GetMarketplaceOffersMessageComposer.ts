import { IMessageComposer } from '@octane/api';

/**
 * Official `HabboCatalog.getPublicMarketPlaceOffers` -> composer 2407
 * `(min:int, max:int, query:String, type:int, combineUniques:Boolean = true)`.
 * `combineUniques` is the `combine_uniques_checkbox` of `marketplace_search_simple`:
 * when true the server folds identical LTD offers into one row, when false every
 * unique copy is listed on its own.
 */
export class GetMarketplaceOffersMessageComposer implements IMessageComposer<ConstructorParameters<typeof GetMarketplaceOffersMessageComposer>>
{
    private _data: ConstructorParameters<typeof GetMarketplaceOffersMessageComposer>;

    constructor(min: number, max: number, query: string, type: number, combineUniques: boolean = true)
    {
        this._data = [min, max, query, type, combineUniques];
    }

    public getMessageArray()
    {
        return this._data;
    }

    public dispose(): void
    {
        this._data = null;
    }
}
