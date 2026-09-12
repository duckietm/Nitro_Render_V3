import { IMessageDataWrapper, IMessageParser } from '@octane/api';

/**
 * The room's raid protection configuration, plus the two pieces of state shown beside it.
 *
 * `incidentActive` and `lastRaidAtEpochSeconds` are state rather than settings, which is why the
 * panel leaves them out when it compares what the user has edited against what is stored.
 *
 * `RaidProtectionSaveResultParser` repeats these reads instead of calling into this class: the
 * packet contract verifier reads each parser file statically and cannot follow a call into another
 * class, so a delegated read would be an invisible read.
 */
export class RaidProtectionSettingsParser implements IMessageParser
{
    private _roomId: number;
    private _enabled: boolean;
    private _detectionSensitivity: number;
    private _actionType: number;
    private _banDurationSeconds: number;
    private _guardEnabled: boolean;
    private _guardDurationSeconds: number;
    private _guardSensitivity: number;
    private _incidentActive: boolean;
    private _lastRaidAtEpochSeconds: number;

    public flush(): boolean
    {
        this._roomId = 0;
        this._enabled = false;
        this._detectionSensitivity = 0;
        this._actionType = 0;
        this._banDurationSeconds = 0;
        this._guardEnabled = false;
        this._guardDurationSeconds = 0;
        this._guardSensitivity = 0;
        this._incidentActive = false;
        this._lastRaidAtEpochSeconds = 0;

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._roomId = wrapper.readInt();
        this._enabled = wrapper.readBoolean();
        this._detectionSensitivity = wrapper.readInt();
        this._actionType = wrapper.readInt();
        this._banDurationSeconds = wrapper.readInt();
        this._guardEnabled = wrapper.readBoolean();
        this._guardDurationSeconds = wrapper.readInt();
        this._guardSensitivity = wrapper.readInt();
        this._incidentActive = wrapper.readBoolean();
        this._lastRaidAtEpochSeconds = wrapper.readInt();

        return true;
    }

    public get roomId(): number
    {
        return this._roomId;
    }

    public get enabled(): boolean
    {
        return this._enabled;
    }

    public get detectionSensitivity(): number
    {
        return this._detectionSensitivity;
    }

    public get actionType(): number
    {
        return this._actionType;
    }

    public get banDurationSeconds(): number
    {
        return this._banDurationSeconds;
    }

    public get guardEnabled(): boolean
    {
        return this._guardEnabled;
    }

    public get guardDurationSeconds(): number
    {
        return this._guardDurationSeconds;
    }

    public get guardSensitivity(): number
    {
        return this._guardSensitivity;
    }

    public get incidentActive(): boolean
    {
        return this._incidentActive;
    }

    public get lastRaidAtEpochSeconds(): number
    {
        return this._lastRaidAtEpochSeconds;
    }
}
