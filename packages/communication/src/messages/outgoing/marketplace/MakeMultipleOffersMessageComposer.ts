import { IMessageComposer } from '@octane/api';

/**
 * Official `MarketplaceModel.makeOffer(price, count)` -> composer 1551
 * `(price:int, furniType:int, itemIds:Vector.<int>)`: one price for a batch of identical
 * items, so the seller lists several copies in a single offer. `furniType` is 1 for a
 * floor item and 2 for a wall item, exactly as the single-item `MakeOfferMessageComposer`.
 */
export class MakeMultipleOffersMessageComposer implements IMessageComposer<number[]>
{
    private _data: number[];

    constructor(credits: number, furniType: number, itemIds: number[])
    {
        const ids = itemIds || [];

        this._data = [credits, furniType, ids.length, ...ids];
    }

    public getMessageArray(): number[]
    {
        return this._data;
    }

    public dispose(): void
    {
        this._data = null;
    }
}
