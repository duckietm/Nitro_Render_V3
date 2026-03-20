import { IMessageComposer } from '@nitrots/api';

export class PurchasePrefixComposer implements IMessageComposer<ConstructorParameters<typeof PurchasePrefixComposer>>
{
    private _data: ConstructorParameters<typeof PurchasePrefixComposer>;

    constructor(text: string, color: string, icon: string = '', effect: string = '')
    {
        this._data = [ text, color, icon, effect ];
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
