import { IMessageDataWrapper, IMessageParser } from '@octane/api';

/**
 * Official `class_3613` (`FurniListRemoveMultiple`, 2813): `int count [ int
 * stripId ]`. `HabboInventory.onFurniListRemoveMultiple` drops every strip id
 * from the furni model in one pass instead of one `FurniListRemove` per item.
 */
export class FurnitureListRemoveMultipleParser implements IMessageParser
{
    private _stripIds: number[];

    public flush(): boolean
    {
        this._stripIds = [];

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._stripIds = [];

        let totalIds = wrapper.readInt();

        while(totalIds > 0)
        {
            this._stripIds.push(wrapper.readInt());

            totalIds--;
        }

        return true;
    }

    public get stripIds(): number[]
    {
        return this._stripIds;
    }
}
