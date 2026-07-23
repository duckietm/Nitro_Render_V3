import { IMessageEvent } from '@nitrots/api';
import { MessageEvent } from '@nitrots/events';
import { WiredFurniGravityMessageParser } from '../../../parser';

export class WiredFurniGravityMessageEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, WiredFurniGravityMessageParser);
    }

    public getParser(): WiredFurniGravityMessageParser
    {
        return this.parser as WiredFurniGravityMessageParser;
    }
}
