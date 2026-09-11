import { IAdvancedMap, IMessageDataWrapper, IMessageParser } from '@octane/api';
import { AdvancedMap } from '@octane/utils';

/** One badge as the inventory badges packet carries it. */
export interface IBadgeDetail
{
    badgeId: number;
    badgeCode: string;
    ownerCount: number;
    badgeRarityId: number;
}

export class BadgesParser implements IMessageParser
{
    private _allBadgeCodes: string[];
    private _activeBadgeCodes: string[];
    private _badgeIds: IAdvancedMap<string, number>;
    private _badgeDetails: IBadgeDetail[];

    public flush(): boolean
    {
        this._allBadgeCodes = [];
        this._activeBadgeCodes = null;
        this._badgeIds = null;
        this._badgeDetails = [];

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._allBadgeCodes = [];
        this._activeBadgeCodes = [];
        this._badgeIds = new AdvancedMap();
        this._badgeDetails = [];

        let count = wrapper.readInt();

        while(count > 0)
        {
            // Official `BadgesMessageParser` (AIR 13): every badge carries how
            // many Habbos own it and its rarity tier alongside the id and code.
            const badgeId = wrapper.readInt();
            const badgeCode = wrapper.readString();
            const ownerCount = wrapper.readInt();
            const badgeRarityId = wrapper.readInt();

            this._badgeIds.add(badgeCode, badgeId);

            this._allBadgeCodes.push(badgeCode);
            this._badgeDetails.push({ badgeId, badgeCode, ownerCount, badgeRarityId });

            count--;
        }

        count = wrapper.readInt();

        while(count > 0)
        {
            const badgeSlot = wrapper.readInt();
            const badgeCode = wrapper.readString();

            this._activeBadgeCodes.push(badgeCode);

            count--;
        }

        return true;
    }

    public getBadgeId(code: string): number
    {
        return this._badgeIds.getValue(code);
    }
    public getAllBadgeCodes(): string[]
    {
        return this._allBadgeCodes;
    }

    /** Owner count and rarity tier per badge, as the packet sent them. */
    public getBadgeDetails(): IBadgeDetail[]
    {
        return this._badgeDetails;
    }

    public getActiveBadgeCodes(): string[]
    {
        return this._activeBadgeCodes;
    }
}
