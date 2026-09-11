import { IMessageComposer } from '@octane/api';

/**
 * AIR `LatencyTracker.testLatency`: a bare request id the server echoes back
 * unchanged, so the client can time the round trip.
 */
export class LatencyPingRequestMessageComposer implements IMessageComposer<ConstructorParameters<typeof LatencyPingRequestMessageComposer>>
{
    private _data: ConstructorParameters<typeof LatencyPingRequestMessageComposer>;

    constructor(requestId: number)
    {
        this._data = [ requestId ];
    }

    public getMessageArray()
    {
        return this._data;
    }

    public dispose(): void
    {
        this._data = null;
    }
}
