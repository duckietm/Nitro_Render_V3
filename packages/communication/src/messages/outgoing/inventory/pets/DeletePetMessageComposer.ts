import { IMessageComposer } from '../../../../../../api';

export class DeletePetMessageComposer implements IMessageComposer<ConstructorParameters<typeof DeletePetMessageComposer>>
{
    private _data: ConstructorParameters<typeof DeletePetMessageComposer>;

    constructor(petId: number)
    {
        this._data = [petId];
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
