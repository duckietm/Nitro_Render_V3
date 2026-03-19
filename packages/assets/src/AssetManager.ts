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

        await Promise.all(urls.map(url => this.downloadAsset(url)));

        return true;
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
                    case 'place_holder':
                    case 'place_holder_wall':
                    case 'place_holder_pet':
                    case 'tile_cursor':
                    case 'selection_arrow':
                    case 'avatar_additions':
                    case 'floor_editor':
                    case 'group_badge':
                        await this.loadLocalAsset(key);
                        return true;
                }

                return false;
            }

            if(url.endsWith('.nitro') || url.endsWith('.gif'))
            {
                let response: Response;

                try
                {
                    response = await fetch(url);
                }
                catch(fetchErr)
                {
                    throw new Error(`Could not fetch "${ url }" — is the URL correct and the server reachable? (${ fetchErr.message })`);
                }

                if(!response || response.status !== 200) throw new Error(`Failed to load "${ url }" — server returned HTTP ${ response?.status ?? 'no response' }`);

                const arrayBuffer = await response.arrayBuffer();

                if(url.endsWith('.nitro'))
                {
                    const nitroBundle = await NitroBundle.from(arrayBuffer);

                    await this.processAsset(nitroBundle.texture, nitroBundle.jsonFile as IAssetData);
                }
                else
                {
                    try
                    {
                        const animatedGif = AnimatedGIF.fromBuffer(arrayBuffer);
                        const texture = animatedGif.texture;

                        if(texture) this.setTexture(url, texture);
                    }
                    catch(gifErr)
                    {
                        const texture = await Assets.load<Texture>(url);

                        if(texture) this.setTexture(url, texture);
                    }
                }
            }
            else if(url.endsWith('.json'))
            {
                let response: Response;

                try
                {
                    response = await fetch(url);
                }
                catch(fetchErr)
                {
                    throw new Error(`Could not fetch "${ url }" — is the URL correct and the server reachable? (${ fetchErr.message })`);
                }

                if(!response || response.status !== 200) throw new Error(`Failed to load "${ url }" — server returned HTTP ${ response?.status ?? 'no response' }`);

                let data: IAssetData;

                try
                {
                    data = await response.json() as IAssetData;
                }
                catch(parseErr)
                {
                    throw new Error(`Invalid JSON in "${ url }" — the URL may be wrong and returning an HTML page instead of JSON (${ parseErr.message })`);
                }

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
            throw new Error(`Asset loading failed for "${ url }": ${ err.message || err }`);
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

    private async loadLocalAsset(name: string): Promise<void>
    {
        let dataModule: any;

        switch(name)
        {
            case 'place_holder':
                dataModule = await import('./assets/place_holder/place_holder.asset.json');
                break;
            case 'place_holder_wall':
                dataModule = await import('./assets/place_holder_wall/place_holder_wall.asset.json');
                break;
            case 'place_holder_pet':
                dataModule = await import('./assets/place_holder_pet/place_holder_pet.asset.json');
                break;
            case 'tile_cursor':
                dataModule = await import('./assets/tile_cursor/tile_cursor.asset.json');
                break;
            case 'selection_arrow':
                dataModule = await import('./assets/selection_arrow/selection_arrow.asset.json');
                break;
            case 'avatar_additions':
                dataModule = await import('./assets/avatar_additions/avatar_additions.asset.json');
                break;
            case 'floor_editor':
                dataModule = await import('./assets/floor_editor/floor_editor.asset.json');
                break;
            case 'group_badge':
                dataModule = await import('./assets/group_badge/group_badge.asset.json');
                break;
            default:
                return;
        }

        const data = (dataModule.default ?? dataModule) as IAssetData;
        const collection = this.createCollection(data, null) as GraphicAssetCollection;
        if(!collection) return;

        const allImages = import.meta.glob('./assets/*/images/*.png', { eager: true });
        const prefix = `./assets/${name}/images/`;

        for(const path in allImages)
        {
            if(!path.startsWith(prefix)) continue;

            const mod = allImages[path];
            const imageUrl = (mod.default ?? mod) as string;

            const file = path.split('/').pop()!;
            const rawName = file.replace(/\.png$/i, '');

            const texture = await Assets.load<Texture>(imageUrl);
            if(!texture) continue;

            this.setTexture(rawName, texture);

            collection.textures.set(name + '_' + rawName, texture);
            collection.textures.set(rawName, texture);
        }

        collection.define(data);
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
