import { IMessageComposer } from '@octane/api';

/**
 * Official `ClubDiscountPromoExtension.onTextRegionClicked()` /
 * `CitizenshipVipDiscountPromoExtension.onButtonClicked()` -> composer 352 (no payload):
 * asks the server for the discounted club-extension offer so the client can show the
 * extend confirmation before the purchase. The server answers with the club extend offer
 * event (`CLUB_EXTENDED_OFFER`).
 */
export class HabboClubExtendConfirmMessageComposer implements IMessageComposer<ConstructorParameters<typeof HabboClubExtendConfirmMessageComposer>>
{
    private _data: ConstructorParameters<typeof HabboClubExtendConfirmMessageComposer>;

    constructor()
    {
        this._data = [];
    }

    public getMessageArray()
    {
        return this._data;
    }

    public dispose(): void
    {
        this._data = null;
    }
}
