import { IMessageDataWrapper, IMessageParser } from '@octane/api';
import { HabbiconData, parseHabbicon } from './HabbiconData';

export class HabbiconInfoParser implements IMessageParser
{
    public habbicon: HabbiconData = null;

    public flush(): boolean
    {
        this.habbicon = null;

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this.habbicon = parseHabbicon(wrapper);

        return true;
    }
}
