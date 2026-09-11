import { IMessageDataWrapper, IMessageParser } from '@octane/api';

/**
 * AIR `Game2GameCancelledMessageParser`: an empty notice; the official handler
 * calls `gameCancelled(false)` and drops the player back to the game hub.
 */
export class Game2GameCancelledMessageParser implements IMessageParser
{
    public flush(): boolean
    {
        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        return true;
    }
}
