import { IMessageDataWrapper, IMessageParser } from '@octane/api';
import { IWiredVariableData, parseWiredVariableData } from './WiredVariableData';

/** `package_215.ObjectIdAndValuePair`. */
export interface IWiredVariableHolderValue
{
    objectId: number;
    value: number;
}

export class WiredVariableHoldersParser implements IMessageParser
{
    private _roomId: number;
    private _variable: IWiredVariableData;
    private _holders: IWiredVariableHolderValue[];

    public flush(): boolean
    {
        this._roomId = 0;
        this._variable = null;
        this._holders = [];

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._roomId = wrapper.readInt();
        this._variable = parseWiredVariableData(wrapper);
        this._holders = [];

        const totalHolders = wrapper.readInt();

        for(let i = 0; i < totalHolders; i++)
        {
            this._holders.push({
                objectId: wrapper.readInt(),
                value: wrapper.readInt()
            });
        }

        return true;
    }

    public get roomId(): number
    {
        return this._roomId;
    }

    public get variable(): IWiredVariableData
    {
        return this._variable;
    }

    public get holders(): IWiredVariableHolderValue[]
    {
        return this._holders;
    }
}
