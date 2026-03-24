import { IMessageDataWrapper } from '@nitrots/api';

export class NodeData
{
    private _visible: boolean;
    private _icon: number;
    private _pageId: number;
    private _pageName: string;
    private _localization: string;
    private _children: NodeData[];
    private _offerIds: number[];

    constructor(wrapper: IMessageDataWrapper)
    {
        if(!wrapper) throw new Error('invalid_wrapper');

        this.flush();
        this.parse(wrapper);
    }

    public flush(): boolean
    {
        this._visible = false;
        this._icon = 0;
        this._pageId = -1;
        this._pageName = null;
        this._localization = null;
        this._children = [];
        this._offerIds = [];

        return true;
    }

    private static readonly MAX_OFFERS: number = 1000;
    private static readonly MAX_CHILDREN: number = 500;
    private static _parseDepth: number = 0;
    private static readonly MAX_DEPTH: number = 20;

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._visible = wrapper.readBoolean();
        this._icon = wrapper.readInt();
        this._pageId = wrapper.readInt();
        this._pageName = wrapper.readString();
        this._localization = wrapper.readString();

        let totalOffers = Math.min(wrapper.readInt(), NodeData.MAX_OFFERS);

        while(totalOffers > 0)
        {
            this._offerIds.push(wrapper.readInt());

            totalOffers--;
        }

        let totalChildren = Math.min(wrapper.readInt(), NodeData.MAX_CHILDREN);

        NodeData._parseDepth++;

        if(NodeData._parseDepth > NodeData.MAX_DEPTH)
        {
            NodeData._parseDepth--;
            return true;
        }

        while(totalChildren > 0)
        {
            this._children.push(new NodeData(wrapper));

            totalChildren--;
        }

        NodeData._parseDepth--;

        return true;
    }

    public get visible(): boolean
    {
        return this._visible;
    }

    public get icon(): number
    {
        return this._icon;
    }

    public get pageId(): number
    {
        return this._pageId;
    }

    public get pageName(): string
    {
        return this._pageName;
    }

    public get localization(): string
    {
        return this._localization;
    }

    public get children(): NodeData[]
    {
        return this._children;
    }

    public get offerIds(): number[]
    {
        return this._offerIds;
    }
}
