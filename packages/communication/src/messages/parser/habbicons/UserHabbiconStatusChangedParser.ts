import { IMessageDataWrapper, IMessageParser } from '@octane/api';
import { HabbiconState } from './HabbiconData';

export class UserHabbiconStatusChangedParser implements IMessageParser
{
    public habbiconId = 0;
    public state = HabbiconState.NotOwned;

    public flush(): boolean
    {
        this.habbiconId = 0;
        this.state = HabbiconState.NotOwned;

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this.habbiconId = wrapper.readInt();
        this.state = wrapper.readInt();

        return true;
    }
}
