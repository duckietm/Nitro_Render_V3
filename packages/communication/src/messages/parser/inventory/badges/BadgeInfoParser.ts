import { IMessageDataWrapper, IMessageParser } from '@octane/api';

/**
 * Official `BadgeInfoMessageParser` (AIR 13, header 3228): the reply to
 * `GetBadgeInfo`, used by the badge-display furni to engrave the plate with the
 * badge's rarity tier and how many Habbos own it.
 */
export class BadgeInfoParser implements IMessageParser
{
    private _badgeId: number;
    private _badgeCode: string;
    private _ownerCount: number;
    private _badgeRarityId: number;

    public flush(): boolean
    {
        this._badgeId = 0;
        this._badgeCode = '';
        this._ownerCount = 0;
        this._badgeRarityId = 0;

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._badgeId = wrapper.readInt();
        this._badgeCode = wrapper.readString();
        this._ownerCount = wrapper.readInt();
        this._badgeRarityId = wrapper.readInt();

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

    public get ownerCount(): number
    {
        return this._ownerCount;
    }

    public get badgeRarityId(): number
    {
        return this._badgeRarityId;
    }
}
