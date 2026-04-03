import { IMessageComposer } from '@nitrots/api';

export class WiredUserVariablesRequestComposer implements IMessageComposer<ConstructorParameters<typeof WiredUserVariablesRequestComposer>>
{
    public getMessageArray()
    {
        return [];
    }

    public dispose(): void
    {
        return;
    }
}
