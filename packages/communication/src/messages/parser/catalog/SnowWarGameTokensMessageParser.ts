import { IMessageDataWrapper, IMessageParser } from '@octane/api';
import { SnowWarGameTokenOffer } from './SnowWarGameTokenOffer';

/**
 * AIR `SnowWarGameTokensMessageParser`: the list of game-token offers the hub
 * shows behind its "get more games" buttons.
 */
export class SnowWarGameTokensMessageParser implements IMessageParser
{
    private _offers: SnowWarGameTokenOffer[];

    public flush(): boolean
    {
        this._offers = [];

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        const count = wrapper.readInt();
        this._offers = [];
        for(let index = 0; index < count; index++) this._offers.push(new SnowWarGameTokenOffer(wrapper));

        return true;
    }

    public get offers(): SnowWarGameTokenOffer[]
    {
        return this._offers;
    }
}
