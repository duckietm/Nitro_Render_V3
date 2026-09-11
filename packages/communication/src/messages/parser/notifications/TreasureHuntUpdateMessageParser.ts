import { IMessageDataWrapper, IMessageParser } from '@octane/api';

/** Official `class_3710`: progress of the hunt after a find. */
export class TreasureHuntUpdateMessageParser implements IMessageParser
{
    private _huntId: string;
    private _stepsCompleted: number;
    private _totalSteps: number;
    private _isCompleted: boolean;

    public flush(): boolean
    {
        this._huntId = null;
        this._stepsCompleted = 0;
        this._totalSteps = 0;
        this._isCompleted = false;

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._huntId = wrapper.readString();
        this._stepsCompleted = wrapper.readInt();
        this._totalSteps = wrapper.readInt();
        this._isCompleted = wrapper.readBoolean();

        return true;
    }

    public get huntId(): string
    {
        return this._huntId;
    }

    public get stepsCompleted(): number
    {
        return this._stepsCompleted;
    }

    public get totalSteps(): number
    {
        return this._totalSteps;
    }

    public get isCompleted(): boolean
    {
        return this._isCompleted;
    }
}
