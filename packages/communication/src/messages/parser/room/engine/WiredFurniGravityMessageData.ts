import { IMessageDataWrapper } from '@nitrots/api';

export class WiredFurniGravityMessageData
{
    private _furniIds: number[] = [];
    private _gravity: number;

    constructor(wrapper: IMessageDataWrapper)
    {
        const count = Math.max(0, wrapper.readInt());

        for(let index = 0; index < count; index++) this._furniIds.push(wrapper.readInt());

        this._gravity = wrapper.readInt();
    }

    public get furniIds(): number[] { return this._furniIds; }
    public get gravity(): number { return this._gravity; }
}
