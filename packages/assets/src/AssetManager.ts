import { IAssetData, IAssetManager, IGraphicAsset, IGraphicAssetCollection } from '@nitrots/api';
import { NitroBundle, NitroLogger } from '@nitrots/utils';
import { AnimatedGIF } from '@pixi/gif';
import { Assets, Spritesheet, SpritesheetData, Texture } from 'pixi.js';
import { GraphicAssetCollection } from './GraphicAssetCollection';


export class AssetManager implements IAssetManager
{
    private _textures: Map<string, Texture> = new Map();
    private _collections: Map<string, IGraphicAssetCollection> = new Map();

    public getTexture(name: string): Texture
    {
        if(!name) return null;

        return this._textures.get(name);
    }

    public setTexture(name: string, texture: Texture): void
    {
        if(!name || !texture) return;

        texture.label = name;

        this._textures.set(name, texture);
    }

    public getAsset(name: string): IGraphicAsset
    {
        if(!name) return null;

        for(const collection of this._collections.values())
        {
            if(!collection) continue;

            const existing = collection.getAsset(name);

            if(!existing) continue;

            return existing;
        }

        NitroLogger.warn(`AssetManager: Asset not found: ${name}`);

        return null;
    }

    public addAssetToCollection(collectionName: string, assetName: string, texture: Texture, override: boolean = true): boolean
    {
        const collection = this.getCollection(collectionName);

        if(!collection) return false;

        return collection.addAsset(assetName, texture, override, 0, 0, false, false);
    }

    public getCollection(name: string): IGraphicAssetCollection
    {
        if(!name) return null;

        return this._collections.get(name) ?? null;
    }

    public createCollection(data: IAssetData, spritesheet: Spritesheet): IGraphicAssetCollection
    {
        if(!data) return null;

        const collection = new GraphicAssetCollection(data, spritesheet);

        for(const [name, texture] of collection.textures.entries()) this.setTexture(name, texture);

        this._collections.set(collection.name, collection);

        return collection;
    }

    public async downloadAssets(urls: string[]): Promise<boolean>
    {
        if(!urls || !urls.length) return Promise.resolve(true);

        try
        {
            await Promise.all(urls.map(url => this.downloadAsset(url)));

            return true;
        }
        catch (err)
        {
            NitroLogger.error(err);
        }

        return false;
    }

    public async downloadAsset(url: string): Promise<boolean>
    {
        try
        {
            if(!url || !url.length) return false;

            if(url.startsWith('local://'))
            {
                const key = url.substring('local://'.length);

                switch(key)
                {
                    case 'room':
                        await this.loadLocalRoom();
                        return true;
                }

                return false;
            }

            if(url.endsWith('.nitro') || url.endsWith('.gif'))
            {
                const response = await fetch(url);

                if(!response || response.status !== 200) return false;

                const arrayBuffer = await response.arrayBuffer();

                if(url.endsWith('.nitro'))
                {
                    const nitroBundle = await NitroBundle.from(arrayBuffer);

                    await this.processAsset(nitroBundle.texture, nitroBundle.jsonFile as IAssetData);
                }
                else
                {
                    const animatedGif = AnimatedGIF.fromBuffer(arrayBuffer);
                    const texture = animatedGif.texture;

                    if(texture) this.setTexture(url, texture);
                }
            }
            else if(url.endsWith('.json'))
            {
                const response = await fetch(url);

                if(!response || response.status !== 200) return false;

                const data = await response.json() as IAssetData;
                let texture: Texture = null;
                const imagePath = data?.spritesheet?.meta?.image;
                const fallbackImagePath = ((data?.name && data.name.length > 0)
                    ? `${data.name}.png`
                    : url.replace(/\.json$/i, '.png'));
                const resolvedImageUrl = (imagePath
                    ? new URL(imagePath, url).toString()
                    : new URL(fallbackImagePath, url).toString());

                texture = await Assets.load<Texture>(resolvedImageUrl);

                await this.processAsset(texture, data);
            }
            else
            {
                const texture = await Assets.load<Texture>(url);

                if(texture) this.setTexture(url, texture);
            }

            return true;
        }
        catch (err)
        {
            NitroLogger.error(err);

            return false;
        }
    }

    private async loadLocalRoom(): Promise<void>
    {
        const roomDataModule = await import('./assets/room/room.asset.json');
        const roomData = (roomDataModule.default ?? roomDataModule) as IAssetData;
        const collection = this.createCollection(roomData, null) as GraphicAssetCollection;
        if(!collection) return;

        const roomImages = import.meta.glob('./assets/room/*.png', { eager: true });
        const roomImagesSub = import.meta.glob('./assets/room/images/*.png', { eager: true });
        const merged = { ...roomImages, ...roomImagesSub };

        for(const path in merged)
        {
            const mod = merged[path];
            const imageUrl = (mod.default ?? mod) as string;

            const file = path.split('/').pop()!;
            const rawName = file.replace(/\.png$/i, '');

            const texture = await Assets.load<Texture>(imageUrl);
            if(!texture) continue;

            this.setTexture(rawName, texture);

            collection.textures.set(rawName, texture);

            if(rawName.startsWith('room_'))
            {
                const normalizedName = rawName.substring('room_'.length);
                this.setTexture(normalizedName, texture);
                collection.textures.set(normalizedName, texture);
            }
        }

        collection.define(roomData);
    }

    private async processAsset(texture: Texture, data: IAssetData): Promise<IGraphicAssetCollection>
    {
        let spritesheet: Spritesheet<SpritesheetData> = null;

        if(texture && data?.spritesheet && Object.keys(data.spritesheet).length)
        {
            spritesheet = new Spritesheet(texture, data.spritesheet);

            await spritesheet.parse();

            spritesheet.textureSource.label = data.name ?? null;
        }

        return this.createCollection(data, spritesheet);
    }

    public get collections(): Map<string, IGraphicAssetCollection>
    {
        return this._collections;
    }
}
