import { IMessageDataWrapper, IMessageParser } from '@nitrots/api';

export class SnowWarGamesInformationParser implements IMessageParser
{
    private _playersInQueue: number;
    private _gamesPlayed: number;

    public flush(): boolean
    {
        this._playersInQueue = -1;
        this._gamesPlayed = -1;

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._playersInQueue = wrapper.readInt();
        this._gamesPlayed = wrapper.readInt();

        return true;
    }

    public get playersInQueue(): number
    {
        return this._playersInQueue;
    }

    public get gamesPlayed(): number
    {
        return this._gamesPlayed;
    }
}
