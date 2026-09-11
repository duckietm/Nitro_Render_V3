import { IMessageDataWrapper } from '@octane/api';

export enum HabbiconState
{
    NotOwned = 0,
    Claimable = 1,
    Owned = 2,
    Favorite = 3,
    Unavailable = 4,
    Reward = 5
}

export enum HabbiconAction
{
    Buy = 0,
    BuyCollection = 1,
    Claim = 2,
    Favorite = 3,
    Unfavorite = 4
}

export enum HabbiconActionError
{
    None = 0,
    Unavailable = 1,
    NotEnoughCredits = 2,
    NotEnoughActivityPoints = 3,
    NotEligible = 4,
    Failed = 5
}

export interface UserHabbiconData
{
    habbiconId: number;
    state: HabbiconState;
}

export interface HabbiconData extends UserHabbiconData
{
    name: string;
    collectionId: number;
    priceCredits: number;
    priceActivityPoints: number;
    activityPointType: number;
}

export interface HabbiconCollectionData
{
    collectionId: number;
    name: string;
    completed: boolean;
    rewardHabbiconId: number;
    rewardState: HabbiconState;
    priceCredits: number;
    priceActivityPoints: number;
    activityPointType: number;
    habbicons: HabbiconData[];
}

/** WIN63-202609091217-117204808, package_229/class_4344. */
export const parseHabbicon = (wrapper: IMessageDataWrapper): HabbiconData => ({
    habbiconId: wrapper.readInt(),
    name: wrapper.readString(),
    collectionId: wrapper.readInt(),
    state: wrapper.readInt(),
    priceCredits: wrapper.readInt(),
    priceActivityPoints: wrapper.readInt(),
    activityPointType: wrapper.readInt()
});
