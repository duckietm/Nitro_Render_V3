import { describe, expect, it } from 'vitest';
import { waitFor } from './waitFor';

describe('waitFor', () =>
{
    it('resolves when the predicate becomes true before the deadline', async () =>
    {
        let ready = false;
        queueMicrotask(() => { ready = true; });

        await expect(waitFor(() => ready, {
            timeoutMs: 100,
            description: 'renderer to connect'
        })).resolves.toBeUndefined();
    });

    it('reports the awaited condition when the deadline expires', async () =>
    {
        await expect(waitFor(() => false, {
            timeoutMs: 10,
            description: 'renderer to reauthenticate'
        })).rejects.toThrow('Timed out after 10ms waiting for renderer to reauthenticate');
    });
});
