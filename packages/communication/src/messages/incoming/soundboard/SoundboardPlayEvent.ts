import { IMessageEvent } from '@nitrots/api';
import { MessageEvent } from '@nitrots/events';
import { SoundboardPlayParser } from '../../parser';

export class SoundboardPlayEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, SoundboardPlayParser);
    }

    public getParser(): SoundboardPlayParser
    {
        return this.parser as SoundboardPlayParser;
    }
}
