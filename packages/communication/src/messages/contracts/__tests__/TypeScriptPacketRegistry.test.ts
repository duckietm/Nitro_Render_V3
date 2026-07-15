import { mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { TypeScriptPacketRegistry } from '../TypeScriptPacketRegistry';

const write = (root: string, relative: string, contents: string): string =>
{
    const path = join(root, relative);
    mkdirSync(join(path, '..'), { recursive: true });
    writeFileSync(path, contents);
    return path;
};

describe('TypeScript packet registry', () =>
{
    it('discovers the real renderer registry', () =>
    {
        const registry = TypeScriptPacketRegistry.discover(resolve('packages/communication/src'));

        expect(registry.active.length).toBeGreaterThan(900);
        expect(registry.active.some(packet => packet.header === 412)).toBe(true);
    });

    it('discovers registered events, their parsers, and outgoing composers', () =>
    {
        const root = join(tmpdir(), `packet-registry-${ Date.now() }`);
        write(root, 'messages/incoming/IncomingHeader.ts', `export class IncomingHeader {
            static OPEN = 100; static DECLARED_ONLY = 101;
        }`);
        write(root, 'messages/outgoing/OutgoingHeader.ts',
            'export class OutgoingHeader { static SEND = 200; }');
        write(root, 'NitroMessages.ts', `class NitroMessages { register() {
            this._events.set(IncomingHeader.OPEN, OpenEvent);
            this._composers.set(OutgoingHeader.SEND, SendComposer);
        }}`);
        write(root, 'messages/incoming/test/OpenEvent.ts',
            'class OpenEvent { constructor(callback: Function) { super(callback, OpenParser); } }');
        const parser = write(root, 'messages/parser/test/OpenParser.ts', 'class OpenParser {}');
        const composer = write(root, 'messages/outgoing/test/SendComposer.ts', 'class SendComposer {}');

        const registry = TypeScriptPacketRegistry.discover(root);

        expect(registry.require('server_to_client', 100).source).toBe(parser);
        expect(registry.require('client_to_server', 200).source).toBe(composer);
        expect(registry.declaredOnly.some(packet => packet.header === 101)).toBe(true);
    });

    it('rejects duplicate active headers', () =>
    {
        const root = join(tmpdir(), `packet-registry-duplicate-${ Date.now() }`);
        write(root, 'messages/incoming/IncomingHeader.ts', `export class IncomingHeader {
            static FIRST = 100; static SECOND = 100;
        }`);
        write(root, 'messages/outgoing/OutgoingHeader.ts', 'export class OutgoingHeader {}');
        write(root, 'NitroMessages.ts', `class NitroMessages { register() {
            this._events.set(IncomingHeader.FIRST, FirstEvent);
            this._events.set(IncomingHeader.SECOND, SecondEvent);
        }}`);
        write(root, 'messages/incoming/test/FirstEvent.ts',
            'class FirstEvent { constructor() { super(null, FirstParser); } }');
        write(root, 'messages/incoming/test/SecondEvent.ts',
            'class SecondEvent { constructor() { super(null, SecondParser); } }');
        write(root, 'messages/parser/test/FirstParser.ts', 'class FirstParser {}');
        write(root, 'messages/parser/test/SecondParser.ts', 'class SecondParser {}');

        expect(() => TypeScriptPacketRegistry.discover(root))
            .toThrow('duplicate active server_to_client header 100: FIRST and SECOND');
    });

    it('rejects registrations whose parser source is missing', () =>
    {
        const root = join(tmpdir(), `packet-registry-missing-${ Date.now() }`);
        write(root, 'messages/incoming/IncomingHeader.ts',
            'export class IncomingHeader { static MISSING = 100; }');
        write(root, 'messages/outgoing/OutgoingHeader.ts', 'export class OutgoingHeader {}');
        write(root, 'NitroMessages.ts', `class NitroMessages { register() {
            this._events.set(IncomingHeader.MISSING, MissingEvent);
        }}`);
        write(root, 'messages/incoming/test/MissingEvent.ts',
            'class MissingEvent { constructor() { super(null, MissingParser); } }');

        expect(() => TypeScriptPacketRegistry.discover(root))
            .toThrow('source for MissingParser is missing');
    });
});
