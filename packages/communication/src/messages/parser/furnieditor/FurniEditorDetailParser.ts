import { IMessageDataWrapper, IMessageParser } from '@nitrots/api';

export class FurniEditorDetailParser implements IMessageParser
{
    private _item: any;
    private _catalogItems: any[];
    private _furniDataJson: string;

    public flush(): boolean
    {
        this._item = null;
        this._catalogItems = [];
        this._furniDataJson = '';
        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._item = {
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
            interactionModesCount: wrapper.readInt(),
            // Extended fields
            allowGift: wrapper.readBoolean(),
            allowTrade: wrapper.readBoolean(),
            allowRecycle: wrapper.readBoolean(),
            allowMarketplaceSell: wrapper.readBoolean(),
            allowInventoryStack: wrapper.readBoolean(),
            vendingIds: wrapper.readString(),
            customparams: wrapper.readString(),
            effectIdMale: wrapper.readInt(),
            effectIdFemale: wrapper.readInt(),
            clothingOnWalk: wrapper.readString(),
            multiheight: wrapper.readString(),
            description: wrapper.readString(),
            usageCount: wrapper.readInt()
        };

        const catalogCount = wrapper.readInt();
        this._catalogItems = [];

        for(let i = 0; i < catalogCount; i++)
        {
            this._catalogItems.push({
                id: wrapper.readInt(),
                catalogName: wrapper.readString(),
                costCredits: wrapper.readInt(),
                costPoints: wrapper.readInt(),
                pointsType: wrapper.readInt(),
                pageId: wrapper.readInt(),
                pageName: wrapper.readString()
            });
        }

        this._furniDataJson = wrapper.readString();

        return true;
    }

    public get item(): any { return this._item; }
    public get catalogItems(): any[] { return this._catalogItems; }
    public get furniDataJson(): string { return this._furniDataJson; }
}
