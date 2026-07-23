import { IMessageDataWrapper, IMessageParser } from '@nitrots/api';
import { WiredFurniOpacityMessageData } from '../engine';

export class WiredFurniOpacityMessageParser implements IMessageParser
{
    private _data: WiredFurniOpacityMessageData = null;

    public flush(): boolean
    {
        this._data = null;

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._data = new WiredFurniOpacityMessageData(wrapper);

        return true;
    }

    public get data(): WiredFurniOpacityMessageData { return this._data; }
}
