import { IMessageDataWrapper } from '@nitrots/api';

export class WiredFurniOpacityMessageData
{
    private _furniIds: number[] = [];
    private _opacity: number;
    private _clickThrough: boolean;
    private _easing: number;

    constructor(wrapper: IMessageDataWrapper)
    {
        const count = Math.max(0, wrapper.readInt());

        for(let index = 0; index < count; index++) this._furniIds.push(wrapper.readInt());

        this._opacity = wrapper.readInt();
        this._clickThrough = wrapper.readBoolean();
        this._easing = wrapper.readInt();
    }

    public get furniIds(): number[] { return this._furniIds; }
    public get opacity(): number { return this._opacity; }
    public get clickThrough(): boolean { return this._clickThrough; }
    public get easing(): number { return this._easing; }
}
