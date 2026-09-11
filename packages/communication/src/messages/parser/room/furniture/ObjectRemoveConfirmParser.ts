import { IMessageDataWrapper, IMessageParser } from '@octane/api';

/**
 * Official `class_3462` (`ObjectRemoveConfirm`, 3488): the server asks the
 * client to confirm a pick-up. The first int is a wall flag - the official
 * parser turns it into the room-object category (1 -> 20 wall, else 10 floor) -
 * followed by the object id and the two localisation keys of the dialog.
 */
export class ObjectRemoveConfirmParser implements IMessageParser
{
    public static readonly CATEGORY_FLOOR = 10;
    public static readonly CATEGORY_WALL = 20;

    private _category: number;
    private _id: number;
    private _confirmTitle: string;
    private _confirmBody: string;

    public flush(): boolean
    {
        this._category = 0;
        this._id = 0;
        this._confirmTitle = null;
        this._confirmBody = null;

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._category = (wrapper.readInt() === 1) ? ObjectRemoveConfirmParser.CATEGORY_WALL : ObjectRemoveConfirmParser.CATEGORY_FLOOR;
        this._id = wrapper.readInt();
        this._confirmTitle = wrapper.readString();
        this._confirmBody = wrapper.readString();

        return true;
    }

    public get category(): number
    {
        return this._category;
    }

    public get id(): number
    {
        return this._id;
    }

    public get confirmTitle(): string
    {
        return this._confirmTitle;
    }

    public get confirmBody(): string
    {
        return this._confirmBody;
    }
}
