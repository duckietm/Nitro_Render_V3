import { IMessageComposer } from '@nitrots/api';

export class SnowWarWalkComposer implements IMessageComposer<ConstructorParameters<typeof SnowWarWalkComposer>>
{
    private _data: ConstructorParameters<typeof SnowWarWalkComposer>;

    constructor(worldX: number, worldY: number)
    {
        this._data = [ worldX, worldY ];
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
