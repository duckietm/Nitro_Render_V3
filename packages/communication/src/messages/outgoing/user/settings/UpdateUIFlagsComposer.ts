import { IMessageComposer } from '@octane/api';

/**
 * Official `SessionDataManager.setUIFlag` -> `UpdateUIFlags(flags)`: bit 1 is the friend-bar
 * collapse state (`setFriendBarState`) and bit 2 the room-tools one (`setRoomToolsState`).
 * The official header is 733; our emulator has always listened on 2313 (`UpdateUIFlagsEvent`),
 * so the composer keeps that id.
 */
export class UpdateUIFlagsComposer implements IMessageComposer<ConstructorParameters<typeof UpdateUIFlagsComposer>>
{
    private _data: ConstructorParameters<typeof UpdateUIFlagsComposer>;

    constructor(flags: number)
    {
        this._data = [flags];
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
