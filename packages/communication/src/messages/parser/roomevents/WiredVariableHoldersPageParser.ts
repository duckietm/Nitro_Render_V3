import { IMessageDataWrapper, IMessageParser } from '@octane/api';
import { readWiredLong } from './WiredVariableData';

/** `package_226.WiredVariableStorageParameter` without the leading variable id. */
export interface IWiredVariableStorage
{
    value: number;
    creationTime: number;
    creationTimeStr: string;
    lastUpdateTime: number;
    lastUpdateTimeStr: string;
}

/** `package_226.WiredUserVariablesElement`. */
export interface IWiredVariableHolder
{
    entityType: number;
    entityId: number;
    entityName: string;
    storage: IWiredVariableStorage;
}

export class WiredVariableHoldersPageParser implements IMessageParser
{
    private _variableId: string;
    private _totalEntries: number;
    private _currentPage: number;
    private _amount: number;
    private _elements: IWiredVariableHolder[];
    private _userTypeFilter: number;
    private _sortTypeFilter: number;

    public flush(): boolean
    {
        this._variableId = null;
        this._totalEntries = 0;
        this._currentPage = 0;
        this._amount = 0;
        this._elements = [];
        this._userTypeFilter = 0;
        this._sortTypeFilter = -1;

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._variableId = wrapper.readString();
        this._totalEntries = wrapper.readInt();
        this._currentPage = wrapper.readInt();
        this._amount = wrapper.readInt();
        this._elements = [];

        const totalElements = wrapper.readInt();

        for(let i = 0; i < totalElements; i++)
        {
            const entityType = wrapper.readInt();
            const entityId = wrapper.readInt();
            const entityName = wrapper.readString();

            this._elements.push({
                entityType,
                entityId,
                entityName,
                storage: {
                    value: wrapper.readInt(),
                    creationTime: readWiredLong(wrapper),
                    creationTimeStr: wrapper.readString(),
                    lastUpdateTime: readWiredLong(wrapper),
                    lastUpdateTimeStr: wrapper.readString()
                }
            });
        }

        this._userTypeFilter = wrapper.readInt();
        this._sortTypeFilter = wrapper.readInt();

        return true;
    }

    public get variableId(): string
    {
        return this._variableId;
    }

    public get totalEntries(): number
    {
        return this._totalEntries;
    }

    public get currentPage(): number
    {
        return this._currentPage;
    }

    public get amount(): number
    {
        return this._amount;
    }

    public get elements(): IWiredVariableHolder[]
    {
        return this._elements;
    }

    public get userTypeFilter(): number
    {
        return this._userTypeFilter;
    }

    public get sortTypeFilter(): number
    {
        return this._sortTypeFilter;
    }
}
