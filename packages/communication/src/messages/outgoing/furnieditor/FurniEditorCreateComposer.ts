import { IMessageComposer } from '@nitrots/api';

export class FurniEditorCreateComposer implements IMessageComposer<ConstructorParameters<typeof FurniEditorCreateComposer>>
{
    private _data: ConstructorParameters<typeof FurniEditorCreateComposer>;

    constructor(fieldsJson: string)
    {
        this._data = [ fieldsJson ];
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
