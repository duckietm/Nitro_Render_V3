/**
 * One entry of `ItemsStateUpdate`, official `class_3340`: the wall item id and
 * its new item data; `state` is the numeric reading of the item data, which is
 * what the official visualization consumes.
 */
export class ItemStateUpdateData
{
    private _id: number;
    private _itemData: string;
    private _state: number;

    constructor(id: number, itemData: string)
    {
        this._id = id;
        this._itemData = itemData;

        const parsed = parseFloat(itemData);

        this._state = isNaN(parsed) ? 0 : Math.trunc(parsed);
    }

    public get id(): number
    {
        return this._id;
    }

    public get itemData(): string
    {
        return this._itemData;
    }

    public get state(): number
    {
        return this._state;
    }
}
