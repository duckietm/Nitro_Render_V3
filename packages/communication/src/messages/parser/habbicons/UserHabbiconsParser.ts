import { IMessageDataWrapper, IMessageParser } from '@octane/api';
import { UserHabbiconData } from './HabbiconData';

export class UserHabbiconsParser implements IMessageParser
{
    public habbicons: UserHabbiconData[] = [];
    public recentHabbiconIds: number[] = [];

    public flush(): boolean
    {
        this.habbicons = [];
        this.recentHabbiconIds = [];

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        const count = wrapper.readInt();

        if(count < 0 || count > 10000) return false;

        for(let index = 0; index < count; index++)
        {
            this.habbicons.push({ habbiconId: wrapper.readInt(), state: wrapper.readInt() });
        }

        const recentCount = wrapper.readInt();

        if(recentCount < 0 || recentCount > 10) return false;

        for(let index = 0; index < recentCount; index++) this.recentHabbiconIds.push(wrapper.readInt());

        return true;
    }
}
