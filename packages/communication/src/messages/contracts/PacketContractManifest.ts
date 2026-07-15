import { readFileSync } from 'node:fs';
import {
    PacketContract,
    PacketContractManifest,
    PacketDirection,
    PacketEndpoint,
    PacketExemption,
    ScalarType,
    UnpairedPacket,
    WireSchema
} from './PacketContractTypes';

const DIRECTIONS = new Set<PacketDirection>(['client_to_server', 'server_to_client']);
const SCALAR_TYPES = new Set<ScalarType>(['byte', 'short', 'int', 'long', 'boolean', 'string', 'bytes']);
const SIDES = new Set(['java', 'typescript']);
const GENERIC_REASONS = new Set(['complex packet', 'dynamic packet', 'unsupported packet', 'todo']);

export const loadPacketContractManifest = (path: string): PacketContractManifest =>
    parsePacketContractManifest(JSON.parse(readFileSync(path, 'utf8')) as unknown);

export const parsePacketContractManifest = (input: unknown): PacketContractManifest =>
{
    const root = object(input, 'manifest');
    if(root.schemaVersion !== 1) throw new TypeError('packet contract manifest requires schemaVersion 1');

    const contracts = array(root.contracts, 'contracts').map((value, index) => contract(value, `contracts[${ index }]`));
    const unpaired = array(root.unpaired, 'unpaired').map((value, index) => unpairedPacket(value, `unpaired[${ index }]`));
    const exemptions = array(root.exemptions, 'exemptions').map((value, index) => exemption(value, `exemptions[${ index }]`));
    const classified = new Set<string>();
    for(const entry of [...contracts, ...unpaired, ...exemptions])
    {
        const key = `${ entry.direction }:${ entry.header }`;
        if(classified.has(key)) throw new TypeError(`${ key } is classified more than once`);
        classified.add(key);
    }

    return deepFreeze({ schemaVersion: 1, contracts, unpaired, exemptions });
};

const contract = (input: unknown, context: string): PacketContract =>
{
    const value = object(input, context);
    return {
        name: nonEmptyString(value.name, `${ context }.name`),
        direction: direction(value.direction, context),
        header: positiveInteger(value.header, `${ context }.header`),
        java: endpoint(value.java, `${ context }.java`),
        typescript: endpoint(value.typescript, `${ context }.typescript`),
        fields: array(value.fields, `${ context }.fields`).map((field, index) => schema(field, `${ context }.fields[${ index }]`))
    };
};

const unpairedPacket = (input: unknown, context: string): UnpairedPacket =>
{
    const value = object(input, context);
    const side = nonEmptyString(value.side, `${ context }.side`);
    if(!SIDES.has(side)) throw new TypeError(`${ context } has invalid side ${ side }`);
    return {
        direction: direction(value.direction, context),
        side: side as UnpairedPacket['side'],
        header: positiveInteger(value.header, `${ context }.header`),
        symbol: nonEmptyString(value.symbol, `${ context }.symbol`),
        path: nonEmptyString(value.path, `${ context }.path`),
        reason: concreteReason(value.reason, context)
    };
};

const exemption = (input: unknown, context: string): PacketExemption =>
{
    const value = object(input, context);
    return {
        name: nonEmptyString(value.name, `${ context }.name`),
        direction: direction(value.direction, context),
        header: positiveInteger(value.header, `${ context }.header`),
        java: endpoint(value.java, `${ context }.java`),
        typescript: endpoint(value.typescript, `${ context }.typescript`),
        reason: concreteReason(value.reason, context)
    };
};

const endpoint = (input: unknown, context: string): PacketEndpoint =>
{
    const value = object(input, context);
    return {
        symbol: nonEmptyString(value.symbol, `${ context }.symbol`),
        className: nonEmptyString(value.className, `${ context }.className`),
        path: nonEmptyString(value.path, `${ context }.path`)
    };
};

const schema = (input: unknown, context: string): WireSchema =>
{
    const value = object(input, context);
    const kind = nonEmptyString(value.kind, `${ context }.kind`);
    if(kind === 'scalar')
    {
        const type = nonEmptyString(value.type, `${ context }.type`);
        if(!SCALAR_TYPES.has(type as ScalarType)) throw new TypeError(`${ context } has unknown scalar type ${ type }`);
        return { type: type as ScalarType, name: string(value.name, `${ context }.name`) };
    }
    if(kind === 'list')
    {
        const countType = nonEmptyString(value.countType, `${ context }.countType`);
        if(!SCALAR_TYPES.has(countType as ScalarType)) throw new TypeError(`${ context } has unknown scalar type ${ countType }`);
        return {
            type: 'list',
            countType: countType as ScalarType,
            item: array(value.item, `${ context }.item`).map((field, index) => schema(field, `${ context }.item[${ index }]`))
        };
    }
    if(kind === 'optional')
    {
        return {
            type: 'optional',
            controller: nonEmptyString(value.controller, `${ context }.controller`),
            fields: array(value.fields, `${ context }.fields`).map((field, index) => schema(field, `${ context }.fields[${ index }]`))
        };
    }
    if(kind === 'variant')
    {
        const branches = object(value.branches, `${ context }.branches`);
        return {
            type: 'variant',
            discriminator: nonEmptyString(value.discriminator, `${ context }.discriminator`),
            branches: Object.fromEntries(Object.entries(branches).map(([key, fields]) => [
                key,
                array(fields, `${ context }.branches.${ key }`).map((field, index) => schema(field, `${ context }.branches.${ key }[${ index }]`))
            ]))
        };
    }
    throw new TypeError(`${ context } has unknown schema kind ${ kind }`);
};

const direction = (input: unknown, context: string): PacketDirection =>
{
    if(typeof input !== 'string' || !DIRECTIONS.has(input as PacketDirection))
        throw new TypeError(`${ context } has invalid direction ${ String(input) }`);
    return input as PacketDirection;
};

const concreteReason = (input: unknown, context: string): string =>
{
    const reason = nonEmptyString(input, `${ context }.reason`);
    if(reason.length < 20 || GENERIC_REASONS.has(reason.toLowerCase()))
        throw new TypeError(`${ context } requires a concrete exemption reason`);
    return reason;
};

const object = (input: unknown, context: string): Record<string, unknown> =>
{
    if(!input || typeof input !== 'object' || Array.isArray(input)) throw new TypeError(`${ context } must be an object`);
    return input as Record<string, unknown>;
};

const array = (input: unknown, context: string): unknown[] =>
{
    if(!Array.isArray(input)) throw new TypeError(`${ context } must be an array`);
    return input;
};

const string = (input: unknown, context: string): string =>
{
    if(typeof input !== 'string') throw new TypeError(`${ context } must be a string`);
    return input;
};

const nonEmptyString = (input: unknown, context: string): string =>
{
    const value = string(input, context).trim();
    if(!value) throw new TypeError(`${ context } must not be empty`);
    return value;
};

const positiveInteger = (input: unknown, context: string): number =>
{
    if(!Number.isInteger(input) || (input as number) <= 0) throw new TypeError(`${ context } must be a positive integer`);
    return input as number;
};

const deepFreeze = <T>(input: T): T =>
{
    if(input && typeof input === 'object' && !Object.isFrozen(input))
    {
        Object.freeze(input);
        for(const value of Object.values(input)) deepFreeze(value);
    }
    return input;
};
