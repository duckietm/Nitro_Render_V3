import { IMessageEvent } from '@octane/api';
import { MessageEvent } from '@octane/events';
import { RoomQueueStatusParser } from '../../../parser';

export class RoomQueueStatusEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, RoomQueueStatusParser);
    }

    public getParser(): RoomQueueStatusParser
    {
        return this.parser as RoomQueueStatusParser;
    }
}
