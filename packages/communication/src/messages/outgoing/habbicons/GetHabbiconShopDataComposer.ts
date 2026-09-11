import { IMessageComposer } from '@octane/api';

export class GetHabbiconShopDataComposer implements IMessageComposer<[]>
{
    public getMessageArray(): []
    {
        return [];
    }

    public dispose(): void
    {
        return;
    }
}
