import { IMessageDataWrapper, IMessageParser } from '@octane/api';

/**
 * Whether this user may manage raid protection in the given room.
 *
 * The capability is per room and arrives on entering one, so it must be discarded again when the
 * user leaves rather than remembered for the session.
 */
export class RaidProtectionCapabilityParser implements IMessageParser
{
    private _roomId: number;
    private _canManage: boolean;

    public flush(): boolean
    {
        this._roomId = 0;
        this._canManage = false;

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._roomId = wrapper.readInt();
        this._canManage = wrapper.readBoolean();

        return true;
    }

    public get roomId(): number
    {
        return this._roomId;
    }

    public get canManage(): boolean
    {
        return this._canManage;
    }
}
