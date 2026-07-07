import { RoomEngineEvent } from './RoomEngineEvent';

export class RoomBackgroundColorEvent extends RoomEngineEvent
{
    public static ROOM_COLOR: string = 'REE_ROOM_COLOR';

    private _color: number;
    private _brightness: number;
    private _bgOnly: boolean;

    constructor(roomId: number, color: number, brightness: number, bgOnly: boolean)
    {
        super(RoomBackgroundColorEvent.ROOM_COLOR, roomId);

        this._color = color;
        this._brightness = brightness;
        this._bgOnly = bgOnly;
    }

    public get color(): number
    {
        return this._color;
    }

    public get brightness(): number
    {
        return this._brightness;
    }

    public get bgOnly(): boolean
    {
        return this._bgOnly;
    }
}
