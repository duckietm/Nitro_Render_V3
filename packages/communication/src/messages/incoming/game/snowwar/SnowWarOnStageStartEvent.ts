import { IMessageEvent } from '@nitrots/api';
import { MessageEvent } from '@nitrots/events';
import { SnowWarOnStageStartParser } from '../../../parser';

export class SnowWarOnStageStartEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, SnowWarOnStageStartParser);
    }

    public getParser(): SnowWarOnStageStartParser
    {
        return this.parser as SnowWarOnStageStartParser;
    }
}
