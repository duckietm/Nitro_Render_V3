import { IMessageDataWrapper, IMessageParser } from '@octane/api';

export class WiredClickUserResponseParser implements IMessageParser
{
    private _index: number;
    private _openMenu: boolean;

    public flush(): boolean
    {
        this._index = 0;
        this._openMenu = false;

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._index = wrapper.readInt();
        this._openMenu = wrapper.readBoolean();

        return true;
    }

    public get index(): number
    {
        return this._index;
    }

    public get openMenu(): boolean
    {
        return this._openMenu;
    }
}
