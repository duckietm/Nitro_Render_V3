import { IMessageComposer } from '@octane/api';

export class RaidProtectionSettingsRequestComposer implements IMessageComposer<ConstructorParameters<typeof RaidProtectionSettingsRequestComposer>>
{
    private _data: ConstructorParameters<typeof RaidProtectionSettingsRequestComposer>;

    constructor(roomId: number)
    {
        this._data = [ roomId ];
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
