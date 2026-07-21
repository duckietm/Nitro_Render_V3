import { IMessageComposer } from '@nitrots/api';

export class SnowWarThrowAtPlayerComposer implements IMessageComposer<ConstructorParameters<typeof SnowWarThrowAtPlayerComposer>>
{
    private _data: ConstructorParameters<typeof SnowWarThrowAtPlayerComposer>;

    constructor(targetObjectId: number, trajectory: number)
    {
        this._data = [ targetObjectId, trajectory ];
    }

    dispose(): void
    {
        this._data = null;
    }

    public getMessageArray()
    {
        return this._data;
    }
}
