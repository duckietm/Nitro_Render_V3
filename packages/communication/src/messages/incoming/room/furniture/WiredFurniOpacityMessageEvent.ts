import { IMessageEvent } from '@nitrots/api';
import { MessageEvent } from '@nitrots/events';
import { WiredFurniOpacityMessageParser } from '../../../parser';

export class WiredFurniOpacityMessageEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, WiredFurniOpacityMessageParser);
    }

    public getParser(): WiredFurniOpacityMessageParser
    {
        return this.parser as WiredFurniOpacityMessageParser;
    }
}
