import { IMessageDataWrapper, IMessageParser } from '@octane/api';
import { ItemStateUpdateData } from './ItemStateUpdateData';

/**
 * Official `class_3328` (`ItemsStateUpdate`, 3697): `int count [ int id str
 * itemData ]`, the batched form of the single wall-item state update.
 */
export class ItemsStateUpdateParser implements IMessageParser
{
    private _items: ItemStateUpdateData[];

    public flush(): boolean
    {
        this._items = [];

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._items = [];

        let totalItems = wrapper.readInt();

        while(totalItems > 0)
        {
            const id = wrapper.readInt();
            const itemData = wrapper.readString();

            this._items.push(new ItemStateUpdateData(id, itemData));

            totalItems--;
        }

        return true;
    }

    public get items(): ItemStateUpdateData[]
    {
        return this._items;
    }

    public get itemCount(): number
    {
        return this._items.length;
    }

    public getItemData(index: number): ItemStateUpdateData
    {
        if((index < 0) || (index >= this._items.length)) return null;

        return this._items[index];
    }
}
