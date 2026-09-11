import { IMessageDataWrapper, IMessageParser } from '@octane/api';

export class WiredClickSettingsParser implements IMessageParser
{
    private _userOption: number;
    private _furniOption: number;

    public flush(): boolean
    {
        this._userOption = 0;
        this._furniOption = 0;

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._userOption = wrapper.readInt();
        this._furniOption = wrapper.readInt();

        return true;
    }

    public get userOption(): number
    {
        return this._userOption;
    }

    public get furniOption(): number
    {
        return this._furniOption;
    }
}
