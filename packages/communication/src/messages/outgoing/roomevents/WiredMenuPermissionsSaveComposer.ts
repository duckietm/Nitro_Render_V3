import { IMessageComposer } from '@octane/api';

/**
 * Official AIR 13 `WiredMenuSettingsTab.onPermissionsChanged(modifyMask, readMask, timezone)`.
 */
export class WiredMenuPermissionsSaveComposer implements IMessageComposer<ConstructorParameters<typeof WiredMenuPermissionsSaveComposer>>
{
    private _data: ConstructorParameters<typeof WiredMenuPermissionsSaveComposer>;

    constructor(modifyMask: number, inspectMask: number, timezone: string)
    {
        this._data = [ modifyMask, inspectMask, timezone ];
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
