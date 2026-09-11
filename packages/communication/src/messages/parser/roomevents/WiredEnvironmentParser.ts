import { IMessageDataWrapper, IMessageParser } from '@octane/api';

export class WiredEnvironmentParser implements IMessageParser
{
    private _hasClickUserWired: boolean;
    private _enabledAchievements: string[];

    public flush(): boolean
    {
        this._hasClickUserWired = false;
        this._enabledAchievements = [];

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._hasClickUserWired = wrapper.readBoolean();
        this._enabledAchievements = [];

        if(wrapper.bytesAvailable)
        {
            const totalAchievements = wrapper.readInt();

            for(let i = 0; i < totalAchievements; i++) this._enabledAchievements.push(wrapper.readString());
        }

        return true;
    }

    public get hasClickUserWired(): boolean
    {
        return this._hasClickUserWired;
    }

    public get enabledAchievements(): string[]
    {
        return this._enabledAchievements;
    }
}
