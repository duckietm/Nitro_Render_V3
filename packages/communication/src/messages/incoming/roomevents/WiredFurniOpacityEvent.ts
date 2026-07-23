import { IMessageEvent } from '@nitrots/api';
import { MessageEvent } from '@nitrots/events';
import { WiredFurniOpacityParser } from '../../parser';

export class WiredFurniOpacityEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, WiredFurniOpacityParser);
    }

    public getParser(): WiredFurniOpacityParser
    {
        return this.parser as WiredFurniOpacityParser;
    }
}
