import { IMessageComposer } from '@nitrots/api';

export class FurniEditorUpdateComposer implements IMessageComposer<ConstructorParameters<typeof FurniEditorUpdateComposer>>
{
    private _data: ConstructorParameters<typeof FurniEditorUpdateComposer>;

    constructor(id: number, fieldsJson: string)
    {
        this._data = [ id, fieldsJson ];
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
