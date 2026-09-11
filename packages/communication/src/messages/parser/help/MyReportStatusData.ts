import { IMessageDataWrapper } from '@octane/api';

/**
 * One row of the official "my_reports" window, read exactly as AIR 13 reads it
 * (`MyReportStatus` / the per-message reader behind event 2981):
 * `long id, long creationTime, string userMessage, int userCategory,
 *  string reportedAccountName, long closeTime, boolean sanctioned,
 *  boolean sanctionGivenByAutoModeration, byte appealStatus,
 *  long appealCreationTime, long appealResolutionTime`.
 *
 * Times are epoch milliseconds; `closeTime` and `appealResolutionTime` are -1 while the
 * report (respectively the appeal) is still waiting for a decision.
 */
export class MyReportStatusData
{
    /** No appeal was ever filed for this report. */
    public static readonly APPEAL_NONE: number = 0;
    /** An appeal is filed and waiting for staff. */
    public static readonly APPEAL_PENDING: number = 1;
    /** The appeal was reviewed and staff acted on it. */
    public static readonly APPEAL_ACTION: number = 2;
    /** The appeal was reviewed and staff did not act. */
    public static readonly APPEAL_NO_ACTION: number = 3;

    private _id: number;
    private _creationTime: number;
    private _userMessage: string;
    private _userCategory: number;
    private _reportedAccountName: string;
    private _closeTime: number;
    private _sanctioned: boolean;
    private _sanctionGivenByAutoModeration: boolean;
    private _appealStatus: number;
    private _appealCreationTime: number;
    private _appealResolutionTime: number;

    constructor(wrapper: IMessageDataWrapper)
    {
        if(!wrapper) throw new Error('invalid_wrapper');

        this._id = MyReportStatusData.readLong(wrapper);
        this._creationTime = MyReportStatusData.readLong(wrapper);
        this._userMessage = wrapper.readString();
        this._userCategory = wrapper.readInt();
        this._reportedAccountName = wrapper.readString();
        this._closeTime = MyReportStatusData.readLong(wrapper);
        this._sanctioned = wrapper.readBoolean();
        this._sanctionGivenByAutoModeration = wrapper.readBoolean();
        this._appealStatus = wrapper.readByte();
        this._appealCreationTime = MyReportStatusData.readLong(wrapper);
        this._appealResolutionTime = MyReportStatusData.readLong(wrapper);
    }

    /** The official ids and timestamps travel as 64-bit integers, two big-endian ints on the wire. */
    public static readLong(wrapper: IMessageDataWrapper): number
    {
        const high = wrapper.readInt();
        const low = wrapper.readInt();

        return (high * 0x100000000) + (low >>> 0);
    }

    public get id(): number
    {
        return this._id;
    }

    public get creationTime(): number
    {
        return this._creationTime;
    }

    public get userMessage(): string
    {
        return this._userMessage;
    }

    public get userCategory(): number
    {
        return this._userCategory;
    }

    public get reportedAccountName(): string
    {
        return this._reportedAccountName;
    }

    public get closeTime(): number
    {
        return this._closeTime;
    }

    public get sanctioned(): boolean
    {
        return this._sanctioned;
    }

    public get sanctionGivenByAutoModeration(): boolean
    {
        return this._sanctionGivenByAutoModeration;
    }

    public get appealStatus(): number
    {
        return this._appealStatus;
    }

    public get appealCreationTime(): number
    {
        return this._appealCreationTime;
    }

    public get appealResolutionTime(): number
    {
        return this._appealResolutionTime;
    }
}
