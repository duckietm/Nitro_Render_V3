import { IMessageDataWrapper, IMessageParser } from '@octane/api';
import { HabbiconAction, HabbiconActionError } from './HabbiconData';

export class HabbiconActionResultParser implements IMessageParser
{
    public action = HabbiconAction.Buy;
    public id = 0;
    public error = HabbiconActionError.None;

    public flush(): boolean
    {
        this.action = HabbiconAction.Buy;
        this.id = 0;
        this.error = HabbiconActionError.None;

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this.action = wrapper.readInt();
        this.id = wrapper.readInt();
        this.error = wrapper.readInt();

        return true;
    }
}
