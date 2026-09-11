import { IMessageDataWrapper } from '@octane/api';

/**
 * AIR `SnowWarGameTokenOffer`: one "buy more games" offer of the game hub.
 * `localizationId` is the offer key (`GET_SNOWWAR_TOKENS`, `..2`, `..3`) that
 * picks the button and the product image.
 */
export class SnowWarGameTokenOffer
{
    private _offerId: number;
    private _localizationId: string;
    private _priceInCredits: number;
    private _priceInActivityPoints: number;
    private _activityPointType: number;

    constructor(wrapper: IMessageDataWrapper)
    {
        this._offerId = wrapper.readInt();
        this._localizationId = wrapper.readString();
        this._priceInCredits = wrapper.readInt();
        this._priceInActivityPoints = wrapper.readInt();
        this._activityPointType = wrapper.readInt();
    }

    public get offerId(): number
    {
        return this._offerId;
    }

    public get localizationId(): string
    {
        return this._localizationId;
    }

    public get priceInCredits(): number
    {
        return this._priceInCredits;
    }

    public get priceInActivityPoints(): number
    {
        return this._priceInActivityPoints;
    }

    public get activityPointType(): number
    {
        return this._activityPointType;
    }
}
