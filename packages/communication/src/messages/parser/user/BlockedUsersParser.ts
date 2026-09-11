import { IMessageDataWrapper, IMessageParser } from '@octane/api';

/**
 * Official `class_3807` (event 2649 `BlockList`): the ids of the users this session blocks.
 * The block list is separate from the ignore list, which is keyed by name.
 */
export class BlockedUsersParser implements IMessageParser
{
    private _blockedUserIds: number[];

    public flush(): boolean
    {
        this._blockedUserIds = [];

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._blockedUserIds = [];

        let count = wrapper.readInt();

        while(count > 0)
        {
            this._blockedUserIds.push(wrapper.readInt());

            count--;
        }

        return true;
    }

    public get blockedUserIds(): number[]
    {
        return this._blockedUserIds;
    }
}
