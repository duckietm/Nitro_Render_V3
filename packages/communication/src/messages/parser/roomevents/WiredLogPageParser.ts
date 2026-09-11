import { IMessageDataWrapper, IMessageParser } from '@octane/api';
import { readWiredLong } from './WiredVariableData';

/** One room-wide wired log line (`package_222.WiredLogEntry`). */
export interface IWiredLogEntry
{
    id: number;
    logLevel: number;
    logSource: number;
    logMessage: string;
    timestamp: number;
    timestampStr: string;
}

export class WiredLogPageParser implements IMessageParser
{
    private _totalEntries: number;
    private _currentPage: number;
    private _amount: number;
    private _entries: IWiredLogEntry[];
    private _logLevelFilter: number;
    private _logSourceFilter: number;
    private _query: string;

    public flush(): boolean
    {
        this._totalEntries = 0;
        this._currentPage = 0;
        this._amount = 0;
        this._entries = [];
        this._logLevelFilter = -1;
        this._logSourceFilter = -1;
        this._query = null;

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._totalEntries = wrapper.readInt();
        this._currentPage = wrapper.readInt();
        this._amount = wrapper.readInt();
        this._entries = [];

        const totalEntries = wrapper.readInt();

        for(let i = 0; i < totalEntries; i++)
        {
            this._entries.push({
                id: readWiredLong(wrapper),
                logLevel: wrapper.readByte(),
                logSource: wrapper.readByte(),
                logMessage: wrapper.readString(),
                timestamp: readWiredLong(wrapper),
                timestampStr: wrapper.readString()
            });
        }

        this._logLevelFilter = wrapper.readBoolean() ? wrapper.readByte() : -1;
        this._logSourceFilter = wrapper.readBoolean() ? wrapper.readByte() : -1;
        this._query = wrapper.readBoolean() ? wrapper.readString() : null;

        return true;
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

    public get entries(): IWiredLogEntry[]
    {
        return this._entries;
    }

    public get logLevelFilter(): number
    {
        return this._logLevelFilter;
    }

    public get logSourceFilter(): number
    {
        return this._logSourceFilter;
    }

    public get query(): string
    {
        return this._query;
    }
}
