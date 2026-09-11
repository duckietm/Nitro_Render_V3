import { IMessageComposer } from '@octane/api';

/**
 * Official `HabboHelp.requestReportsStatus()` -> composer 2935 (no payload). The server
 * answers with the my-reports list the "my_reports" window renders.
 */
export class GetMyReportsStatusMessageComposer implements IMessageComposer<ConstructorParameters<typeof GetMyReportsStatusMessageComposer>>
{
    private _data: ConstructorParameters<typeof GetMyReportsStatusMessageComposer>;

    constructor()
    {
        this._data = [];
    }

    public getMessageArray()
    {
        return this._data;
    }

    public dispose(): void
    {
        this._data = null;
    }
}
