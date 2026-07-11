import { NitroEventType } from '@nitrots/events';

export const shouldAttemptRoomReEntry = (eventType: string): boolean =>
    eventType === NitroEventType.SOCKET_REAUTHENTICATED;
