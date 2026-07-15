import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { loadPacketContractManifest } from '../PacketContractManifest';
import { TypeScriptPacketRegistry } from '../TypeScriptPacketRegistry';

const key = (direction: string, header: number) => `${ direction }:${ header }`;

describe('packet contract coverage', () =>
{
    it('classifies every active renderer header exactly once', () =>
    {
        const manifest = loadPacketContractManifest('protocol/packet-field-contracts.json');
        const registry = TypeScriptPacketRegistry.discover(resolve('packages/communication/src'));
        const classified = new Set([
            ...manifest.contracts.map(entry => key(entry.direction, entry.header)),
            ...manifest.exemptions.map(entry => key(entry.direction, entry.header)),
            ...manifest.unpaired.map(entry => key(entry.direction, entry.header))
        ]);
        const missing = registry.active
            .map(packet => key(packet.direction, packet.header))
            .filter(packetKey => !classified.has(packetKey));

        expect(missing, `unclassified renderer headers: ${ missing.join(', ') }`).toEqual([]);
    });

    it('references only existing renderer sources', () =>
    {
        const manifest = loadPacketContractManifest('protocol/packet-field-contracts.json');
        const paths = [
            ...manifest.contracts.map(entry => entry.typescript.path),
            ...manifest.exemptions.map(entry => entry.typescript.path),
            ...manifest.unpaired.filter(entry => entry.side === 'typescript').map(entry => entry.path)
        ];

        expect(paths.filter(path => !existsSync(resolve(path)))).toEqual([]);
    });
});
