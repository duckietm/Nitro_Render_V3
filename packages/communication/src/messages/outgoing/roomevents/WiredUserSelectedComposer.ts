import { IMessageComposer } from '@octane/api';

/**
 * Official AIR 13 `HabboUserDefinedRoomEvents.userSelected`: sent only while the
 * room has a "user clicks user" wired trigger, so the server decides whether the
 * avatar menu may still open.
 */
export class WiredUserSelectedComposer implements IMessageComposer<ConstructorParameters<typeof WiredUserSelectedComposer>>
{
    private _data: ConstructorParameters<typeof WiredUserSelectedComposer>;

    constructor(roomIndex: number)
    {
        this._data = [ roomIndex ];
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
