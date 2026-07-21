import { IMessageDataWrapper } from '@nitrots/api';

export class SnowWarLevelItemData
{
    private _name: string;
    private _x: number;
    private _y: number;
    private _rotation: number;

    constructor(wrapper: IMessageDataWrapper)
    {
        this._name = wrapper.readString();
        this._x = wrapper.readInt();
        this._y = wrapper.readInt();
        this._rotation = wrapper.readInt();
    }

    public get name(): string
    {
        return this._name;
    }

    public get x(): number
    {
        return this._x;
    }

    public get y(): number
    {
        return this._y;
    }

    public get rotation(): number
    {
        return this._rotation;
    }
}
