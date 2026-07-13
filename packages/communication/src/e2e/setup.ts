if(!globalThis.self)
{
    Object.defineProperty(globalThis, 'self', {
        value: globalThis,
        configurable: true
    });
}
