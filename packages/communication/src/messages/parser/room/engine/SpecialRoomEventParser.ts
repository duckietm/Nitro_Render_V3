import { IMessageDataWrapper, IMessageParser } from '@octane/api';

/**
 * Official `class_2581` (`SpecialRoomEvent`, 2163): a room-wide visual effect
 * id. `class_1902.onSpecialRoomEvent` maps 0 = rotate, 1 = shake, 2 = zoom out,
 * 3 = disco colour cycle.
 */
export class SpecialRoomEventParser implements IMessageParser
{
    public static readonly EFFECT_ROTATE = 0;
    public static readonly EFFECT_SHAKE = 1;
    public static readonly EFFECT_ZOOM = 2;
    public static readonly EFFECT_DISCO = 3;

    private _effectId: number;

    public flush(): boolean
    {
        this._effectId = -1;

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._effectId = wrapper.readInt();

        return true;
    }

    public get effectId(): number
    {
        return this._effectId;
    }
}
