import { describe, expect, it } from 'vitest';
import { InventoryItemIdentity, InventorySnapshotCollector, formatInventoryDiagnostics } from './inventoryE2eSupport';

const item = (itemId: number): InventoryItemIdentity => ({
    itemId,
    ref: itemId,
    spriteId: 18,
    furniType: 'S',
    category: 1,
    extra: 1
});

describe('InventorySnapshotCollector', () =>
{
    it('completes a single-fragment inventory snapshot', () =>
    {
        const collector = new InventorySnapshotCollector();

        expect(collector.record({ totalFragments: 1, fragmentNumber: 0, items: [ item(900004) ] }))
            .toEqual([ item(900004) ]);
    });

    it('assembles fragments in fragment-number order', () =>
    {
        const collector = new InventorySnapshotCollector();

        expect(collector.record({ totalFragments: 2, fragmentNumber: 0, items: [ item(1) ] })).toBeNull();
        expect(collector.record({ totalFragments: 2, fragmentNumber: 1, items: [ item(2) ] }))
            .toEqual([ item(1), item(2) ]);
    });

    it('rejects duplicate item identities across fragments', () =>
    {
        const collector = new InventorySnapshotCollector();

        collector.record({ totalFragments: 2, fragmentNumber: 0, items: [ item(900004) ] });
        expect(() => collector.record({ totalFragments: 2, fragmentNumber: 1, items: [ item(900004) ] }))
            .toThrow('Duplicate inventory item id 900004');
    });
});

describe('formatInventoryDiagnostics', () =>
{
    it('prints the item id and ordered protocol timeline', () =>
    {
        expect(formatInventoryDiagnostics(900004, [ 'inventory:1', 'room-add:900004' ]))
            .toBe('item=900004 timeline=["inventory:1","room-add:900004"]');
    });
});
