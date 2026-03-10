import { IGraphicAsset, IRoomObjectSprite, RoomObjectVariable } from '@nitrots/api';
import { TextureUtils } from '@nitrots/utils';
import { Matrix, Sprite, Texture } from 'pixi.js';
import { IsometricImageFurniVisualization } from './IsometricImageFurniVisualization';

export class FurnitureGuildIsometricBadgeVisualization extends IsometricImageFurniVisualization
{
    public static PRIMARY_COLOUR_SPRITE_TAG: string = 'COLOR1';
    public static SECONDARY_COLOUR_SPRITE_TAG: string = 'COLOR2';
    public static DEFAULT_COLOR_1: number = 0xEEEEEE;
    public static DEFAULT_COLOR_2: number = 0x4B4B4B;

    private _color1: number;
    private _color2: number;
    private _cachedAssetName: string;

    constructor()
    {
        super();

        this._cachedAssetName = null;
    }

    protected updateModel(scale: number): boolean
    {
        const flag = super.updateModel(scale);

        const assetName = this.object.model.getValue<string>(RoomObjectVariable.FURNITURE_GUILD_CUSTOMIZED_ASSET_NAME);

        if(assetName && assetName.length && assetName !== this._cachedAssetName)
        {
            const texture = this.getBitmapAsset(assetName);

            if(texture)
            {
                this._cachedAssetName = assetName;
                this.setThumbnailImages(texture);
            }
        }

        const color1 = this.object.model.getValue<number>(RoomObjectVariable.FURNITURE_GUILD_CUSTOMIZED_COLOR_1);

        this._color1 = color1 ? color1 : FurnitureGuildIsometricBadgeVisualization.DEFAULT_COLOR_1;

        const color2 = this.object.model.getValue<number>(RoomObjectVariable.FURNITURE_GUILD_CUSTOMIZED_COLOR_2);

        this._color2 = color2 ? color2 : FurnitureGuildIsometricBadgeVisualization.DEFAULT_COLOR_2;

        return flag;
    }

    protected generateTransformedThumbnail(texture: Texture, asset: IGraphicAsset): Texture
    {
        // Render into a texture exactly matching the asset slot (e.g. 40×58 for guild_forum layer i).
        // dScale is derived so the sheared content fills the slot top-to-bottom without overflow:
        //   shear contribution = 0.5 * renderWidth,  vertical fill = dScale * texture.height
        //   => dScale = (renderHeight - 0.5 * renderWidth) / texture.height
        const renderWidth = asset.width || 64;
        const renderHeight = asset.height || renderWidth;
        const difference = (renderWidth / texture.width);
        const dScale = (renderHeight - 0.5 * renderWidth) / texture.height;
        const matrix = new Matrix();

        switch(this.direction)
        {
            case 2:
                matrix.a = difference;
                matrix.b = (-0.5 * difference);
                matrix.c = 0;
                matrix.d = dScale;
                matrix.tx = 0;
                matrix.ty = (0.5 * renderWidth);
                break;
            case 0:
            case 4:
                matrix.a = difference;
                matrix.b = (0.5 * difference);
                matrix.c = 0;
                matrix.d = dScale;
                matrix.tx = 0;
                matrix.ty = 0;
                break;
            default:
                matrix.a = difference;
                matrix.b = 0;
                matrix.c = 0;
                matrix.d = difference;
                matrix.tx = 0;
                matrix.ty = 0;
        }

        // Pass the matrix directly as a render transform — preserves full skew/shear in Pixi.js v8.
        return TextureUtils.createAndWriteRenderTexture(renderWidth, renderHeight, new Sprite(texture), matrix);
    }

    protected getLayerColor(scale: number, layerId: number, colorId: number): number
    {
        const tag = this.getLayerTag(scale, this._direction, layerId);

        switch(tag)
        {
            case FurnitureGuildIsometricBadgeVisualization.PRIMARY_COLOUR_SPRITE_TAG: return this._color1;
            case FurnitureGuildIsometricBadgeVisualization.SECONDARY_COLOUR_SPRITE_TAG: return this._color2;
        }

        return super.getLayerColor(scale, layerId, colorId);
    }

    protected getLibraryAssetNameForSprite(asset: IGraphicAsset, sprite: IRoomObjectSprite): string
    {
        if(sprite.tag === FurnitureGuildIsometricBadgeVisualization.THUMBNAIL)
        {
            if(this.object && this.object.model.getValue<string>(RoomObjectVariable.FURNITURE_GUILD_CUSTOMIZED_ASSET_NAME))
            {
                return '%group.badge.url%' + this.object.model.getValue<string>(RoomObjectVariable.FURNITURE_GUILD_CUSTOMIZED_ASSET_NAME);
            }
        }

        return super.getLibraryAssetNameForSprite(asset, sprite);
    }

    private getBitmapAsset(name: string)
    {
        const asset = this.asset.getAsset(name);

        if(!asset || !asset.texture) return null;

        return asset.texture;
    }
}
