import { IGraphicAsset } from '@nitrots/api';
import { GetRenderer, TextureUtils } from '@nitrots/utils';
import { Container, Graphics, Matrix, Sprite, Texture, RenderTexture } from 'pixi.js';
import { FurnitureAnimatedVisualization } from './FurnitureAnimatedVisualization';

export class IsometricImageFurniVisualization extends FurnitureAnimatedVisualization {
    protected static THUMBNAIL: string = 'THUMBNAIL';

    private _thumbnailAssetNameNormal: string;
    private _thumbnailImageNormal: Texture;
    private _thumbnailDirection: number;
    private _thumbnailChanged: boolean;
    private _uniqueId: string;
    private _photoUrl: string;
    protected _hasOutline: boolean;

    constructor() {
        super();

        this._thumbnailAssetNameNormal = null;
        this._thumbnailImageNormal = null;
        this._thumbnailDirection = -1;
        this._thumbnailChanged = false;
        this._uniqueId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        this._photoUrl = null;
    }

    public get hasThumbnailImage(): boolean {
        return !(this._thumbnailImageNormal == null);
    }

    public setThumbnailImages(k: Texture, url?: string): void {
        this._thumbnailImageNormal = k;
        this._photoUrl = url || null;
        this._thumbnailChanged = true;
    }

    public getPhotoUrl(): string {
        return this._photoUrl;
    }

    protected updateModel(scale: number): boolean {
        const flag = super.updateModel(scale);

        if (!this._thumbnailChanged && (this._thumbnailDirection === this.direction)) {
            return flag;
        }

        this.refreshThumbnail();

        return true;
    }

    private refreshThumbnail(): void {
        if (this.asset == null) {
            return;
        }

        const thumbnailAssetName = this.getThumbnailAssetName(64);

        if (this._thumbnailImageNormal) {
            this.addThumbnailAsset(this._thumbnailImageNormal, 64);
        } else {
            const layerId = 2;
            const sprite = this.getSprite(layerId);
        }

        this._thumbnailChanged = false;
        this._thumbnailDirection = this.direction;
    }

    private addThumbnailAsset(k: Texture, scale: number): void {
        let layerId = 0;

        while (layerId < this.totalSprites) {
            const layerTag = this.getLayerTag(scale, this.direction, layerId);

            if (layerTag === IsometricImageFurniVisualization.THUMBNAIL) {
                const assetName = (this.cacheSpriteAssetName(scale, layerId, false) + this.getFrameNumber(scale, layerId));
                const asset = this.getAsset(assetName, layerId);
                const thumbnailAssetName = `${this.getThumbnailAssetName(scale)}-${this._uniqueId}`;
                const transformedTexture = this.generateTransformedThumbnail(k, asset || { width: 64, height: 64 });
                const sprite = new Sprite(transformedTexture);
                const bounds = sprite.getLocalBounds();
                const offsetX = -Math.floor(bounds.width / 2);
                const offsetY = -Math.floor(bounds.height / 2);

                this.asset.addAsset(thumbnailAssetName, transformedTexture, true, offsetX, offsetY, false, false);

                const placedSprite = this.getSprite(layerId);
                if (placedSprite) {
                    placedSprite.texture = transformedTexture;
                }

                return;
            }

            layerId++;
        }
    }

    protected generateTransformedThumbnail(texture: Texture, asset: IGraphicAsset): Texture {
        const scaleFactor = (asset?.width || 64) / texture.width;
        const verticalScale = 1.0265;
        const matrix = new Matrix();
        const frameThickness = 20;
        const frameColor = 0x000000;

        switch (this.direction) {
            case 2:
                matrix.a = scaleFactor;
                matrix.b = (-0.5 * scaleFactor);
                matrix.c = 0;
                matrix.d = (scaleFactor * verticalScale);
                matrix.tx = 0;
                matrix.ty = (0.5 * scaleFactor * texture.width);
                break;
            case 0:
            case 4:
                matrix.a = scaleFactor;
                matrix.b = (0.5 * scaleFactor);
                matrix.c = 0;
                matrix.d = (scaleFactor * verticalScale);
                matrix.tx = 0;
                matrix.ty = 0;
                break;
            default:
                matrix.a = scaleFactor;
                matrix.b = 0;
                matrix.c = 0;
                matrix.d = scaleFactor;
                matrix.tx = 0;
                matrix.ty = 0;
        }

        const imgWidth = texture.width;
        const imgHeight = texture.height;
        const flatWidth = imgWidth + frameThickness * 2;
        const flatHeight = imgHeight + frameThickness * 2;
        const flatRenderTexture = TextureUtils.createAndFillRenderTexture(flatWidth, flatHeight, frameColor);
        const imageSprite = new Sprite(texture);
        imageSprite.position.set(frameThickness, frameThickness);
        TextureUtils.writeToTexture(imageSprite, flatRenderTexture, false);
        const flatTexture = flatRenderTexture;
        const transformedSprite = new Sprite(flatTexture);
        transformedSprite.setFromMatrix(matrix);
        const width = 80;
        const height = 80;
        const finalContainer = new Container();
        const posX = (width - transformedSprite.width) / 2;
        const posY = (height - transformedSprite.height) / 2;
        transformedSprite.position.set(posX, posY);
        finalContainer.addChild(transformedSprite);

        const renderTexture = RenderTexture.create({ width, height, resolution: 1 });
        GetRenderer().render({ container: finalContainer, target: renderTexture, clear: true });

        return renderTexture;
    }

    protected getSpriteAssetName(scale: number, layerId: number): string {
        if (this._thumbnailImageNormal && (this.getLayerTag(scale, this.direction, layerId) === IsometricImageFurniVisualization.THUMBNAIL)) {
            return `${this.getThumbnailAssetName(scale)}-${this._uniqueId}`;
        }

        return super.getSpriteAssetName(scale, layerId);
    }

    protected getThumbnailAssetName(scale: number): string {
        return this.cacheSpriteAssetName(scale, 2, false) + this.getFrameNumber(scale, 2);
    }

    protected getFullThumbnailAssetName(k: number, _arg_2: number): string {
        return [this._type, k, 'thumb', _arg_2].join('_');
    }
}