import { IMessageDataWrapper, IMessageParser } from '@octane/api';

/**
 * Official `class_3818` / `DiscordPreferences.readFromData` (event 1600): the stored Discord
 * Rich Presence preferences. Version 0 means "never saved", which makes the official controller
 * fall back to the all-on defaults and offer the settings popup.
 */
export class DiscordPreferencesParser implements IMessageParser
{
    private _version: number;
    private _showHabbo: boolean;
    private _shareActivity: boolean;
    private _hideInHiddenRooms: boolean;
    private _allowJoining: boolean;

    public flush(): boolean
    {
        this._version = 0;
        this._showHabbo = false;
        this._shareActivity = false;
        this._hideInHiddenRooms = false;
        this._allowJoining = false;

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._version = wrapper.readInt();
        this._showHabbo = wrapper.readBoolean();
        this._shareActivity = wrapper.readBoolean();
        this._hideInHiddenRooms = wrapper.readBoolean();
        this._allowJoining = wrapper.readBoolean();

        return true;
    }

    public get version(): number
    {
        return this._version;
    }

    public get showHabbo(): boolean
    {
        return this._showHabbo;
    }

    public get shareActivity(): boolean
    {
        return this._shareActivity;
    }

    public get hideInHiddenRooms(): boolean
    {
        return this._hideInHiddenRooms;
    }

    public get allowJoining(): boolean
    {
        return this._allowJoining;
    }
}
