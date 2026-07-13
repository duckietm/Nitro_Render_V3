export interface WaitForOptions
{
    timeoutMs: number;
    description: string;
}

export const waitFor = async (predicate: () => boolean, options: WaitForOptions): Promise<void> =>
{
    const startedAt = Date.now();

    while(!predicate())
    {
        if((Date.now() - startedAt) >= options.timeoutMs)
        {
            throw new Error(`Timed out after ${ options.timeoutMs }ms waiting for ${ options.description }`);
        }

        await new Promise(resolve => setTimeout(resolve, Math.min(10, options.timeoutMs)));
    }
};
