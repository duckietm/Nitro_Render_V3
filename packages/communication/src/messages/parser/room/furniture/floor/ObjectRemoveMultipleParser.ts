import { IMessageDataWrapper, IMessageParser } from '@octane/api';

/**
 * Official `class_2853` (`ObjectRemoveMultiple`, 1451): `int count [ int id ]
 * int pickerId`. `class_1902.onObjectRemoveMultiple` disposes every floor
 * object and refreshes the tile object map once.
 */
export class ObjectRemoveMultipleParser implements IMessageParser
{
    private _ids: number[];
    private _pickerId: number;

    public flush(): boolean
    {
        this._ids = [];
        this._pickerId = 0;

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._ids = [];

        let totalIds = wrapper.readInt();

        while(totalIds > 0)
        {
            this._ids.push(wrapper.readInt());

            totalIds--;
        }

        this._pickerId = wrapper.readInt();

        return true;
    }

    public get ids(): number[]
    {
        return this._ids;
    }

    public get pickerId(): number
    {
        return this._pickerId;
    }
}
