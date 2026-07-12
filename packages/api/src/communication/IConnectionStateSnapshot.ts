export type ConnectionStatePhase = 'disconnected' | 'connecting' | 'authenticating' | 'connected' | 'reconnecting' | 'reauthenticating' | 'failed';

export interface IConnectionStateSnapshot
{
    readonly phase: ConnectionStatePhase;
    readonly reconnectAttempt: number;
    readonly maxReconnectAttempts: number;
    readonly authenticated: boolean;
    readonly closeCode: number | null;
    readonly closeReason: string;
}
