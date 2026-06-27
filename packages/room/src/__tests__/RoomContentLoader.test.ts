import { FurnitureType, RoomObjectCategory } from '@nitrots/api';
import { describe, expect, it } from 'vitest';
import { RoomContentLoader } from '../RoomContentLoader';

describe('RoomContentLoader', () => {
    it('categorizes indexed-color wall item object names as wall furni', () => {
        const loader = new RoomContentLoader();

        loader.processFurnitureData([
            {
                type: FurnitureType.WALL,
                id: 7,
                className: 'wall_flag*2',
                revision: 1
            } as any
        ]);

        expect(loader.getFurnitureWallNameForTypeId(7)).toBe('wall_flag');
        expect(loader.getCategoryForType('wall_flag')).toBe(RoomObjectCategory.WALL);
    });
});
