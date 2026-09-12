import { IMessageComposer } from '@octane/api';

/**
 * Saves a room's raid protection.
 *
 * `confirmed` is the second half of the panel's own two-step: switching the protection on opens a
 * confirmation, and the same values are sent again with the flag set.
 */
export class RaidProtectionSettingsSaveComposer implements IMessageComposer<ConstructorParameters<typeof RaidProtectionSettingsSaveComposer>>
{
    private _data: ConstructorParameters<typeof RaidProtectionSettingsSaveComposer>;

    constructor(
        roomId: number,
        enabled: boolean,
        detectionSensitivity: number,
        actionType: number,
        banDurationSeconds: number,
        guardEnabled: boolean,
        guardDurationSeconds: number,
        guardSensitivity: number,
        confirmed: boolean)
    {
        this._data = [ roomId, enabled, detectionSensitivity, actionType, banDurationSeconds, guardEnabled, guardDurationSeconds, guardSensitivity, confirmed ];
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
