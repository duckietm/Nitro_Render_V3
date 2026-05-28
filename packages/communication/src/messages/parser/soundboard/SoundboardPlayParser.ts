import { IMessageDataWrapper, IMessageParser } from '@nitrots/api';

export class SoundboardPlayParser implements IMessageParser
{
    private _soundId: number = 0;
    private _url: string = '';
    private _username: string = '';

    public flush(): boolean
    {
        this._soundId = 0;
        this._url = '';
        this._username = '';

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._soundId = wrapper.readInt();
        this._url = wrapper.readString();
        this._username = wrapper.readString();

        return true;
    }

    public get soundId(): number { return this._soundId; }
    public get url(): string { return this._url; }
    public get username(): string { return this._username; }
}
