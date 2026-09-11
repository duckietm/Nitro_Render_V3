import { IMessageComposer } from '@octane/api';

/**
 * Official `DiscordSettingsController.initComponent()` (composer 1055): asks the server for the
 * stored Discord Rich Presence preferences.
 */
export class GetDiscordPreferencesComposer implements IMessageComposer<ConstructorParameters<typeof GetDiscordPreferencesComposer>>
{
    private _data: ConstructorParameters<typeof GetDiscordPreferencesComposer>;

    constructor()
    {
        this._data = [];
    }

    public getMessageArray()
    {
        return this._data;
    }

    public dispose(): void
    {
        return;
    }
}
