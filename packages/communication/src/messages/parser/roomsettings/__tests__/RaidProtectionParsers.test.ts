import { BinaryReader } from '@octane/utils';
import { describe, expect, it } from 'vitest';
import { EvaWireDataWrapper } from '../../../../codec/evawire/EvaWireDataWrapper';
import { RaidProtectionCapabilityParser } from '../RaidProtectionCapabilityParser';
import { RaidProtectionSaveResultParser } from '../RaidProtectionSaveResultParser';
import { RaidProtectionSettingsParser } from '../RaidProtectionSettingsParser';

class PacketWriter
{
    private readonly _bytes: number[] = [];

    public boolean(value: boolean): this
    {
        this._bytes.push(value ? 1 : 0);

        return this;
    }

    public int(value: number): this
    {
        this._bytes.push((value >>> 24) & 0xff, (value >>> 16) & 0xff, (value >>> 8) & 0xff, value & 0xff);

        return this;
    }

    public toArrayBuffer(): ArrayBuffer
    {
        return Uint8Array.from(this._bytes).buffer;
    }
}

/** The nine snapshot fields that follow the room id, in the order the server writes them. */
const writeSnapshotAfterRoomId = (writer: PacketWriter): PacketWriter => writer
    .boolean(true)
    .int(2)
    .int(1)
    .int(3600)
    .boolean(true)
    .int(1800)
    .int(2)
    .boolean(false)
    .int(1_757_600_000);

const expectSnapshot = (settings: RaidProtectionSettingsParser | RaidProtectionSaveResultParser, roomId: number): void =>
{
    expect(settings.roomId).toBe(roomId);
    expect(settings.enabled).toBe(true);
    expect(settings.detectionSensitivity).toBe(2);
    expect(settings.actionType).toBe(1);
    expect(settings.banDurationSeconds).toBe(3600);
    expect(settings.guardEnabled).toBe(true);
    expect(settings.guardDurationSeconds).toBe(1800);
    expect(settings.guardSensitivity).toBe(2);
    expect(settings.incidentActive).toBe(false);
    expect(settings.lastRaidAtEpochSeconds).toBe(1_757_600_000);
};

describe('raid protection parsers', () =>
{
    it('reads the capability', () =>
    {
        const parser = new RaidProtectionCapabilityParser();

        parser.flush();
        parser.parse(new EvaWireDataWrapper(0, new BinaryReader(new PacketWriter().int(42).boolean(true).toArrayBuffer())));

        expect(parser.roomId).toBe(42);
        expect(parser.canManage).toBe(true);
    });

    it('reads the settings snapshot', () =>
    {
        const parser = new RaidProtectionSettingsParser();

        parser.flush();
        parser.parse(new EvaWireDataWrapper(0, new BinaryReader(writeSnapshotAfterRoomId(new PacketWriter().int(42)).toArrayBuffer())));

        expectSnapshot(parser, 42);
    });

    it('reads the save result, where the result code sits between the room id and the rest', () =>
    {
        const parser = new RaidProtectionSaveResultParser();

        parser.flush();
        parser.parse(new EvaWireDataWrapper(
            0, new BinaryReader(writeSnapshotAfterRoomId(new PacketWriter().int(42).int(0)).toArrayBuffer())));

        expect(parser.resultCode).toBe(0);
        expect(parser.succeeded).toBe(true);
        expectSnapshot(parser, 42);
    });

    it('treats any result code other than zero as a failure', () =>
    {
        const parser = new RaidProtectionSaveResultParser();

        parser.flush();
        parser.parse(new EvaWireDataWrapper(
            0, new BinaryReader(writeSnapshotAfterRoomId(new PacketWriter().int(42).int(2)).toArrayBuffer())));

        expect(parser.resultCode).toBe(2);
        expect(parser.succeeded).toBe(false);
    });
});
