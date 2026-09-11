import { IMessageComposer } from '@octane/api';

/**
 * Official `DiscordSettingsController.updatePreferences` (composer 2774):
 * `(preferenceGlobalVersion, showHabbo, shareActivity, hideInHiddenRooms, allowJoining)`.
 */
export class UpdateDiscordPreferencesComposer implements IMessageComposer<ConstructorParameters<typeof UpdateDiscordPreferencesComposer>>
{
    private _data: ConstructorParameters<typeof UpdateDiscordPreferencesComposer>;

    constructor(version: number, showHabbo: boolean, shareActivity: boolean, hideInHiddenRooms: boolean, allowJoining: boolean)
    {
        this._data = [version, showHabbo, shareActivity, hideInHiddenRooms, allowJoining];
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
