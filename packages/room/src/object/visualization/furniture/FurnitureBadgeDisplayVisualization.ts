import { IGraphicAsset, IRoomObjectSprite, RoomObjectVariable } from '@nitrots/api';
import { GetConfiguration } from '@nitrots/configuration';
import { GetSessionDataManager } from '@nitrots/session';
import { Texture } from 'pixi.js';
import { parseGIF, decompressFrames } from 'gifuct-js';
import { FurnitureAnimatedVisualization } from './FurnitureAnimatedVisualization';

export class FurnitureBadgeDisplayVisualization extends FurnitureAnimatedVisualization
{
    private static readonly BADGE_TAG = 'BADGE';
    private static readonly BADGE_LAYER_ID = 1;

    private _badgeId = '';
    private _badgeAssetNameNormalScale = '';
    private _badgeAssetNameSmallScale = '';
    private _badgeVisibleInState = -1;
    private _gifFrames: ImageData[] = null;
    private _frameDelays: number[] = null;
    private _currentFrame = 0;
    private _lastFrameTime = 0;

    public getTexture(scale: number, layerId: number, asset: IGraphicAsset): Texture
    {
        return super.getTexture(scale, layerId, asset);
    }

    public update(geometry: any, time: number, update: boolean, skipUpdate: boolean): void
    {
        super.update(geometry, time, update, skipUpdate);

        // Update animated GIF
        if(this._gifFrames && this._gifFrames.length > 1)
        {
            const sessionDataManager = GetSessionDataManager();
            let tex = sessionDataManager.getBadgeImage(this._badgeId);
            if (!tex) tex = sessionDataManager.getGroupBadgeImage(this._badgeId);
            
            if(!tex)
            {
                console.warn('⚠️ No texture found for badge:', this._badgeId);
                return;
            }
            
            const badgeCanvas = (tex.source as any).resource as HTMLCanvasElement;
            
            const now = performance.now();
            const elapsed = now - this._lastFrameTime;
            
            const frameDelay = (this._frameDelays[this._currentFrame] || 10) * 10;
            
            if(elapsed >= frameDelay)
            {
                this._lastFrameTime = now;
                const oldFrame = this._currentFrame;
                this._currentFrame = (this._currentFrame + 1) % this._gifFrames.length;
                
                const ctx = badgeCanvas.getContext('2d', { willReadFrequently: true });
                const frame = this._gifFrames[this._currentFrame];
                
                if(frame)
                {
                    ctx.putImageData(frame, 0, 0);
                    tex.source.update();
                    
                    const assetName = this._badgeAssetNameNormalScale;
                    if(this.asset && assetName)
                    {
                        const asset = this.getAsset(assetName, FurnitureBadgeDisplayVisualization.BADGE_LAYER_ID);
                        if(asset && asset.texture)
                        {
                            asset.texture.source.update();
                        }
                    }
                }
            }
        }
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
            this._gifFrames = null;
            this._frameDelays = null;

            return needsUpdate;
        }

        if ((badgeStatus === 1) && badgeId && (badgeId !== this._badgeId))
        {
            this._badgeId = badgeId;
            this._badgeAssetNameNormalScale = badgeId;
            this._badgeAssetNameSmallScale = `${badgeId}_32`;

            const visibleInState = this.object.model.getValue<number>(RoomObjectVariable.FURNITURE_BADGE_VISIBLE_IN_STATE);
            this._badgeVisibleInState = isNaN(visibleInState) ? -1 : visibleInState;

            this._gifFrames = null;
            this._frameDelays = null;
            this._currentFrame = 0;
            this._lastFrameTime = 0;

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

    private async addBadgeToAssetCollection(badgeId: string): Promise<void>
    {
        const sessionDataManager = GetSessionDataManager();

        let tex = sessionDataManager.getBadgeImage(badgeId);
        if (!tex) tex = sessionDataManager.getGroupBadgeImage(badgeId);

        if (!tex || !this.asset) return;

        const badgeCanvas = (tex.source as any).resource as HTMLCanvasElement;
        const ctx = badgeCanvas.getContext('2d', { willReadFrequently: true });
        const imageData = ctx.getImageData(0, 0, 1, 1);
        const isEmpty = imageData.data[3] === 0;

        if (isEmpty || !this._gifFrames)
        {
            const badgeUrl = GetConfiguration().getValue<string>('badge.asset.url', '').replace('%badgename%', badgeId);
            
            try
            {
                const response = await fetch(badgeUrl);
                const arrayBuffer = await response.arrayBuffer();
                const gif = parseGIF(arrayBuffer);
                const frames = decompressFrames(gif, true);
                
                if(frames && frames.length > 0)
                {
                    this._gifFrames = [];
                    this._frameDelays = [];
                    
                    const accCanvas = document.createElement('canvas');
                    accCanvas.width = gif.lsd.width;
                    accCanvas.height = gif.lsd.height;
                    const accCtx = accCanvas.getContext('2d', { willReadFrequently: true });
                    
                    for(let i = 0; i < frames.length; i++)
                    {
                        const frame = frames[i];

                        if(i > 0)
                        {
                            const prevDisposal = frames[i - 1].disposalType;
                            if(prevDisposal === 2)
                            {
                                accCtx.clearRect(0, 0, gif.lsd.width, gif.lsd.height);
                            }
                        }
                        
                        const tempCanvas = document.createElement('canvas');
                        tempCanvas.width = frame.dims.width;
                        tempCanvas.height = frame.dims.height;
                        const tempCtx = tempCanvas.getContext('2d');
                        
                        const patchData = new ImageData(
                            new Uint8ClampedArray(frame.patch),
                            frame.dims.width,
                            frame.dims.height
                        );
                        tempCtx.putImageData(patchData, 0, 0);
                        
                        accCtx.drawImage(tempCanvas, frame.dims.left, frame.dims.top);
                        
                        const fullFrame = accCtx.getImageData(0, 0, gif.lsd.width, gif.lsd.height);
                        this._gifFrames.push(fullFrame);
                        this._frameDelays.push(frame.delay || 10);
                    }
                    
                    this._currentFrame = 0;
                    this._lastFrameTime = performance.now();
                    
                    const avgDelay = this._frameDelays.reduce((a, b) => a + b, 0) / this._frameDelays.length;
                    if(avgDelay > 50)
                    {
                        this._frameDelays = this._frameDelays.map(() => 10);
                    }
                    
                    ctx.putImageData(this._gifFrames[0], 0, 0);
                    tex.source.update();
                }
            }
            catch(err)
            {
                console.error('Failed to parse GIF, using static image:', err);
                
                const img = new Image();
                img.crossOrigin = 'anonymous';
                img.onload = () =>
                {
                    ctx.clearRect(0, 0, badgeCanvas.width, badgeCanvas.height);
                    ctx.drawImage(img, 0, 0, badgeCanvas.width, badgeCanvas.height);
                    tex.source.update();
                };
                img.src = badgeUrl;
            }
        }

        this.asset.addAsset(badgeId, tex, true, 0, 0, false, false);
    }
}