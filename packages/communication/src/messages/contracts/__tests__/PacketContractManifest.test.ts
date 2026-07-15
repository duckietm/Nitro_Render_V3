import { describe, expect, it } from 'vitest';
import { loadPacketContractManifest, parsePacketContractManifest } from '../PacketContractManifest';

const validManifest = () => ({
    schemaVersion: 1,
    contracts: [{
        name: 'SEND_FIXTURE',
        direction: 'client_to_server',
        header: 100,
        java: { symbol: 'SendFixtureEvent', className: 'SendFixtureEvent', path: 'src/SendFixtureEvent.java' },
        typescript: { symbol: 'SEND_FIXTURE', className: 'SendFixtureComposer', path: 'src/SendFixtureComposer.ts' },
        fields: [
            { kind: 'scalar', type: 'int', name: 'id' },
            { kind: 'list', countType: 'short', item: [{ kind: 'scalar', type: 'string', name: 'label' }] },
            { kind: 'optional', controller: 'enabled', fields: [{ kind: 'scalar', type: 'boolean', name: 'enabled' }] },
            { kind: 'variant', discriminator: 'kind', branches: { '1': [{ kind: 'scalar', type: 'long', name: 'value' }] } }
        ]
    }],
    unpaired: [],
    exemptions: []
});

describe('packet contract manifest', () =>
{
    it('loads the repository manifest from disk', () =>
    {
        expect(loadPacketContractManifest('protocol/packet-field-contracts.json').schemaVersion).toBe(1);
    });

    it('loads and deeply freezes valid structured schemas', () =>
    {
        const manifest = parsePacketContractManifest(validManifest());

        expect(manifest.contracts[0].fields).toHaveLength(4);
        expect(Object.isFrozen(manifest)).toBe(true);
        expect(Object.isFrozen(manifest.contracts)).toBe(true);
        expect(Object.isFrozen(manifest.contracts[0].fields)).toBe(true);
        expect(Object.isFrozen(manifest.contracts[0].fields[3])).toBe(true);
    });

    it('rejects unsupported schema versions', () =>
    {
        const input = validManifest();
        input.schemaVersion = 2;

        expect(() => parsePacketContractManifest(input)).toThrow('schemaVersion 1');
    });

    it('rejects duplicate direction and header classifications', () =>
    {
        const input = validManifest();
        input.unpaired.push({
            direction: 'client_to_server',
            side: 'java',
            header: 100,
            symbol: 'DuplicateEvent',
            path: 'src/DuplicateEvent.java',
            reason: 'This packet exists only in the emulator implementation'
        } as never);

        expect(() => parsePacketContractManifest(input)).toThrow('classified more than once');
    });

    it('rejects unknown scalar types and invalid directions', () =>
    {
        const scalar = validManifest();
        scalar.contracts[0].fields = [{ kind: 'scalar', type: 'float', name: 'value' }] as never;
        expect(() => parsePacketContractManifest(scalar)).toThrow('unknown scalar type');

        const direction = validManifest();
        direction.contracts[0].direction = 'sideways';
        expect(() => parsePacketContractManifest(direction)).toThrow('invalid direction');
    });

    it('requires concrete exemption reasons', () =>
    {
        const input = validManifest();
        input.contracts = [];
        input.exemptions.push({
            name: 'DYNAMIC_FIXTURE',
            direction: 'server_to_client',
            header: 200,
            java: { symbol: 'DynamicComposer', className: 'DynamicComposer', path: 'src/DynamicComposer.java' },
            typescript: { symbol: 'DYNAMIC', className: 'DynamicEvent', path: 'src/DynamicEvent.ts' },
            reason: 'complex packet'
        } as never);

        expect(() => parsePacketContractManifest(input)).toThrow('concrete exemption reason');
    });
});
