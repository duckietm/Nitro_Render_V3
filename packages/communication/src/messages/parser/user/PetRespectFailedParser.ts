import { IMessageDataWrapper, IMessageParser } from '@octane/api';

/**
 * Official `class_2805` (event 2703 `PetRespectFailed`): the account is too young to scratch a
 * pet. `class_1873.onPetRespectFailed` shows `room.error.pets.respectfailed` with both numbers
 * and `SessionDataManager` gives the spent pet respect back.
 */
export class PetRespectFailedParser implements IMessageParser
{
    private _requiredDays: number;
    private _avatarAgeInDays: number;

    public flush(): boolean
    {
        this._requiredDays = 0;
        this._avatarAgeInDays = 0;

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._requiredDays = wrapper.readInt();
        this._avatarAgeInDays = wrapper.readInt();

        return true;
    }

    public get requiredDays(): number
    {
        return this._requiredDays;
    }

    public get avatarAgeInDays(): number
    {
        return this._avatarAgeInDays;
    }
}
