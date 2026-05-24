import { IMessageComposer } from '@nitrots/api';

export class HousekeepingBanUserComposer implements IMessageComposer<ConstructorParameters<typeof HousekeepingBanUserComposer>>
{
    private _data: ConstructorParameters<typeof HousekeepingBanUserComposer>;

    constructor(userId: number, reason: string, hours: number)
    {
        this._data = [userId, reason, hours];
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
