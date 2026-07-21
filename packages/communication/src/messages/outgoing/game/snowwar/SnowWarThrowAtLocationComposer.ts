import { IMessageComposer } from '@nitrots/api';

export class SnowWarThrowAtLocationComposer implements IMessageComposer<ConstructorParameters<typeof SnowWarThrowAtLocationComposer>>
{
    private _data: ConstructorParameters<typeof SnowWarThrowAtLocationComposer>;

    constructor(worldX: number, worldY: number, trajectory: number)
    {
        this._data = [ worldX, worldY, trajectory ];
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
