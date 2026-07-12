import { describe, expect, it } from 'vitest';
import { shouldReconnectAfterClose } from './socketClosePolicy';

describe('shouldReconnectAfterClose', () =>
{
    it('reconnects after server-away and abnormal closures', () =>
    {
        expect(shouldReconnectAfterClose(1001, false)).toBe(true);
        expect(shouldReconnectAfterClose(1006, false)).toBe(true);
    });

    it('does not reconnect after an intentional or normal closure', () =>
    {
        expect(shouldReconnectAfterClose(1001, true)).toBe(false);
        expect(shouldReconnectAfterClose(1000, false)).toBe(false);
    });
});
