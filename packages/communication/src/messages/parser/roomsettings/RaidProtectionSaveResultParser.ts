import { IMessageDataWrapper, IMessageParser } from '@octane/api';

/**
 * The answer to a raid protection save.
 *
 * The field order is not the obvious one: the room id comes first, then the result code, and only
 * then the rest of the settings snapshot. The room id is sent once, not twice.
 *
 * Result code 0 is success and closes the panel; the other codes leave it open.
 *
 * The nine snapshot reads are written out here rather than delegated to
 * `RaidProtectionSettingsParser`: the packet contract verifier reads this file statically and
 * cannot follow a call into another class, so a delegated read is an invisible read.
 */
export class RaidProtectionSaveResultParser implements IMessageParser
{
    public static readonly RESULT_OK: number = 0;

    private _roomId: number;
    private _resultCode: number;
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
        this._resultCode = 0;
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
        this._resultCode = wrapper.readInt();
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

    public get succeeded(): boolean
    {
        return this._resultCode === RaidProtectionSaveResultParser.RESULT_OK;
    }

    public get resultCode(): number
    {
        return this._resultCode;
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
