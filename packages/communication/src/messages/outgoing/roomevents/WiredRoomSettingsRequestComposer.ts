import { IMessageComposer } from '@nitrots/api';

export class WiredRoomSettingsRequestComposer implements IMessageComposer<ConstructorParameters<typeof WiredRoomSettingsRequestComposer>>
{
    public getMessageArray()
    {
        return [];
    }

    public dispose(): void
    {
        return;
    }
}
