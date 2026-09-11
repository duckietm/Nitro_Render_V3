import { IMessageComposer } from '@octane/api';

/**
 * Official AIR 13 `WiredRoomLogListController` page request.
 * `logLevelFilter` / `logSourceFilter` use -1 for "no filter"; `query` may be empty.
 */
export class WiredRoomLogsPageComposer implements IMessageComposer<ConstructorParameters<typeof WiredRoomLogsPageComposer>>
{
    private _data: ConstructorParameters<typeof WiredRoomLogsPageComposer>;

    constructor(page: number, pageSize: number, logLevelFilter: number, logSourceFilter: number, query: string)
    {
        this._data = [ page, pageSize, logLevelFilter, logSourceFilter, query ];
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
