import { IMessageEvent } from '@nitrots/api';
import { MessageEvent } from '@nitrots/events';
import { WiredFurniRuntimeStateParser } from '../../parser';

export class WiredFurniRuntimeStateEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, WiredFurniRuntimeStateParser);
    }

    public getParser(): WiredFurniRuntimeStateParser
    {
        return this.parser as WiredFurniRuntimeStateParser;
    }
}
