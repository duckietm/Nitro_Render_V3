import { IMessageDataWrapper } from '@octane/api';

/**
 * `TreasureHuntWinnerInfo` of the official AIR 13 client: the first player who
 * completed a hunt, as read by `TreasureHuntFirstWinnerMessageParser`.
 */
export class TreasureHuntWinnerInfo
{
    private _huntId: string;
    private _userId: number;
    private _userName: string;
    private _userFigure: string;
    private _userGender: string;

    constructor(wrapper: IMessageDataWrapper)
    {
        this._huntId = wrapper.readString();
        this._userId = wrapper.readInt();
        this._userName = wrapper.readString();
        this._userFigure = wrapper.readString();
        this._userGender = wrapper.readString();
    }

    public get huntId(): string
    {
        return this._huntId;
    }

    public get userId(): number
    {
        return this._userId;
    }

    public get userName(): string
    {
        return this._userName;
    }

    public get userFigure(): string
    {
        return this._userFigure;
    }

    public get userGender(): string
    {
        return this._userGender;
    }
}
