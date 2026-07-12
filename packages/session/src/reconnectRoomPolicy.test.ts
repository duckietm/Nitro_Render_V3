import { NitroEventType } from '@nitrots/events';
import { describe, expect, it } from 'vitest';
import { shouldAttemptRoomReEntry } from './reconnectRoomPolicy';

describe('shouldAttemptRoomReEntry', () =>
{
    it('waits for reauthentication before restoring the room', () =>
    {
        expect(shouldAttemptRoomReEntry(NitroEventType.SOCKET_RECONNECTED)).toBe(false);
        expect(shouldAttemptRoomReEntry(NitroEventType.SOCKET_REAUTHENTICATED)).toBe(true);
    });
});
