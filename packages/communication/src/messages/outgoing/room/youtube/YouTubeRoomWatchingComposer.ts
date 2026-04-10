import { IMessageComposer } from '@nitrots/api';

export class YouTubeRoomWatchingComposer implements IMessageComposer<any[]>
{
    private _data: any[];

    constructor(watching: boolean)
    {
        // Send as int (0/1) instead of bare boolean to avoid
        // serialization ambiguity in the Nitro wire protocol.
        this._data = [watching ? 1 : 0];
    }

    public getMessageArray() { return this._data; }
    public dispose(): void {}
}
