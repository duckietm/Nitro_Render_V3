import { IMessageDataWrapper, IMessageParser } from '@octane/api';

/**
 * AIR `Game2GameNotFoundMessageParser`: an empty notice that the game the
 * client asked to join no longer exists.
 */
export class Game2GameNotFoundMessageParser implements IMessageParser
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
