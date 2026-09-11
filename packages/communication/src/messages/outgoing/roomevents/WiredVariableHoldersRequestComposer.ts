import { IMessageComposer } from '@octane/api';

/**
 * Official AIR 13 `WiredMenuOverviewTab.requestHolders`: every holder of one wired
 * variable, used to highlight them in the room.
 */
export class WiredVariableHoldersRequestComposer implements IMessageComposer<ConstructorParameters<typeof WiredVariableHoldersRequestComposer>>
{
    private _data: ConstructorParameters<typeof WiredVariableHoldersRequestComposer>;

    constructor(variableId: string)
    {
        this._data = [ variableId ];
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
