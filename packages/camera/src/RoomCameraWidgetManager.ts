import { IRoomCameraWidgetEffect, IRoomCameraWidgetManager, IRoomCameraWidgetSelectedEffect } from '@nitrots/api';
import { GetAssetManager } from '@nitrots/assets';
import { GetConfiguration } from '@nitrots/configuration';
import { GetEventDispatcher, RoomCameraWidgetManagerEvent } from '@nitrots/events';
import { TextureUtils } from '@nitrots/utils';
import { BLEND_MODES, ColorMatrix, ColorMatrixFilter, Container, Filter, RenderTexture, Sprite, Texture } from 'pixi.js';
import { RoomCameraWidgetEffect } from './RoomCameraWidgetEffect';

const COLOR_MATRIX_OFFSET_INDICES = [4, 9, 14, 19] as const;

export const normalizeCameraColorMatrix = (matrix: ColorMatrix): ColorMatrix =>
{
    const normalized = [ ...matrix ] as ColorMatrix;

    for(const index of COLOR_MATRIX_OFFSET_INDICES)
    {
        if(Math.abs(normalized[index]) > 1) normalized[index] /= 255;
    }

    for(const [ rowStart, offsetIndex ] of [[0, 4], [5, 9], [10, 14]] as const)
    {
        const rowHasOnlyNegativeWeights =
            (normalized[rowStart] <= 0) &&
            (normalized[rowStart + 1] <= 0) &&
            (normalized[rowStart + 2] <= 0) &&
            ((normalized[rowStart] !== 0) || (normalized[rowStart + 1] !== 0) || (normalized[rowStart + 2] !== 0));

        if((normalized[offsetIndex] === 0) && rowHasOnlyNegativeWeights) normalized[offsetIndex] = 1;
    }

    return normalized;
};

export class RoomCameraWidgetManager implements IRoomCameraWidgetManager
{
    private _effects: Map<string, IRoomCameraWidgetEffect> = new Map();
    private _isLoaded: boolean = false;

    public async init(): Promise<void>
    {
        if(this._isLoaded) return;

        this._isLoaded = true;

        const imagesUrl = GetConfiguration().getValue<string>('image.library.url') + 'Habbo-Stories/';
        const effects = GetConfiguration().getValue<{ name: string, colorMatrix?: ColorMatrix, minLevel: number, blendMode?: BLEND_MODES, enabled: boolean }[]>('camera.available.effects');

        for(const effect of effects)
        {
            if(!effect.enabled) continue;

            const cameraEffect = new RoomCameraWidgetEffect(effect.name, effect.minLevel);

            if(effect.colorMatrix?.length)
            {
                cameraEffect.colorMatrix = normalizeCameraColorMatrix(effect.colorMatrix);
            }
            else
            {
                const url = `${ imagesUrl }${ effect.name }.png`;

                await GetAssetManager().downloadAsset(url);

                cameraEffect.texture = GetAssetManager().getTexture(url);
                cameraEffect.blendMode = effect.blendMode;
            }

            this._effects.set(cameraEffect.name, cameraEffect);
        }

        GetEventDispatcher().dispatchEvent(new RoomCameraWidgetManagerEvent(RoomCameraWidgetManagerEvent.INITIALIZED));
    }

    public async applyEffects(texture: Texture, effects: IRoomCameraWidgetSelectedEffect[], isZoomed: boolean): Promise<HTMLImageElement>
    {
        const container = new Container();
        const sprite = new Sprite(texture);

        container.addChild(sprite);

        if(isZoomed) sprite.scale.set(2);

        const filters: Filter[] = [];

        const identityMatrix: ColorMatrix = [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0];

        for(const selectedEffect of effects)
        {
            const effect = selectedEffect.effect;

            if(!effect) continue;

            if(effect.colorMatrix)
            {
                const filter = new ColorMatrixFilter();
                const strength = selectedEffect.strength;

                filter.matrix = effect.colorMatrix.map((val, i) => identityMatrix[i] + (val - identityMatrix[i]) * strength) as ColorMatrix;

                filters.push(filter);
            }
            else
            {
                const effectSprite = new Sprite(effect.texture);

                effectSprite.alpha = selectedEffect.strength;
                effectSprite.blendMode = effect.blendMode;

                container.addChild(effectSprite);
            }
        }

        container.filters = filters;

        const resolution = texture.source.resolution || 1;
        const renderTexture = RenderTexture.create({ width: texture.width, height: texture.height, resolution });

        TextureUtils.writeToTexture(container, renderTexture);

        return await TextureUtils.generateImage(renderTexture);
    }

    public get effects(): Map<string, IRoomCameraWidgetEffect>
    {
        return this._effects;
    }

    public get isLoaded(): boolean
    {
        return this._isLoaded;
    }
}
