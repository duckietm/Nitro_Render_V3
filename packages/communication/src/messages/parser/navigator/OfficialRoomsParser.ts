import { IMessageDataWrapper, IMessageParser } from '@octane/api';
import { OfficialRoomEntryData } from './utils/OfficialRoomEntryData';
import { OfficialRoomsData } from './utils/OfficialRoomsData';
import { PromotedRoomsData } from './utils/PromotedRoomsData';

/**
 * Official `class_2621` (`OfficialRooms`, 438): the folder / room list, an
 * optional ad room guarded by an int flag, and the promoted-rooms block.
 * `HabboNavigator.onOfficialRooms` stores the three on the navigator data.
 */
export class OfficialRoomsParser implements IMessageParser
{
    private _data: OfficialRoomsData;
    private _adRoom: OfficialRoomEntryData;
    private _promotedRooms: PromotedRoomsData;

    public flush(): boolean
    {
        this._data = null;
        this._adRoom = null;
        this._promotedRooms = null;

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._data = new OfficialRoomsData(wrapper);
        this._adRoom = (wrapper.readInt() > 0) ? new OfficialRoomEntryData(wrapper) : null;
        this._promotedRooms = new PromotedRoomsData(wrapper);

        return true;
    }

    public get data(): OfficialRoomsData
    {
        return this._data;
    }

    public get adRoom(): OfficialRoomEntryData
    {
        return this._adRoom;
    }

    public get promotedRooms(): PromotedRoomsData
    {
        return this._promotedRooms;
    }
}
