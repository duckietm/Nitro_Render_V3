import { IMessageDataWrapper, IMessageParser } from '@nitrots/api';

export interface ISoundboardSound
{
    id: number;
    name: string;
    url: string;
}

export class SoundboardSettingsParser implements IMessageParser
{
    private _enabled: boolean = false;
    private _sounds: ISoundboardSound[] = [];

    public flush(): boolean
    {
        this._enabled = false;
        this._sounds = [];

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._enabled = wrapper.readBoolean();

        const count = wrapper.readInt();
        this._sounds = [];

        for(let i = 0; i < count; i++)
        {
            this._sounds.push({
                id: wrapper.readInt(),
                name: wrapper.readString(),
                url: wrapper.readString()
            });
        }

        return true;
    }

    public get enabled(): boolean { return this._enabled; }
    public get sounds(): ISoundboardSound[] { return this._sounds; }
}
