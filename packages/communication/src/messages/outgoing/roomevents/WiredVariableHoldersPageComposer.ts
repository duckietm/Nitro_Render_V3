import { IMessageComposer } from '@octane/api';

/**
 * Official AIR 13 `VariableManagementOverviewView` page request:
 * one page of the holders of a single wired variable, with the user-type and sort filters.
 */
export class WiredVariableHoldersPageComposer implements IMessageComposer<ConstructorParameters<typeof WiredVariableHoldersPageComposer>>
{
    private _data: ConstructorParameters<typeof WiredVariableHoldersPageComposer>;

    constructor(variableId: string, page: number, pageSize: number, userTypeFilter: number, sortTypeFilter: number)
    {
        this._data = [ variableId, page, pageSize, userTypeFilter, sortTypeFilter ];
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
