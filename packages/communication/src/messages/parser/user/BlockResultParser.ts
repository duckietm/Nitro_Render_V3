import { IMessageDataWrapper, IMessageParser } from '@octane/api';

/**
 * Official `class_3781` (event 366): the result of a block/unblock request.
 * `BlockedUsersManager.onBlockUpdate` treats 0 as unblocked and 1 as blocked.
 */
export class BlockResultParser implements IMessageParser
{
    public static readonly UNBLOCKED: number = 0;
    public static readonly BLOCKED: number = 1;

    private _result: number;
    private _userId: number;

    public flush(): boolean
    {
        this._result = -1;
        this._userId = -1;

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._result = wrapper.readInt();
        this._userId = wrapper.readInt();

        return true;
    }

    public get result(): number
    {
        return this._result;
    }

    public get userId(): number
    {
        return this._userId;
    }
}
