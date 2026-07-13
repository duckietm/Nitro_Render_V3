export interface E2eEnvironment
{
    wsUrl: string;
    ssoTicket: string;
    userId: number;
    probeUrl: string;
}

const REQUIRED = ['E2E_WS_URL', 'E2E_SSO_TICKET', 'E2E_USER_ID', 'E2E_PROBE_URL'] as const;

export const readE2eEnvironment = (environment: Record<string, string | undefined>): E2eEnvironment =>
{
    const missing = REQUIRED.filter(name => !environment[name]?.trim());
    if(missing.length) throw new Error(`Missing E2E environment variables: ${ missing.join(', ') }`);

    const wsUrl = new URL(environment.E2E_WS_URL);
    const probeUrl = new URL(environment.E2E_PROBE_URL);
    if(wsUrl.protocol !== 'ws:' && wsUrl.protocol !== 'wss:') throw new Error('E2E_WS_URL must use ws or wss');
    if(!isLoopback(wsUrl.hostname)) throw new Error('E2E_WS_URL must use a loopback host');
    if(probeUrl.protocol !== 'http:' && probeUrl.protocol !== 'https:') throw new Error('E2E_PROBE_URL must use http or https');
    if(!isLoopback(probeUrl.hostname)) throw new Error('E2E_PROBE_URL must use a loopback host');

    const userId = Number(environment.E2E_USER_ID);
    if(!Number.isSafeInteger(userId) || userId <= 0) throw new Error('E2E_USER_ID must be a positive integer');

    return {
        wsUrl: wsUrl.toString().replace(/\/$/, ''),
        ssoTicket: environment.E2E_SSO_TICKET,
        userId,
        probeUrl: probeUrl.toString().replace(/\/$/, '')
    };
};

const isLoopback = (hostname: string): boolean =>
    hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '[::1]';
