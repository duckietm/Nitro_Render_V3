import { IMessageComposer } from '@octane/api';

/**
 * Official `class_3741`, sent by `SelfDonationTool.onDonate`:
 * `(isWallItem, typeId, legacyPosterId, amount)`.
 */
export class SelfDonationMessageComposer implements IMessageComposer<ConstructorParameters<typeof SelfDonationMessageComposer>>
{
    private _data: ConstructorParameters<typeof SelfDonationMessageComposer>;

    constructor(isWallItem: boolean, typeId: number, legacyPosterId: string = '', amount: number = 1)
    {
        this._data = [isWallItem, typeId, legacyPosterId, amount];
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
