import { IMessageComposer } from '@octane/api';

/** One cached wired variable and the hash the client currently holds for it. */
export interface IWiredVariableHash
{
    variableId: string;
    hash: number;
}

/**
 * Official AIR 13 `WiredVariablesSynchronizer`: after the server answered with a
 * different `allVariablesHash`, the client sends the hashes it has cached so the
 * server can reply with only the removed and the added/updated variables.
 */
export class WiredVariableHashesComposer implements IMessageComposer<(string | number)[]>
{
    private _data: (string | number)[];

    constructor(hashes: IWiredVariableHash[])
    {
        const entries = hashes ?? [];

        this._data = [ entries.length ];

        for(const entry of entries)
        {
            this._data.push(entry.variableId);
            this._data.push(entry.hash);
        }
    }

    public getMessageArray(): (string | number)[]
    {
        return this._data;
    }

    public dispose(): void
    {
        return;
    }
}
