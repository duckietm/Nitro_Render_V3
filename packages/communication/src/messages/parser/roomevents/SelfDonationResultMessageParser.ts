import { IMessageDataWrapper, IMessageParser } from '@octane/api';

/**
 * Official `class_3468` (`SelfDonationResultMessageEvent`): the result of the
 * sandbox self donation tool. `SelfDonationTool.onSelfDonationResult` maps
 * 0 to `selfdonation.result.success`, 1 to `selfdonation.result.not_allowed`
 * and anything else to `selfdonation.result.failed`.
 */
export class SelfDonationResultMessageParser implements IMessageParser
{
    public static readonly SUCCESS: number = 0;
    public static readonly NOT_ALLOWED: number = 1;
    public static readonly FAILED: number = 2;

    private _resultCode: number;

    public flush(): boolean
    {
        this._resultCode = -1;

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._resultCode = wrapper.readInt();

        return true;
    }

    public get resultCode(): number
    {
        return this._resultCode;
    }
}
