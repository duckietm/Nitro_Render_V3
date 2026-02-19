import { IMessageComposer } from '../../../../../../api';

export class DeleteBadgeMessageComposer implements IMessageComposer<ConstructorParameters<typeof DeleteBadgeMessageComposer>>
{
    private _data: ConstructorParameters<typeof DeleteBadgeMessageComposer>;

    constructor(badgeCode: string)
    {
        this._data = [ badgeCode ];
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
