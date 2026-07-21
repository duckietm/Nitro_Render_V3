import { IMessageComposer } from '@nitrots/api';

export class SnowWarCreateSnowballComposer implements IMessageComposer<[]>
{
    public getMessageArray(): [] { return []; }
    public dispose(): void { return; }
}
