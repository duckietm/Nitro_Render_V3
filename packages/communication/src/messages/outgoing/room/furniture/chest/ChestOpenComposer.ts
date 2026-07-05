import { IMessageComposer } from '@nitrots/api';

/** Open wired chest (official Nod / header 806 wire shape, Nitro header 9327): [chestItemId]. */
export class ChestOpenComposer implements IMessageComposer<ConstructorParameters<typeof ChestOpenComposer>>
{
    private _data: ConstructorParameters<typeof ChestOpenComposer>;

    constructor(chestItemId: number)
    {
        this._data = [chestItemId];
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
