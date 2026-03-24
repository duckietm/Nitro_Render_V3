import { IMessageEvent } from '@nitrots/api';
import { MessageEvent } from '@nitrots/events';
import { CatalogAdminResultMessageParser } from '../../parser';

export class CatalogAdminResultEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, CatalogAdminResultMessageParser);
    }

    public getParser(): CatalogAdminResultMessageParser
    {
        return this.parser as CatalogAdminResultMessageParser;
    }
}
