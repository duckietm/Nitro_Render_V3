import { IMessageDataWrapper } from '@octane/api';
import { AchievementsParser } from '../../inventory';

export class UserGameAchievementsMessageParser extends AchievementsParser
{
    private _gameTypeId: number = 0;

    public flush(): boolean
    {
        this._gameTypeId = 0;

        return super.flush();
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._gameTypeId = wrapper.readInt();

        return super.parse(wrapper);
    }

    public get gameTypeId(): number
    {
        return this._gameTypeId;
    }
}
