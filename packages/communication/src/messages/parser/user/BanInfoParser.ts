import { IMessageDataWrapper, IMessageParser } from '@octane/api';

/**
 * Official `class_2694` (event 2524 `BanInfo`): `short target, string reason,
 * int banExpirySeconds, string localizedReason`. `HabboAlertDialogManager.handleBanInfoMessage`
 * builds the alert from `login.banned.until` / `login.banned.reason`, or from the localized
 * reason with its `{expiryDate}` placeholder when the server sends one.
 */
export class BanInfoParser implements IMessageParser
{
    private _target: number;
    private _reason: string;
    private _banExpirySeconds: number;
    private _localizedReason: string;

    public flush(): boolean
    {
        this._target = -1;
        this._reason = '';
        this._banExpirySeconds = -1;
        this._localizedReason = '';

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._target = wrapper.readShort();
        this._reason = wrapper.readString();
        this._banExpirySeconds = wrapper.readInt();
        this._localizedReason = wrapper.readString();

        return true;
    }

    public get target(): number
    {
        return this._target;
    }

    public get reason(): string
    {
        return this._reason;
    }

    public get banExpirySeconds(): number
    {
        return this._banExpirySeconds;
    }

    public get localizedReason(): string
    {
        return this._localizedReason;
    }
}
