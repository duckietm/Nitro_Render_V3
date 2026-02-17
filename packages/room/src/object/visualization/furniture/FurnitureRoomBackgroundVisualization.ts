import { Texture } from 'pixi.js';
import { DirectionalOffsetData } from '../data';
import { FurnitureBrandedImageVisualization } from './FurnitureBrandedImageVisualization';

export class FurnitureRoomBackgroundVisualization extends FurnitureBrandedImageVisualization
{
    private static readonly BRANDED_IMAGE_LAYER_DEPTH_BIAS: number = 0.01;

    private _imageOffset: DirectionalOffsetData;
    protected imageReady(texture: Texture, imageUrl: string): void
    {
        super.imageReady(texture, imageUrl);

        if(!texture) return;

        this.setImageOffset(texture.width, texture.height);
    }

    private setImageOffset(width: number, height: number): void
    {
        const offsetData = new DirectionalOffsetData();

        offsetData.setDirection(1, 0, -height);
        offsetData.setDirection(3, 0, 0);
        offsetData.setDirection(5, -width, 0);
        offsetData.setDirection(7, -width, -height);
        offsetData.setDirection(4, (-width / 2), (-height / 2));

        this._imageOffset = offsetData;
    }

    protected getLayerXOffset(scale: number, direction: number, layerId: number): number
    {
        if(this._imageOffset)
        {
            const offset = this._imageOffset.getXOffset(direction, 0);

            if(offset !== undefined) return offset + this._offsetX;
        }

        return super.getLayerXOffset(scale, direction, layerId) + this._offsetX;
    }

    protected getLayerYOffset(scale: number, direction: number, layerId: number): number
    {
        if(this._imageOffset)
        {
            const offset = this._imageOffset.getYOffset(direction, 0);

            if(offset !== undefined) return offset + this._offsetY;
        }

        return super.getLayerYOffset(scale, direction, layerId) + this._offsetY;
    }


    protected getLayerAlpha(scale: number, direction: number, layerId: number): number
    {
        let alpha = super.getLayerAlpha(scale, direction, layerId);

        if(this.shouldSuppressInkLayer(scale, direction, layerId)) alpha = 0;

        return alpha;
    }

    private shouldSuppressInkLayer(scale: number, direction: number, layerId: number): boolean
    {
        if(this.getLayerTag(scale, direction, layerId) === FurnitureBrandedImageVisualization.BRANDED_IMAGE) return false;

        return (this.getLayerBlendMode(scale, direction, layerId) !== 'normal');
    }

    protected getLayerZOffset(scale: number, direction: number, layerId: number): number
    {
        let zOffset = (super.getLayerZOffset(scale, direction, layerId) + (-(this._offsetZ)));

        if(this.getLayerTag(scale, direction, layerId) === FurnitureBrandedImageVisualization.BRANDED_IMAGE)
        {
            zOffset += FurnitureRoomBackgroundVisualization.BRANDED_IMAGE_LAYER_DEPTH_BIAS;
        }

        return zOffset;
    }

    protected getLayerIgnoreMouse(scale: number, direction: number, layerId: number): boolean
    {
        return true;
    }
}
