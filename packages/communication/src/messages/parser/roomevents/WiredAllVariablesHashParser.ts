import { IMessageDataWrapper, IMessageParser } from '@octane/api';

export class WiredAllVariablesHashParser implements IMessageParser
{
    private _allVariablesHash: number;

    public flush(): boolean
    {
        this._allVariablesHash = 0;

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._allVariablesHash = wrapper.readInt();

        return true;
    }

    public get allVariablesHash(): number
    {
        return this._allVariablesHash;
    }
}
