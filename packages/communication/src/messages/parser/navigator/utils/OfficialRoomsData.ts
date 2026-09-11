import { IMessageDataWrapper } from '@octane/api';
import { OfficialRoomEntryData } from './OfficialRoomEntryData';

/**
 * Official `class_3508`: the folder / room list of `OfficialRooms` (438).
 */
export class OfficialRoomsData
{
    private _entries: OfficialRoomEntryData[] = [];
    private _disposed: boolean = false;

    constructor(wrapper: IMessageDataWrapper)
    {
        let totalEntries = wrapper.readInt();

        while(totalEntries > 0)
        {
            this._entries.push(new OfficialRoomEntryData(wrapper));

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

    public get entries(): OfficialRoomEntryData[]
    {
        return this._entries;
    }
}
