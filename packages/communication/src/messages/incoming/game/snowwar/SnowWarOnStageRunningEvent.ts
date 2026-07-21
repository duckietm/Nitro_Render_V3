import { IMessageEvent } from '@nitrots/api';
import { MessageEvent } from '@nitrots/events';
import { SnowWarOnStageRunningParser } from '../../../parser';

export class SnowWarOnStageRunningEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, SnowWarOnStageRunningParser);
    }

    public getParser(): SnowWarOnStageRunningParser
    {
        return this.parser as SnowWarOnStageRunningParser;
    }
}
