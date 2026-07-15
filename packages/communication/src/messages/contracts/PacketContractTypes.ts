export type PacketDirection = 'client_to_server' | 'server_to_client';
export type PacketSide = 'java' | 'typescript';
export type ScalarType = 'byte' | 'short' | 'int' | 'long' | 'boolean' | 'string' | 'bytes';

export interface ScalarSchema
{
    type: ScalarType;
    name: string;
}

export interface ListSchema
{
    type: 'list';
    countType: ScalarType;
    item: readonly WireSchema[];
}

export interface OptionalSchema
{
    type: 'optional';
    controller: string;
    fields: readonly WireSchema[];
}

export interface VariantSchema
{
    type: 'variant';
    discriminator: string;
    branches: Readonly<Record<string, readonly WireSchema[]>>;
}

export type WireSchema = ScalarSchema | ListSchema | OptionalSchema | VariantSchema;

export interface PacketEndpoint
{
    symbol: string;
    className: string;
    path: string;
}

export interface PacketContract
{
    name: string;
    direction: PacketDirection;
    header: number;
    java: PacketEndpoint;
    typescript: PacketEndpoint;
    fields: readonly WireSchema[];
}

export interface UnpairedPacket
{
    direction: PacketDirection;
    side: PacketSide;
    header: number;
    symbol: string;
    path: string;
    reason: string;
}

export interface PacketExemption
{
    name: string;
    direction: PacketDirection;
    header: number;
    java: PacketEndpoint;
    typescript: PacketEndpoint;
    reason: string;
}

export interface PacketContractManifest
{
    schemaVersion: 1;
    contracts: readonly PacketContract[];
    unpaired: readonly UnpairedPacket[];
    exemptions: readonly PacketExemption[];
}
