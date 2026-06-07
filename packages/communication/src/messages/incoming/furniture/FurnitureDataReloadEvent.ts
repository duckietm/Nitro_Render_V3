import { IMessageEvent } from '@nitrots/api';
import { MessageEvent } from '@nitrots/events';
import { FurnitureDataReloadParser } from '../../parser/furniture/FurnitureDataReloadParser';

export class FurnitureDataReloadEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, FurnitureDataReloadParser);
    }

    public getParser(): FurnitureDataReloadParser
    {
        return this.parser as FurnitureDataReloadParser;
    }
}
