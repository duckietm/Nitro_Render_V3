import { IMessageDataWrapper, IMessageParser } from '@octane/api';
import { IWiredVariableData, parseWiredVariableData } from './WiredVariableData';

/** One entry of the official `addedOrUpdated` dictionary: the variable and its hash. */
export interface IWiredVariableDiffEntry
{
    hash: number;
    variable: IWiredVariableData;
}

export class WiredAllVariablesDiffParser implements IMessageParser
{
    private _allVariablesHash: number;
    private _isLastChunk: boolean;
    private _removedVariables: string[];
    private _addedOrUpdated: IWiredVariableDiffEntry[];

    public flush(): boolean
    {
        this._allVariablesHash = 0;
        this._isLastChunk = false;
        this._removedVariables = [];
        this._addedOrUpdated = [];

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._allVariablesHash = wrapper.readInt();
        this._isLastChunk = wrapper.readBoolean();
        this._removedVariables = [];

        const totalRemoved = wrapper.readInt();

        for(let i = 0; i < totalRemoved; i++) this._removedVariables.push(wrapper.readString());

        this._addedOrUpdated = [];

        const totalUpdated = wrapper.readInt();

        for(let i = 0; i < totalUpdated; i++)
        {
            const hash = wrapper.readInt();

            this._addedOrUpdated.push({ hash, variable: parseWiredVariableData(wrapper) });
        }

        return true;
    }

    public get allVariablesHash(): number
    {
        return this._allVariablesHash;
    }

    public get isLastChunk(): boolean
    {
        return this._isLastChunk;
    }

    public get removedVariables(): string[]
    {
        return this._removedVariables;
    }

    public get addedOrUpdated(): IWiredVariableDiffEntry[]
    {
        return this._addedOrUpdated;
    }
}
