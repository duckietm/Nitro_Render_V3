import { IMessageEvent } from '@nitrots/api';
import { MessageEvent } from '@nitrots/events';
import { HanditemBlockStateMessageParser } from '../../../parser';

export class HanditemBlockStateMessageEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, HanditemBlockStateMessageParser);
    }

    public getParser(): HanditemBlockStateMessageParser
    {
        return this.parser as HanditemBlockStateMessageParser;
    }
}
