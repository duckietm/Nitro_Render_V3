import { IMessageEvent } from '@nitrots/api';
import { MessageEvent } from '@nitrots/events';
import { CatalogAdminPageDetailsMessageParser } from '../../parser';

export class CatalogAdminPageDetailsEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, CatalogAdminPageDetailsMessageParser);
    }

    public getParser(): CatalogAdminPageDetailsMessageParser
    {
        return this.parser as CatalogAdminPageDetailsMessageParser;
    }
}
