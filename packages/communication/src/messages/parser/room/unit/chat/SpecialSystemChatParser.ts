import { IMessageDataWrapper, IMessageParser } from '@octane/api';

/**
 * Official `class_3275` (`SpecialSystemChat`, 1971): a system chat bubble on a
 * room unit, `RoomChatHandler.onSpecialSystemChat(userIndex, specialSystemType)`.
 */
export class SpecialSystemChatParser implements IMessageParser
{
    private _userIndex: number;
    private _specialSystemType: number;

    public flush(): boolean
    {
        this._userIndex = 0;
        this._specialSystemType = 0;

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._userIndex = wrapper.readInt();
        this._specialSystemType = wrapper.readInt();

        return true;
    }

    public get userIndex(): number
    {
        return this._userIndex;
    }

    public get specialSystemType(): number
    {
        return this._specialSystemType;
    }
}
