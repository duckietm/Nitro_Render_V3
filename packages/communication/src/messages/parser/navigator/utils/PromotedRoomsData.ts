import { IMessageDataWrapper } from '@octane/api';
import { RoomDataParser } from '../../room';

/**
 * Official `class_4042`: one promoted-rooms folder of `OfficialRooms` (438).
 * The wire holds `str code, str leaderFigure, int roomCount` and then
 * `roomCount` rooms, the first of which is the folder's best room.
 */
export class PromotedRoomsFolderData
{
    private _code: string;
    private _leaderFigure: string;
    private _bestRoom: RoomDataParser;
    private _rooms: RoomDataParser[] = [];
    private _open: boolean = false;
    private _figurePending: boolean = false;
    private _disposed: boolean = false;

    constructor(wrapper: IMessageDataWrapper)
    {
        this._code = wrapper.readString();
        this._leaderFigure = wrapper.readString();

        const totalRooms = wrapper.readInt();

        this._bestRoom = new RoomDataParser(wrapper);

        let index = 1;

        while(index < totalRooms)
        {
            this._rooms.push(new RoomDataParser(wrapper));

            index++;
        }
    }

    public dispose(): void
    {
        if(this._disposed) return;

        this._disposed = true;

        if(this._bestRoom)
        {
            this._bestRoom.flush();
            this._bestRoom = null;
        }

        for(const room of this._rooms) room.flush();

        this._rooms = [];
    }

    public get disposed(): boolean
    {
        return this._disposed;
    }

    public get code(): string
    {
        return this._code;
    }

    public get leaderFigure(): string
    {
        return this._leaderFigure;
    }

    public get bestRoom(): RoomDataParser
    {
        return this._bestRoom;
    }

    public get rooms(): RoomDataParser[]
    {
        return this._rooms;
    }

    public get open(): boolean
    {
        return this._open;
    }

    public set open(flag: boolean)
    {
        this._open = flag;
    }

    public toggleOpen(): void
    {
        this._open = !this._open;
    }

    public get figurePending(): boolean
    {
        return this._figurePending;
    }

    public set figurePending(flag: boolean)
    {
        this._figurePending = flag;
    }
}

/**
 * Official `class_2358`: the promoted-rooms block of `OfficialRooms` (438).
 */
export class PromotedRoomsData
{
    private _entries: PromotedRoomsFolderData[] = [];
    private _disposed: boolean = false;

    constructor(wrapper: IMessageDataWrapper)
    {
        let totalEntries = wrapper.readInt();

        while(totalEntries > 0)
        {
            this._entries.push(new PromotedRoomsFolderData(wrapper));

            totalEntries--;
        }
    }

    public dispose(): void
    {
        if(this._disposed) return;

        this._disposed = true;

        for(const entry of this._entries) entry.dispose();

        this._entries = [];
    }

    public get disposed(): boolean
    {
        return this._disposed;
    }

    public get entries(): PromotedRoomsFolderData[]
    {
        return this._entries;
    }
}
