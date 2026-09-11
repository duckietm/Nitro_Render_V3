import { IMessageComposer } from '@octane/api';

/**
 * Official `GetBadgeInfoComposer` (AIR 13, header 2895): asks for the owner
 * count and rarity tier of a single badge code, as
 * `FurnitureBadgeDisplayWidgetHandler` does before engraving a badge display.
 */
export class GetBadgeInfoComposer implements IMessageComposer<ConstructorParameters<typeof GetBadgeInfoComposer>>
{
    private _data: ConstructorParameters<typeof GetBadgeInfoComposer>;

    constructor(badgeCode: string)
    {
        this._data = [badgeCode];
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
