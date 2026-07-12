import { describe, expect, it } from 'vitest';
import { ConnectionStateStore } from './ConnectionStateStore';

describe('ConnectionStateStore', () =>
{
    it('replaces immutable snapshots only when state changes', () =>
    {
        const store = new ConnectionStateStore(7);
        const first = store.snapshot;

        expect(Object.isFrozen(first)).toBe(true);
        expect(first.phase).toBe('disconnected');
        expect(store.update({ phase: 'connecting' })).toBe(true);
        expect(store.snapshot).not.toBe(first);
        expect(first.phase).toBe('disconnected');
        expect(store.update({ phase: 'connecting' })).toBe(false);
    });

    it('normalizes reconnect counters and close metadata', () =>
    {
        const store = new ConnectionStateStore(7);

        store.update({ reconnectAttempt: -2, closeCode: 1006, closeReason: 'away' });
        expect(store.snapshot.reconnectAttempt).toBe(0);
        expect(store.snapshot.closeCode).toBe(1006);

        store.update({ phase: 'connected', closeCode: null, closeReason: '' });
        expect(store.snapshot.closeCode).toBeNull();
        expect(store.snapshot.closeReason).toBe('');
    });
});
