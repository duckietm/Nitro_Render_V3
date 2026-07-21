import { IMessageComposer } from '@nitrots/api';

export class SnowWarLoadStageReadyComposer implements IMessageComposer<[]>
{
    public getMessageArray(): [] { return []; }
    public dispose(): void { return; }
}
