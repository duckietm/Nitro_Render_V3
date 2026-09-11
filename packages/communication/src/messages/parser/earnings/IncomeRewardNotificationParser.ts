import { IMessageDataWrapper, IMessageParser } from '@octane/api';

/**
 * `IncomeRewardNotificationMessageParser` (official `class_3780`): a single byte
 * telling which earnings category was just credited. `EarningsController`
 * only uses it to raise the `notification.earning.new` bubble and to refresh
 * the purse indicators, so the category is informative.
 */
export class IncomeRewardNotificationParser implements IMessageParser
{
    private _rewardCategory: number;

    public flush(): boolean
    {
        this._rewardCategory = -1;

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._rewardCategory = wrapper.readByte();

        return true;
    }

    public get rewardCategory(): number
    {
        return this._rewardCategory;
    }
}
