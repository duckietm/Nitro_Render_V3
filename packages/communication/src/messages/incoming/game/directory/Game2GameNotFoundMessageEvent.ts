import { IMessageEvent } from '@octane/api';
import { MessageEvent } from '@octane/events';
import { Game2GameNotFoundMessageParser } from '../../../parser';

export class Game2GameNotFoundMessageEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, Game2GameNotFoundMessageParser);
    }

    public getParser(): Game2GameNotFoundMessageParser
    {
        return this.parser as Game2GameNotFoundMessageParser;
    }
}
