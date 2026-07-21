import { describe, expect, it } from 'vitest';
import { BinaryReader, BinaryWriter } from '@nitrots/utils';
import { SoundboardPlayParser } from '../SoundboardPlayParser';
import { SoundboardSettingsParser } from '../SoundboardSettingsParser';

class TestWrapper
{
    constructor(private reader: BinaryReader) {}
    readByte() { return this.reader.readByte(); }
    readBytes(length: number) { return this.reader.readBytes(length); }
    readBoolean() { return this.reader.readByte() === 1; }
    readShort() { return this.reader.readShort(); }
    readInt() { return this.reader.readInt(); }
    readFloat() { return this.reader.readFloat(); }
    readDouble() { return this.reader.readDouble(); }
    readString() { const length = this.reader.readShort(); return this.reader.readBytes(length).toString(); }
    header = 0;
    get bytesAvailable() { return this.reader.remaining() > 0; }
}

describe('SoundboardSettingsParser', () =>
{
    it('parses the personalized cooldown before the filtered sound list', () =>
    {
        const writer = new BinaryWriter();
        writer.writeByte(1);
        writer.writeInt(60);
        writer.writeInt(1);
        writer.writeInt(7);
        writer.writeString('Campanella');
        writer.writeString('/sounds/soundboard/campanella.mp3');

        const parser = new SoundboardSettingsParser();
        parser.parse(new TestWrapper(new BinaryReader(writer.getBuffer())) as any);

        expect(parser.enabled).toBe(true);
        expect(parser.cooldownSeconds).toBe(60);
        expect(parser.sounds).toEqual([
            { id: 7, name: 'Campanella', url: '/sounds/soundboard/campanella.mp3' }
        ]);

        parser.flush();
        expect(parser.enabled).toBe(false);
        expect(parser.cooldownSeconds).toBe(0);
        expect(parser.sounds).toEqual([]);
    });

    it('clamps a negative cooldown to zero', () =>
    {
        const writer = new BinaryWriter();
        writer.writeByte(1);
        writer.writeInt(-5);
        writer.writeInt(0);

        const parser = new SoundboardSettingsParser();
        parser.parse(new TestWrapper(new BinaryReader(writer.getBuffer())) as any);

        expect(parser.cooldownSeconds).toBe(0);
    });
});

describe('SoundboardPlayParser', () =>
{
    it('parses authoritative sound and actor metadata', () =>
    {
        const writer = new BinaryWriter();
        writer.writeInt(7);
        writer.writeString('/sounds/soundboard/campanella.mp3');
        writer.writeString('Campanella');
        writer.writeInt(42);
        writer.writeInt(3);
        writer.writeString('Simoleo');

        const parser = new SoundboardPlayParser();
        parser.parse(new TestWrapper(new BinaryReader(writer.getBuffer())) as any);

        expect(parser.soundId).toBe(7);
        expect(parser.url).toBe('/sounds/soundboard/campanella.mp3');
        expect(parser.soundName).toBe('Campanella');
        expect(parser.actorUserId).toBe(42);
        expect(parser.actorRoomIndex).toBe(3);
        expect(parser.username).toBe('Simoleo');

        parser.flush();
        expect(parser.soundId).toBe(0);
        expect(parser.url).toBe('');
        expect(parser.soundName).toBe('');
        expect(parser.actorUserId).toBe(0);
        expect(parser.actorRoomIndex).toBe(0);
        expect(parser.username).toBe('');
    });
});
