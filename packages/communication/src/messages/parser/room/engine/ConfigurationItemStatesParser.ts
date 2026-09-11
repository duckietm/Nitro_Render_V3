import { IMessageDataWrapper, IMessageParser } from '@octane/api';

/**
 * Official `class_3013` (`ConfigurationItemStates`, 1508): the four room flags
 * `class_1902.onConfigurationItemStates` forwards to the room engine
 * (`setHanditemControlBlocked`, `setChooserDisabled`,
 * `setFreeFurniMovementsMode`, `setInvisibleFurni`). The official parser reads
 * the last three only while bytes remain.
 */
export class ConfigurationItemStatesParser implements IMessageParser
{
    private _isHanditemControlBlocked: boolean;
    private _chooserDisabled: boolean;
    private _freeFurniMovementsEnabled: boolean;
    private _invisibleFurni: boolean;

    public flush(): boolean
    {
        this._isHanditemControlBlocked = false;
        this._chooserDisabled = false;
        this._freeFurniMovementsEnabled = false;
        this._invisibleFurni = false;

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._isHanditemControlBlocked = wrapper.readBoolean();
        this._chooserDisabled = wrapper.readBoolean();
        this._freeFurniMovementsEnabled = wrapper.readBoolean();
        this._invisibleFurni = wrapper.readBoolean();

        return true;
    }

    public get isHanditemControlBlocked(): boolean
    {
        return this._isHanditemControlBlocked;
    }

    public get chooserDisabled(): boolean
    {
        return this._chooserDisabled;
    }

    public get freeFurniMovementsEnabled(): boolean
    {
        return this._freeFurniMovementsEnabled;
    }

    public get invisibleFurni(): boolean
    {
        return this._invisibleFurni;
    }
}
