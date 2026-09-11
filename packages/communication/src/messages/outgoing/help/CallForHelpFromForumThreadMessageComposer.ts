import { IMessageComposer } from '@octane/api';

/**
 * The official composer ends with two extra strings (reporter name and e-mail); they are
 * filled in only by the unlawful-activity branch of `TopicsFlowHelpController` and are empty
 * strings otherwise.
 */
export class CallForHelpFromForumThreadMessageComposer implements IMessageComposer<ConstructorParameters<typeof CallForHelpFromForumThreadMessageComposer>>
{
    private _data: ConstructorParameters<typeof CallForHelpFromForumThreadMessageComposer>;

    constructor(groupId: number, threadId: number, cfhTopic: number, message: string, reporterName: string = '', reporterEmail: string = '')
    {
        this._data = [groupId, threadId, cfhTopic, message, reporterName, reporterEmail];
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
