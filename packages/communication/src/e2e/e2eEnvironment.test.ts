import { describe, expect, it } from 'vitest';
import { readE2eEnvironment } from './e2eEnvironment';

describe('readE2eEnvironment', () =>
{
    it('reports every missing variable together', () =>
    {
        expect(() => readE2eEnvironment({})).toThrow(
            'Missing E2E environment variables: E2E_WS_URL, E2E_SSO_TICKET, E2E_USER_ID, E2E_PROBE_URL');
    });

    it('accepts loopback endpoints and a positive user id', () =>
    {
        expect(readE2eEnvironment({
            E2E_WS_URL: 'ws://127.0.0.1:31999',
            E2E_SSO_TICKET: 'e2e-ticket',
            E2E_USER_ID: '900001',
            E2E_PROBE_URL: 'http://127.0.0.1:31999/__e2e'
        })).toEqual({
            wsUrl: 'ws://127.0.0.1:31999',
            ssoTicket: 'e2e-ticket',
            userId: 900001,
            probeUrl: 'http://127.0.0.1:31999/__e2e'
        });
    });

    it('rejects a probe that is not loopback', () =>
    {
        expect(() => readE2eEnvironment({
            E2E_WS_URL: 'ws://127.0.0.1:31999',
            E2E_SSO_TICKET: 'e2e-ticket',
            E2E_USER_ID: '900001',
            E2E_PROBE_URL: 'https://hotel.example/__e2e'
        })).toThrow('E2E_PROBE_URL must use a loopback host');
    });
});
