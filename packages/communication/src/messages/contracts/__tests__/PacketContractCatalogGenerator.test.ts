import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { PacketContractCatalogGenerator } from '../PacketContractCatalogGenerator';

describe('packet contract catalog generator', () =>
{
    it('extracts the complete TypeScript packet inventory', () =>
    {
        const generator = new PacketContractCatalogGenerator(resolve('.'));
        const inventory = generator.typescriptInventory();

        expect(inventory.length).toBeGreaterThan(900);
        expect(inventory.some(packet => packet.header === 412)).toBe(true);
        expect(inventory.some(packet => packet.fields.length > 0)).toBe(true);
        expect(inventory.some(packet => packet.unsupportedReason)).toBe(true);

        const destination = process.env.PACKET_CONTRACT_TYPESCRIPT_INVENTORY;
        if(destination) generator.writeTypeScriptInventory(destination);
    });
});
