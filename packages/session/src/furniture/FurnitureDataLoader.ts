import { FurnitureType, IFurnitureData } from '@nitrots/api';
import { GetConfiguration } from '@nitrots/configuration';
import { GetLocalizationManager } from '@nitrots/localization';
import { FurnitureData } from './FurnitureData';

export class FurnitureDataLoader
{
    private _floorItems: Map<number, IFurnitureData>;
    private _wallItems: Map<number, IFurnitureData>;

    constructor(floorItems: Map<number, IFurnitureData>, wallItems: Map<number, IFurnitureData>)
    {
        this._floorItems = floorItems;
        this._wallItems = wallItems;
    }

    public async init(): Promise<void>
    {
        const url = GetConfiguration().getValue<string>('furnidata.url');

        if(!url || !url.length) throw new Error('Missing "furnidata.url" in config — add the furniture data URL to your renderer-config.json');

        let response: Response;

        try
        {
            response = await fetch(url);
        }
        catch(fetchErr)
        {
            throw new Error(`Could not fetch furniture data from "${ url }" — check "furnidata.url" in renderer-config.json (${ fetchErr.message })`);
        }

        if(response.status !== 200) throw new Error(`Failed to load furniture data from "${ url }" — server returned HTTP ${ response.status }. Check "furnidata.url" in renderer-config.json`);

        let responseData: any;

        try
        {
            responseData = await response.json();
        }
        catch(parseErr)
        {
            throw new Error(`Invalid JSON in furniture data "${ url }" — the URL may be wrong. Check "furnidata.url" in renderer-config.json (${ parseErr.message })`);
        }

        if(responseData.roomitemtypes) this.parseFloorItems(responseData.roomitemtypes);

        if(responseData.wallitemtypes) this.parseWallItems(responseData.wallitemtypes);
    }

    private parseFloorItems(data: any): void
    {
        if(!data || !data.furnitype) return;

        for(const furniture of data.furnitype)
        {
            if(!furniture) continue;

            const colors: number[] = [];

            if(furniture.partcolors)
            {
                for(const color of furniture.partcolors.color)
                {
                    let colorCode = (color as string);

                    if(colorCode.charAt(0) === '#')
                    {
                        colorCode = colorCode.replace('#', '');

                        colors.push(parseInt(colorCode, 16));
                    }
                    else
                    {
                        colors.push((parseInt(colorCode, 16)));
                    }
                }
            }

            const classSplit = (furniture.classname as string).split('*');
            const className = classSplit[0];
            const colorIndex = ((classSplit.length > 1) ? parseInt(classSplit[1]) : 0);
            const hasColorIndex = (classSplit.length > 1);

            const furnitureData = new FurnitureData(FurnitureType.FLOOR, furniture.id, furniture.classname, className, furniture.category, furniture.name, furniture.description, furniture.revision, furniture.xdim, furniture.ydim, 0, colors, hasColorIndex, colorIndex, furniture.adurl, furniture.offerid, furniture.buyout, furniture.rentofferid, furniture.rentbuyout, furniture.bc, furniture.customparams, furniture.specialtype, furniture.canstandon, furniture.cansiton, furniture.canlayon, furniture.excludeddynamic, furniture.furniline, furniture.environment, furniture.rare);

            this._floorItems.set(furnitureData.id, furnitureData);

            this.updateLocalizations(furnitureData);
        }
    }

    private parseWallItems(data: any): void
    {
        if(!data || !data.furnitype) return;

        for(const furniture of data.furnitype)
        {
            if(!furniture) continue;

            const furnitureData = new FurnitureData(FurnitureType.WALL, furniture.id, furniture.classname, furniture.classname, furniture.category, furniture.name, furniture.description, furniture.revision, 0, 0, 0, null, false, 0, furniture.adurl, furniture.offerid, furniture.buyout, furniture.rentofferid, furniture.rentbuyout, furniture.bc, null, furniture.specialtype, false, false, false, furniture.excludeddynamic, furniture.furniline, furniture.environment, furniture.rare);

            this._wallItems.set(furnitureData.id, furnitureData);

            this.updateLocalizations(furnitureData);
        }
    }

    private updateLocalizations(furniture: FurnitureData): void
    {
        switch(furniture.type)
        {
            case FurnitureType.FLOOR:
                GetLocalizationManager().setValue(('roomItem.name.' + furniture.id), furniture.name);
                GetLocalizationManager().setValue(('roomItem.desc.' + furniture.id), furniture.description);
                return;
            case FurnitureType.WALL:
                GetLocalizationManager().setValue(('wallItem.name.' + furniture.id), furniture.name);
                GetLocalizationManager().setValue(('wallItem.desc.' + furniture.id), furniture.description);
                return;
        }
    }
}
