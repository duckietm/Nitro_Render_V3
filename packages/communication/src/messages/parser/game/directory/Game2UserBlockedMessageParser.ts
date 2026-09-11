import { IMessageDataWrapper, IMessageParser } from '@octane/api';

/**
 * AIR `Game2UserBlockedMessageParser`: the remaining seconds of the leave-game
 * block, fed to `GamesMainViewController.changeBlockStatus`.
 */
export class Game2UserBlockedMessageParser implements IMessageParser
{
    private _playerBlockLength: number;

    public flush(): boolean
    {
        this._playerBlockLength = 0;

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._playerBlockLength = wrapper.readInt();

        return true;
    }

    public get playerBlockLength(): number
    {
        return this._playerBlockLength;
    }
}
