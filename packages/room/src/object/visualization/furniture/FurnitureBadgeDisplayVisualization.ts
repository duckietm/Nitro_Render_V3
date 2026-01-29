import { IGraphicAsset, IRoomObjectSprite, RoomObjectVariable } from '@nitrots/api';
import { GetConfiguration } from '@nitrots/configuration';
import { GetSessionDataManager } from '@nitrots/session';
import { Texture } from 'pixi.js';
import { FurnitureAnimatedVisualization } from './FurnitureAnimatedVisualization';

export class FurnitureBadgeDisplayVisualization extends FurnitureAnimatedVisualization
{
    private static readonly BADGE_TAG = 'BADGE';
    private static readonly BADGE_LAYER_ID = 1;

    private _badgeId = '';
    private _badgeAssetNameNormalScale = '';
    private _badgeAssetNameSmallScale = '';
    private _badgeVisibleInState = -1;

    public getTexture(scale: number, layerId: number, asset: IGraphicAsset): Texture
    {
        return super.getTexture(scale, layerId, asset);
    }
	
	public get sprites(): IRoomObjectSprite[]
{
    const sprites = super.sprites;
    
    for(const sprite of sprites)
    {
        if(!sprite) continue;
        
        if(sprite.name === this._badgeAssetNameNormalScale || sprite.name === this._badgeAssetNameSmallScale)
        {
            sprite.relativeDepth = 0.01;
        }
    }
    
    return sprites;
}

    protected updateModel(scale: number): boolean
    {
        let needsUpdate = super.updateModel(scale);

        const badgeStatus = this.object.model.getValue<number>(RoomObjectVariable.FURNITURE_BADGE_IMAGE_STATUS);
        const badgeId = this.object.model.getValue<string>(RoomObjectVariable.FURNITURE_BADGE_ASSET_NAME);

        if (badgeStatus === -1)
        {
            this._badgeId = '';
            this._badgeAssetNameNormalScale = '';
            this._badgeAssetNameSmallScale = '';
            this._badgeVisibleInState = -1;

            return needsUpdate;
        }

        if ((badgeStatus === 1) && badgeId && (badgeId !== this._badgeId))
        {
            this._badgeId = badgeId;
            this._badgeAssetNameNormalScale = badgeId;
            this._badgeAssetNameSmallScale = `${badgeId}_32`;

            const visibleInState = this.object.model.getValue<number>(RoomObjectVariable.FURNITURE_BADGE_VISIBLE_IN_STATE);
            this._badgeVisibleInState = isNaN(visibleInState) ? -1 : visibleInState;

            this.addBadgeToAssetCollection(badgeId);

            const layerId = FurnitureBadgeDisplayVisualization.BADGE_LAYER_ID;
            this._assetNames[layerId] = undefined;
            this._updatedLayers[layerId] = undefined;
            this._spriteTags[layerId] = undefined;

            this.updateObjectCounter = -1;
            needsUpdate = true;
        }

        return needsUpdate;
    }

    protected getSpriteAssetName(scale: number, layerId: number): string
    {
        const tag = this.getLayerTag(scale, this.direction, layerId);

        if (tag !== FurnitureBadgeDisplayVisualization.BADGE_TAG)
        {
            return super.getSpriteAssetName(scale, layerId);
        }

        if ((this._badgeVisibleInState !== -1) && (this.object.getState(0) !== this._badgeVisibleInState))
        {
            return super.getSpriteAssetName(scale, layerId);
        }

        const assetName = (scale === 32) ? this._badgeAssetNameSmallScale : this._badgeAssetNameNormalScale;
        if (!assetName) return super.getSpriteAssetName(scale, layerId);

        const a = this.getAsset(assetName, layerId);
        if (!a || !a.texture) return super.getSpriteAssetName(scale, layerId);

        return assetName;
    }

    protected updateSprite(sprite: IRoomObjectSprite, asset: IGraphicAsset, scale: number, layerId: number): void
    {
        super.updateSprite(sprite, asset, scale, layerId);

        const tag = this.getLayerTag(scale, this.direction, layerId);

        if (tag === FurnitureBadgeDisplayVisualization.BADGE_TAG)
        {
            sprite.visible = true;
            sprite.alpha = 255;
            sprite.color = 0xFFFFFF;
        }
    }

    protected getLayerXOffset(scale: number, direction: number, layerId: number): number
    {
        let offset = super.getLayerXOffset(scale, direction, layerId);

        if (this.getLayerTag(scale, direction, layerId) === FurnitureBadgeDisplayVisualization.BADGE_TAG)
        {
            const assetName = (scale === 32) ? this._badgeAssetNameSmallScale : this._badgeAssetNameNormalScale;
            if (!assetName) return offset;

            const a = this.getAsset(assetName, layerId);
            if (!a) return offset;

            const targetW = (scale === 64) ? 40 : 20;
            offset += ((targetW - a.width) / 2);
        }

        return offset;
    }

    protected getLayerYOffset(scale: number, direction: number, layerId: number): number
    {
        let offset = super.getLayerYOffset(scale, direction, layerId);

        if (this.getLayerTag(scale, direction, layerId) === FurnitureBadgeDisplayVisualization.BADGE_TAG)
        {
            const assetName = (scale === 32) ? this._badgeAssetNameSmallScale : this._badgeAssetNameNormalScale;
            if (!assetName) return offset;

            const a = this.getAsset(assetName, layerId);
            if (!a) return offset;

            const targetH = (scale === 64) ? 40 : 20;
            offset += ((targetH - a.height) / 2);
        }

        return offset;
    }

    private addBadgeToAssetCollection(badgeId: string): void 
	{
		const sessionDataManager = GetSessionDataManager();

		let tex = sessionDataManager.getBadgeImage(badgeId);
		if (!tex) tex = sessionDataManager.getGroupBadgeImage(badgeId);

		if (!tex || !this.asset) return;

		const canvas = (tex.source as any).resource as HTMLCanvasElement;
		const ctx = canvas.getContext('2d');
		const imageData = ctx.getImageData(0, 0, 1, 1);
		const isEmpty = imageData.data[3] === 0;

		if (isEmpty) {
			const badgeUrl = GetConfiguration().getValue<string>('badge.asset.url', '').replace('%badgename%', badgeId);
        
			const img = new Image();
			img.crossOrigin = 'anonymous';
			img.onload = () => {
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
				tex.source.update();
			};
			img.src = badgeUrl;
		}

    this.asset.addAsset(badgeId, tex, true, 0, 0, false, false);
	}
}
