import { IMessageEvent } from '@nitrots/api';
import { MessageEvent } from '@nitrots/events';
import { WiredArrayInspectionDataParser } from '../../parser';

export class WiredArrayInspectionDataEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, WiredArrayInspectionDataParser);
    }

    public getParser(): WiredArrayInspectionDataParser
    {
        return this.parser as WiredArrayInspectionDataParser;
    }
}
