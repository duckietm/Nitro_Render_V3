import { IMessageEvent } from '@octane/api';
import { MessageEvent } from '@octane/events';
import { OfficialRoomsParser } from '../../parser';

export class OfficialRoomsEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, OfficialRoomsParser);
    }

    public getParser(): OfficialRoomsParser
    {
        return this.parser as OfficialRoomsParser;
    }
}
