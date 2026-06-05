import { IMessageDataWrapper, IMessageParser } from '@nitrots/api';

export class CatalogAdminPageDetailsMessageParser implements IMessageParser
{
    private _pageId: number;
    private _caption: string;
    private _captionSave: string;
    private _minRank: number;
    private _orderNum: number;
    private _visible: boolean;
    private _enabled: boolean;

    public flush(): boolean
    {
        this._pageId = -1;
        this._caption = '';
        this._captionSave = '';
        this._minRank = 1;
        this._orderNum = 0;
        this._visible = true;
        this._enabled = true;

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._pageId = wrapper.readInt();
        this._caption = wrapper.readString();
        this._captionSave = wrapper.readString();
        this._minRank = wrapper.readInt();
        this._orderNum = wrapper.readInt();
        this._visible = wrapper.readBoolean();
        this._enabled = wrapper.readBoolean();

        return true;
    }

    public get pageId(): number { return this._pageId; }
    public get caption(): string { return this._caption; }
    public get captionSave(): string { return this._captionSave; }
    public get minRank(): number { return this._minRank; }
    public get orderNum(): number { return this._orderNum; }
    public get visible(): boolean { return this._visible; }
    public get enabled(): boolean { return this._enabled; }
}
