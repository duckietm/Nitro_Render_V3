import { IMessageComposer } from '@nitrots/api';

export class UiSettingsSaveComposer implements IMessageComposer<ConstructorParameters<typeof UiSettingsSaveComposer>>
{
    private _data: ConstructorParameters<typeof UiSettingsSaveComposer>;

    constructor(settingsJson: string)
    {
        this._data = [ settingsJson ];
    }

    dispose(): void
    {
        this._data = null;
    }

    public getMessageArray()
    {
        return this._data;
    }
}
