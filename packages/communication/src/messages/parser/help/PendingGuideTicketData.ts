import { IMessageDataWrapper } from '@octane/api';

/**
 * The call for help somebody already has open. The official `class_2768` reads a different set of
 * strings depending on the type, so the shape is decided here and not by the caller: reading a
 * fixed number of fields walks off the end of the packet.
 */
export class PendingGuideTicketData
{
    /** A player waiting for a guide, and a guide waiting for a player. */
    public static readonly TYPE_GUIDE_SESSION: number = 0;
    public static readonly TYPE_BULLY_REPORT: number = 1;
    public static readonly TYPE_HELPER_SESSION: number = 2;
    public static readonly TYPE_ROOM_REPORT: number = 3;

    private _type: number;
    private _secondsAgo: number;
    private _isGuide: boolean;
    private _otherPartyName: string = null;
    private _otherPartyFigure: string = null;
    private _description: string = null;
    private _roomName: string = null;

    constructor(wrapper: IMessageDataWrapper)
    {
        this._type = wrapper.readInt();
        this._secondsAgo = wrapper.readInt();
        this._isGuide = wrapper.readBoolean();

        switch(this._type)
        {
            case PendingGuideTicketData.TYPE_GUIDE_SESSION:
            case PendingGuideTicketData.TYPE_HELPER_SESSION:
                this._otherPartyName = wrapper.readString();
                this._otherPartyFigure = wrapper.readString();
                return;
            case PendingGuideTicketData.TYPE_BULLY_REPORT:
                this._otherPartyName = wrapper.readString();
                this._otherPartyFigure = wrapper.readString();
                this._description = wrapper.readString();
                return;
            case PendingGuideTicketData.TYPE_ROOM_REPORT:
                // A guide looking at a room report is told nothing about the other party.
                if(this._isGuide) return;

                this._otherPartyName = wrapper.readString();
                this._otherPartyFigure = wrapper.readString();
                this._roomName = wrapper.readString();
                return;
        }
    }

    public get type(): number
    {
        return this._type;
    }

    public get secondsAgo(): number
    {
        return this._secondsAgo;
    }

    public get isGuide(): boolean
    {
        return this._isGuide;
    }

    public get otherPartyName(): string
    {
        return this._otherPartyName;
    }

    public get otherPartyFigure(): string
    {
        return this._otherPartyFigure;
    }

    public get description(): string
    {
        return this._description;
    }

    public get roomName(): string
    {
        return this._roomName;
    }
}
