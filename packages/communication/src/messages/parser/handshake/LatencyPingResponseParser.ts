import { IMessageDataWrapper, IMessageParser } from '@octane/api';

/**
 * AIR `LatencyTracker.onPingResponse`: the echoed request id of the matching
 * latency ping request.
 */
export class LatencyPingResponseParser implements IMessageParser
{
    private _requestId: number;

    public flush(): boolean
    {
        this._requestId = -1;

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._requestId = wrapper.readInt();

        return true;
    }

    public get requestId(): number
    {
        return this._requestId;
    }
}
