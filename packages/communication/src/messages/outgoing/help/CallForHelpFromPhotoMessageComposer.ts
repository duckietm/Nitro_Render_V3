import { IMessageComposer } from '@octane/api';

/**
 * The official composer ends with two extra strings (reporter name and e-mail); they are
 * filled in only by the unlawful-activity branch of `TopicsFlowHelpController` and are empty
 * strings otherwise.
 */
export class CallForHelpFromPhotoMessageComposer implements IMessageComposer<ConstructorParameters<typeof CallForHelpFromPhotoMessageComposer>>
{
    private _data: ConstructorParameters<typeof CallForHelpFromPhotoMessageComposer>;

    constructor(extraData: string, roomId: number, reportedUserId: number, topicId: number, roomObjectId: number, reporterName: string = '', reporterEmail: string = '')
    {
        this._data = [extraData, roomId, reportedUserId, topicId, roomObjectId, reporterName, reporterEmail];
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
