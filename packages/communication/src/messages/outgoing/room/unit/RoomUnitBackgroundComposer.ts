import { IMessageComposer } from '@nitrots/api';

export class RoomUnitBackgroundComposer implements IMessageComposer<ConstructorParameters<typeof RoomUnitBackgroundComposer>>
{
    private _data: ConstructorParameters<typeof RoomUnitBackgroundComposer>;

    constructor(backgroundImage: number, backgroundStand: number, backgroundOverlay: number, backgroundCard: number = 0)
    {
        this._data = [ backgroundImage, backgroundStand, backgroundOverlay, backgroundCard ];
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