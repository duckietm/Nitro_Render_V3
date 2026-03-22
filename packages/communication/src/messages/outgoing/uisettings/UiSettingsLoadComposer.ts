import { IMessageComposer } from '@nitrots/api';

export class UiSettingsLoadComposer implements IMessageComposer<ConstructorParameters<typeof UiSettingsLoadComposer>>
{
    private _data: ConstructorParameters<typeof UiSettingsLoadComposer>;

    constructor()
    {
        this._data = [];
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
