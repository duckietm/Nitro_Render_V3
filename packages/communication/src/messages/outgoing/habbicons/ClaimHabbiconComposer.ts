import { IMessageComposer } from '@octane/api';

export class ClaimHabbiconComposer implements IMessageComposer<[number]>
{
    constructor(private habbiconId: number)
    {}

    public getMessageArray(): [number]
    {
        return [this.habbiconId];
    }

    public dispose(): void
    {
        return;
    }
}
