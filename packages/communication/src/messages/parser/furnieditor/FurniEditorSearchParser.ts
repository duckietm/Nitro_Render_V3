import { IMessageDataWrapper, IMessageParser } from '@nitrots/api';

export class FurniEditorSearchParser implements IMessageParser
{
    private _items: any[];
    private _total: number;
    private _page: number;

    public flush(): boolean
    {
        this._items = [];
        this._total = 0;
        this._page = 1;
        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        const count = wrapper.readInt();
        this._items = [];

        for(let i = 0; i < count; i++)
        {
            this._items.push({
                id: wrapper.readInt(),
                spriteId: wrapper.readInt(),
                itemName: wrapper.readString(),
                publicName: wrapper.readString(),
                type: wrapper.readString(),
                width: wrapper.readInt(),
                length: wrapper.readInt(),
                stackHeight: wrapper.readDouble(),
                allowStack: wrapper.readBoolean(),
                allowWalk: wrapper.readBoolean(),
                allowSit: wrapper.readBoolean(),
                allowLay: wrapper.readBoolean(),
                interactionType: wrapper.readString(),
                interactionModesCount: wrapper.readInt()
            });
        }

        this._total = wrapper.readInt();
        this._page = wrapper.readInt();

        return true;
    }

    public get items(): any[] { return this._items; }
    public get total(): number { return this._total; }
    public get page(): number { return this._page; }
}
