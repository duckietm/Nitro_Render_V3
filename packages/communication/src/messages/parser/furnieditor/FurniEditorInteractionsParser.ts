import { IMessageDataWrapper, IMessageParser } from '@nitrots/api';

export class FurniEditorInteractionsParser implements IMessageParser
{
    private _interactions: string[];

    public flush(): boolean
    {
        this._interactions = [];
        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        const count = wrapper.readInt();
        this._interactions = [];

        for(let i = 0; i < count; i++)
        {
            this._interactions.push(wrapper.readString());
        }

        return true;
    }

    public get interactions(): string[] { return this._interactions; }
}
