import { IMessageComposer } from '@nitrots/api';

/**
 * Player withdraws stored furni from a wired furni chest (Scrigno furni). [itemId, baseItemId, amount].
 * amount < 0 = withdraw all of that base type. The server creates that many items into the inventory.
 */
export class ChestWithdrawFurniComposer implements IMessageComposer<ConstructorParameters<typeof ChestWithdrawFurniComposer>>
{
    private _data: ConstructorParameters<typeof ChestWithdrawFurniComposer>;

    constructor(itemId: number, baseItemId: number, amount: number)
    {
        this._data = [itemId, baseItemId, amount];
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
