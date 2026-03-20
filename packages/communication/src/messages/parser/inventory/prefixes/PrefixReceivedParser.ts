import { IMessageDataWrapper, IMessageParser } from '@nitrots/api';

export class PrefixReceivedParser implements IMessageParser
{
    private _id: number;
    private _text: string;
    private _color: string;
    private _icon: string;
    private _effect: string;

    public flush(): boolean
    {
        this._id = 0;
        this._text = '';
        this._color = '';
        this._icon = '';
        this._effect = '';
        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._id = wrapper.readInt();
        this._text = wrapper.readString();
        this._color = wrapper.readString();
        this._icon = wrapper.readString();
        this._effect = wrapper.readString();

        return true;
    }

    public get id(): number { return this._id; }
    public get text(): string { return this._text; }
    public get color(): string { return this._color; }
    public get icon(): string { return this._icon; }
    public get effect(): string { return this._effect; }
}
