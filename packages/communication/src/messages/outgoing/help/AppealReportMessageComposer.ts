import { IMessageComposer } from '@octane/api';

/**
 * Official `MyReportStatus.onClickAppeal(_shownObject.message.id)` -> composer 3063
 * `(reportId:int)`: the player disputes the outcome of one of their own reports.
 */
export class AppealReportMessageComposer implements IMessageComposer<ConstructorParameters<typeof AppealReportMessageComposer>>
{
    private _data: ConstructorParameters<typeof AppealReportMessageComposer>;

    constructor(reportId: number)
    {
        this._data = [reportId];
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
