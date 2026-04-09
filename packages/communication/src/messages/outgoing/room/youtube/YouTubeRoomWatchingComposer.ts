import { IMessageComposer } from '@nitrots/api';

export class YouTubeRoomWatchingComposer implements IMessageComposer<any[]>
{
    private _data: any[];

    constructor(watching: boolean)
    {
        this._data = [watching];
    }

    public getMessageArray() { return this._data; }
    public dispose(): void {}
}
