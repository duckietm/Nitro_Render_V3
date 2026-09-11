import { IMessageDataWrapper, IMessageParser } from '@octane/api';

/**
 * Official AIR 13 event 946 (`SessionDataManager.onPurchasableChatStyles`): every chat
 * bubble style this account bought. The chat-style selector adds these on top of the
 * styles the client already offers from `chat.styles`
 * (`RoomChatInputView` -> `hasPurchasableChatStyle`).
 */
export class PurchasableChatStylesMessageParser implements IMessageParser
{
    private _chatStyleIds: number[];

    public flush(): boolean
    {
        this._chatStyleIds = [];

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._chatStyleIds = [];

        let totalStyles = wrapper.readInt();

        while(totalStyles > 0)
        {
            this._chatStyleIds.push(wrapper.readInt());

            totalStyles--;
        }

        return true;
    }

    public get chatStyleIds(): number[]
    {
        return this._chatStyleIds;
    }
}
