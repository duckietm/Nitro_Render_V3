import { IMessageComposer } from '@nitrots/api';

export class FurniEditorSearchComposer implements IMessageComposer<ConstructorParameters<typeof FurniEditorSearchComposer>>
{
    private _data: ConstructorParameters<typeof FurniEditorSearchComposer>;

    constructor(query: string, type: string, page: number)
    {
        this._data = [ query, type, page ];
    }

    dispose(): void
    {
        this._data = null;
    }

    public getMessageArray()
    {
        return this._data;
    }
}
