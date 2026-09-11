import { IMessageEvent } from '@octane/api';
import { MessageEvent } from '@octane/events';
import { Game2UserBlockedMessageParser } from '../../../parser';

export class Game2UserBlockedMessageEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, Game2UserBlockedMessageParser);
    }

    public getParser(): Game2UserBlockedMessageParser
    {
        return this.parser as Game2UserBlockedMessageParser;
    }
}
