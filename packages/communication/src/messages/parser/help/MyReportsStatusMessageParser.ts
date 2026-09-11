import { IMessageDataWrapper, IMessageParser } from '@octane/api';
import { MyReportStatusData } from './MyReportStatusData';

/**
 * Official AIR 13 event 2981 (`HabboHelp.onMyCfhReportStatusMessageEvent` ->
 * `MyReportStatus.openWindow`): the reports this player filed, newest first in the
 * window, each with its decision and appeal state.
 */
export class MyReportsStatusMessageParser implements IMessageParser
{
    private _reports: MyReportStatusData[];

    public flush(): boolean
    {
        this._reports = [];

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._reports = [];

        let totalReports = wrapper.readInt();

        while(totalReports > 0)
        {
            this._reports.push(new MyReportStatusData(wrapper));

            totalReports--;
        }

        return true;
    }

    public get reports(): MyReportStatusData[]
    {
        return this._reports;
    }
}
