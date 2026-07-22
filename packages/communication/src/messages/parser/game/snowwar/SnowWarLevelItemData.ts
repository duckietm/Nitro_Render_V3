import { IMessageDataWrapper } from '@nitrots/api';

export class SnowWarLevelItemData
{
    private _name: string;
    private _x: number;
    private _y: number;
    private _rotation: number;
    private _imageUrl: string;

    constructor(wrapper: IMessageDataWrapper)
    {
        this._name = wrapper.readString();
        this._x = wrapper.readInt();
        this._y = wrapper.readInt();
        this._rotation = wrapper.readInt();
        // Optional room-ad image (empty for normal props). Trailing per-item
        // string so old servers that don't emit it still parse - guarded by
        // the item count, not bytesAvailable.
        this._imageUrl = wrapper.readString();
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

    public get imageUrl(): string
    {
        return this._imageUrl;
    }
}
