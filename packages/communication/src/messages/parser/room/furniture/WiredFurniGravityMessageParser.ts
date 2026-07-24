import { IMessageDataWrapper, IMessageParser } from '@nitrots/api';
import { WiredFurniGravityMessageData } from '../engine';

export class WiredFurniGravityMessageParser implements IMessageParser
{
    private _data: WiredFurniGravityMessageData = null;

    public flush(): boolean
    {
        this._data = null;

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._data = new WiredFurniGravityMessageData(wrapper);

        return true;
    }

    public get data(): WiredFurniGravityMessageData { return this._data; }
}
