import { IMessageEvent } from '@nitrots/api';
import { MessageEvent } from '@nitrots/events';
import { WiredMovementsParser } from '../../../parser';

export class WiredMovementsEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, WiredMovementsParser);
    }

    public getParser(): WiredMovementsParser
    {
        return this.parser as WiredMovementsParser;
    }
}
