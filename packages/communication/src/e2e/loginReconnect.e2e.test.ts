import { GetConfiguration } from '@nitrots/configuration';
import { GetEventDispatcher, NitroEventType } from '@nitrots/events';
import { afterEach, describe, expect, it } from 'vitest';
import { CommunicationManager } from '../CommunicationManager';
import { recordConnectionStates } from './connectionStateRecorder';
import { readE2eEnvironment } from './e2eEnvironment';
import { waitFor } from './waitFor';

describe('Polaris login and reconnect', () =>
{
    let manager: CommunicationManager = null;

    afterEach(() =>
    {
        manager?.connection.dispose();
        manager?.dispose();
        GetEventDispatcher().removeAllListeners();
        GetConfiguration().resetConfiguration();
    });

    it('authenticates again after Polaris drops the active transport', async () =>
    {
        const environment = readE2eEnvironment(process.env);
        const configuration = GetConfiguration();
        configuration.resetConfiguration();
        configuration.setValue('socket.url', environment.wsUrl);
        configuration.setValue('sso.ticket', environment.ssoTicket);
        configuration.setValue('crypto.ws.enabled', false);
        configuration.setValue('system.pong.manually', false);

        manager = new CommunicationManager();
        (manager as unknown as { _machineIdPromise: Promise<string> })._machineIdPromise = Promise.resolve('IID-E2E-RECONNECT');

        const recorder = recordConnectionStates(
            () => manager.connection.connectionState,
            listener => GetEventDispatcher().subscribe(NitroEventType.CONNECTION_STATE_CHANGED, listener));

        try
        {
            let initError: unknown = null;
            let initialized = false;
            void manager.init()
                .then(() => { initialized = true; })
                .catch(error => { initError = error; });

            await waitFor(() => initialized || !!initError, {
                timeoutMs: 30000,
                description: 'initial Polaris authentication'
            });
            if(initError) throw initError;

            const initialCount = await fetch(`${ environment.probeUrl }/session-count?userId=${ environment.userId }`);
            expect(await initialCount.json()).toEqual({ activeSessions: 1 });

            const drop = await fetch(`${ environment.probeUrl }/drop?userId=${ environment.userId }`, { method: 'POST' });
            expect(drop.status).toBe(204);

            try
            {
                await waitFor(() => recorder.states.filter(state => state.phase === 'connected').length >= 2, {
                    timeoutMs: 30000,
                    description: 'Polaris reauthentication after transport loss'
                });
            }
            catch(error)
            {
                throw new Error(`${ (error as Error).message }; states=${ JSON.stringify(recorder.states) }`);
            }

            expect(containsOrderedPhases(recorder.states.map(state => state.phase), [
                'connecting',
                'authenticating',
                'connected',
                'reconnecting',
                'reauthenticating',
                'connected'
            ])).toBe(true);
            expect(manager.connection.connectionState.authenticated).toBe(true);

            const recoveredCount = await fetch(`${ environment.probeUrl }/session-count?userId=${ environment.userId }`);
            expect(await recoveredCount.json()).toEqual({ activeSessions: 1 });
        }
        finally
        {
            recorder.dispose();
        }
    });
});

const containsOrderedPhases = (actual: string[], expected: string[]): boolean =>
{
    let expectedIndex = 0;
    for(const phase of actual)
    {
        if(phase === expected[expectedIndex]) expectedIndex++;
        if(expectedIndex === expected.length) return true;
    }
    return false;
};
