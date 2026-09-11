import { IMessageDataWrapper, IMessageParser } from '@octane/api';

/**
 * Official `class_3180` (`YouAreNotSpectator`, 3242): the room the client must
 * leave spectator mode for.
 */
export class YouAreNotSpectatorParser implements IMessageParser
{
    private _flatId: number;

    public flush(): boolean
    {
        this._flatId = 0;

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._flatId = wrapper.readInt();

        return true;
    }

    public get flatId(): number
    {
        return this._flatId;
    }
}
