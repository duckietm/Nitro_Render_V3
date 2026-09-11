import { IMessageEvent } from '@octane/api';
import { MessageEvent } from '@octane/events';
import { SpecialRoomEventParser } from '../../../parser';

export class SpecialRoomEventEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, SpecialRoomEventParser);
    }

    public getParser(): SpecialRoomEventParser
    {
        return this.parser as SpecialRoomEventParser;
    }
}
