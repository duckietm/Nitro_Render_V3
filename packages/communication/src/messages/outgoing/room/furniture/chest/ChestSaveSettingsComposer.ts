import { IMessageComposer } from '@nitrots/api';

/**
 * Saves a wired chest's settings. [itemId, name, description, accessOpen, accessDonate, appearanceState].
 */
export class ChestSaveSettingsComposer implements IMessageComposer<ConstructorParameters<typeof ChestSaveSettingsComposer>>
{
    private _data: ConstructorParameters<typeof ChestSaveSettingsComposer>;

    constructor(itemId: number, name: string, description: string, accessOpen: boolean, accessDonate: boolean, appearanceState: number)
    {
        this._data = [itemId, name, description, accessOpen, accessDonate, appearanceState];
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
