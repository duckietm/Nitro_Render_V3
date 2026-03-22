import { IMessageDataWrapper, IMessageParser } from '@nitrots/api';

export class UiSettingsDataParser implements IMessageParser
{
    private _settingsJson: string;

    flush(): boolean
    {
        this._settingsJson = '';
        return true;
    }

    parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;
        this._settingsJson = wrapper.readString();
        return true;
    }

    public get settingsJson(): string
    {
        return this._settingsJson;
    }
}
