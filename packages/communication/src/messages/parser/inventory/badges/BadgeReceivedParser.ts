import { IMessageDataWrapper, IMessageParser } from '@nitrots/api';

export class BadgeReceivedParser implements IMessageParser
{
    private _badgeId: number;
    private _badgeCode: string;
    private _senderName: string;

    public flush(): boolean
    {
        this._badgeId = 0;
        this._badgeCode = null;
        this._senderName = '';

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._badgeId = wrapper.readInt();
        this._badgeCode = wrapper.readString();
        // Extra field appended by the Arcturus-Nitro fork: sender username for
        // badges awarded by a staff member via the `:badge` command. Read
        // defensively so older servers that don't send it still parse cleanly.
        this._senderName = wrapper.bytesAvailable ? wrapper.readString() : '';

        return true;
    }

    public get badgeId(): number
    {
        return this._badgeId;
    }

    public get badgeCode(): string
    {
        return this._badgeCode;
    }

    public get senderName(): string
    {
        return this._senderName;
    }
}
