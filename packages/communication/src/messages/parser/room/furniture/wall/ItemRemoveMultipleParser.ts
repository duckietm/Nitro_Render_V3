import { IMessageDataWrapper, IMessageParser } from '@octane/api';

/**
 * Official `class_2992` (`ItemRemoveMultiple`, 2204): `int count [ int itemId ]
 * int pickerId`, the wall-item twin of `ObjectRemoveMultiple`.
 */
export class ItemRemoveMultipleParser implements IMessageParser
{
    private _itemIds: number[];
    private _pickerId: number;

    public flush(): boolean
    {
        this._itemIds = [];
        this._pickerId = 0;

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._itemIds = [];

        let totalItems = wrapper.readInt();

        while(totalItems > 0)
        {
            this._itemIds.push(wrapper.readInt());

            totalItems--;
        }

        this._pickerId = wrapper.readInt();

        return true;
    }

    public get itemIds(): number[]
    {
        return this._itemIds;
    }

    public get pickerId(): number
    {
        return this._pickerId;
    }
}
