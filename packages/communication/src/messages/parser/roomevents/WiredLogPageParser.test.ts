import { BinaryReader, BinaryWriter } from '@octane/utils';
import { describe, expect, it } from 'vitest';
import { WiredLogPageParser } from './WiredLogPageParser';

class TestWrapper
{
    constructor(private reader: BinaryReader)
    {}
    readByte()
    {
        return this.reader.readByte();
    }
    readBoolean()
    {
        return this.reader.readByte() === 1;
    }
    readShort()
    {
        return this.reader.readShort();
    }
    readInt()
    {
        return this.reader.readInt();
    }
    readString()
    {
        const length = this.reader.readShort(); return this.reader.readBytes(length).toString();
    }
    header = 0;
    get bytesAvailable()
    {
        return this.reader.remaining() > 0;
    }
    get remainingBytes()
    {
        return this.reader.remaining();
    }
}

const wrapper = (writer: BinaryWriter) => new TestWrapper(new BinaryReader(writer.getBuffer())) as any;

describe('WiredLogPageParser', () =>
{
    it('reads a page with one entry and all three filters set', () =>
    {
        const writer = new BinaryWriter();

        writer.writeInt(120); // totalEntries
        writer.writeInt(2); // currentPage
        writer.writeInt(50); // amount
        writer.writeInt(1); // entry count
        writer.writeInt(0).writeInt(7); // id, as high / low halves of a long
        writer.writeByte(1); // logLevel
        writer.writeByte(4); // logSource
        writer.writeString('KILLED [wf_act_moveuser#12]: recursion');
        writer.writeInt(0).writeInt(1000); // timestamp halves
        writer.writeString('09/09/2026 20:15:00');
        writer.writeByte(1).writeByte(1); // logLevelFilter present, value 1
        writer.writeByte(1).writeByte(4); // logSourceFilter present, value 4
        writer.writeByte(1).writeString('recursion'); // query present

        const parser = new WiredLogPageParser();

        expect(parser.parse(wrapper(writer))).toBe(true);
        expect(parser.totalEntries).toBe(120);
        expect(parser.currentPage).toBe(2);
        expect(parser.amount).toBe(50);
        expect(parser.entries).toHaveLength(1);
        expect(parser.entries[0].id).toBe(7);
        expect(parser.entries[0].logLevel).toBe(1);
        expect(parser.entries[0].logSource).toBe(4);
        expect(parser.entries[0].timestamp).toBe(1000);
        expect(parser.entries[0].timestampStr).toBe('09/09/2026 20:15:00');
        expect(parser.logLevelFilter).toBe(1);
        expect(parser.logSourceFilter).toBe(4);
        expect(parser.query).toBe('recursion');
    });

    it('leaves the filters unset when the server sends none', () =>
    {
        const writer = new BinaryWriter();

        writer.writeInt(0); // totalEntries
        writer.writeInt(1); // currentPage
        writer.writeInt(50); // amount
        writer.writeInt(0); // no entries
        writer.writeByte(0); // no logLevelFilter
        writer.writeByte(0); // no logSourceFilter
        writer.writeByte(0); // no query

        const parser = new WiredLogPageParser();

        expect(parser.parse(wrapper(writer))).toBe(true);
        expect(parser.entries).toHaveLength(0);
        expect(parser.logLevelFilter).toBe(-1);
        expect(parser.logSourceFilter).toBe(-1);
        expect(parser.query).toBeNull();
    });
});
