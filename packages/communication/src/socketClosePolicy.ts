export const shouldReconnectAfterClose = (code: number, intentionalClose: boolean): boolean =>
    !intentionalClose && code !== 1000;
