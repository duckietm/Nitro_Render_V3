import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const argumentsList = process.argv.slice(2);
const emulatorIndex = argumentsList.indexOf('--emulator');
if(emulatorIndex < 0 || !argumentsList[emulatorIndex + 1])
{
    console.error('Usage: node scripts/verify-packet-contract-manifest.mjs --emulator <repository-path>');
    process.exit(2);
}

const rendererManifestPath = fileURLToPath(new URL('../protocol/packet-field-contracts.json', import.meta.url));
const emulatorManifestPath = resolve(argumentsList[emulatorIndex + 1], 'protocol/packet-field-contracts.json');
const rendererBytes = readFileSync(rendererManifestPath);
const emulatorBytes = readFileSync(emulatorManifestPath);
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const rendererHash = hash(rendererBytes);
const emulatorHash = hash(emulatorBytes);

if(!rendererBytes.equals(emulatorBytes))
{
    console.error(`Packet contract manifests differ: renderer=${ rendererHash } emulator=${ emulatorHash }`);
    process.exit(1);
}

const manifest = JSON.parse(rendererBytes.toString('utf8'));
console.log(
    `Packet contract manifests match (${ rendererHash }): ` +
    `${ manifest.contracts.length } verified, ${ manifest.unpaired.length } unpaired, ` +
    `${ manifest.exemptions.length } exempt`);
