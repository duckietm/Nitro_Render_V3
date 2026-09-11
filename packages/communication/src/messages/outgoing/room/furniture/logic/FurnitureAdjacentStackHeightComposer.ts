import { IMessageComposer } from '@octane/api';

/**
 * Official `CustomStackHeightWidget.sendAdjacentHeightRequest` (AIR 13, header
 * 2687): the two small arrows beside the stack-height slider ask the server to
 * move the helper to the next height, down when `moveDown` is set and up
 * otherwise.
 */
export class FurnitureAdjacentStackHeightComposer implements IMessageComposer<ConstructorParameters<typeof FurnitureAdjacentStackHeightComposer>>
{
    private _data: ConstructorParameters<typeof FurnitureAdjacentStackHeightComposer>;

    constructor(itemId: number, moveDown: boolean)
    {
        this._data = [itemId, moveDown];
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
