import { IMessageComposer } from '@octane/api';

/**
 * Official `HabboNotifications.activate()` (composer 3235): tells the server the notification
 * feed is enabled on this client, so queued feed items may be delivered.
 */
export class ActivateNotificationsComposer implements IMessageComposer<ConstructorParameters<typeof ActivateNotificationsComposer>>
{
    private _data: ConstructorParameters<typeof ActivateNotificationsComposer>;

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
