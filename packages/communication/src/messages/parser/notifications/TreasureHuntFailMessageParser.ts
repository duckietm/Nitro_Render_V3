import { IMessageDataWrapper, IMessageParser } from '@octane/api';

/** Official `class_3329`: the hunt refused the find because the level is too low. */
export class TreasureHuntFailMessageParser implements IMessageParser
{
    private _huntId: string;
    private _requiredLevel: number;
    private _requiredLevelPaying: number;

    public flush(): boolean
    {
        this._huntId = null;
        this._requiredLevel = 0;
        this._requiredLevelPaying = 0;

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._huntId = wrapper.readString();
        this._requiredLevel = wrapper.readInt();
        this._requiredLevelPaying = wrapper.readInt();

        return true;
    }

    public get huntId(): string
    {
        return this._huntId;
    }

    public get requiredLevel(): number
    {
        return this._requiredLevel;
    }

    public get requiredLevelPaying(): number
    {
        return this._requiredLevelPaying;
    }
}
