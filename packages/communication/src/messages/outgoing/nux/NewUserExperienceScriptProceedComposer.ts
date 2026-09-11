import { IMessageComposer } from '@octane/api';

/**
 * Official `HabboNuxDialogs` composer 2132: the reason the NUX script moves on -
 * 0 from "Verify & get gifts" (`onVerify`) and 2 from the "never again" confirmation
 * (`onNeverAgainConfirmClose`).
 */
export class NewUserExperienceScriptProceedComposer implements IMessageComposer<ConstructorParameters<typeof NewUserExperienceScriptProceedComposer>>
{
    public static readonly VERIFY: number = 0;
    public static readonly NEVER_AGAIN: number = 2;

    private _data: ConstructorParameters<typeof NewUserExperienceScriptProceedComposer>;

    constructor(reason: number = 0)
    {
        this._data = [reason];
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
