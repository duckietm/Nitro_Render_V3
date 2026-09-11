import { IMessageComposer } from '@octane/api';

/**
 * The official composer ends with two extra strings (reporter name and e-mail); they are
 * filled in only by the unlawful-activity branch of `TopicsFlowHelpController` and are empty
 * strings otherwise.
 */
export class CallForHelpMessageComposer implements IMessageComposer<any>
{
    private _data: any;

    constructor(message: string, topicIndex: number, reportedUserId: number, reportedRoomId: number, chatEntries: (string | number)[], reporterName: string = '', reporterEmail: string = '')
    {
        this._data = [message, topicIndex, reportedUserId, reportedRoomId, chatEntries.length / 2, ...chatEntries, reporterName, reporterEmail];
    }

    public getMessageArray()
    {
        return this._data;
    }

    public dispose(): void
    {
        return;
    }
}
