import JSON5 from 'json5';

const JSON5_EXTENSION = /\.json5(?:[?#]|$)/i;
const JSON5_MIME = /(?:application|text)\/(?:json5|x-json5)/i;

const looksLikeJson5Url = (url: string): boolean => !!url && JSON5_EXTENSION.test(url);

const looksLikeJson5ContentType = (contentType: string): boolean => !!contentType && JSON5_MIME.test(contentType);

const formatParseError = (sourceUrl: string, strictError: unknown, json5Error: unknown): string =>
{
    const strictMessage = (strictError as Error)?.message || String(strictError);
    const json5Message = (json5Error as Error)?.message || String(json5Error);
    const source = sourceUrl ? ` in "${ sourceUrl }"` : '';

    if(strictMessage === json5Message) return `Failed to parse JSON/JSON5${ source } — ${ json5Message }`;

    return `Failed to parse JSON/JSON5${ source } — JSON5: ${ json5Message } (strict JSON: ${ strictMessage })`;
};

export const parseConfigJson = <T = any>(text: string, sourceUrl: string = ''): T =>
{
    if(text === null || text === undefined) throw new Error(`Empty response${ sourceUrl ? ` for "${ sourceUrl }"` : '' }`);

    const trimmed = text.length > 0 ? text : '';

    if(looksLikeJson5Url(sourceUrl))
    {
        try
        {
            return JSON5.parse<T>(trimmed);
        }
        catch(err)
        {
            throw new Error(formatParseError(sourceUrl, err, err));
        }
    }

    let strictError: unknown;

    try
    {
        return JSON.parse(trimmed) as T;
    }
    catch(err)
    {
        strictError = err;
    }

    try
    {
        return JSON5.parse<T>(trimmed);
    }
    catch(json5Error)
    {
        throw new Error(formatParseError(sourceUrl, strictError, json5Error));
    }
};

export const parseConfigJsonFromResponse = async <T = any>(response: Response, sourceUrl: string = ''): Promise<T> =>
{
    const contentType = response.headers?.get?.('content-type') || '';
    const text = await response.text();
    const url = sourceUrl || (response as any).url || '';

    if(looksLikeJson5ContentType(contentType) && !looksLikeJson5Url(url))
    {
        try
        {
            return JSON5.parse<T>(text);
        }
        catch(err)
        {
            throw new Error(formatParseError(url, err, err));
        }
    }

    return parseConfigJson<T>(text, url);
};

export const fetchConfigJson = async <T = any>(url: string, init?: RequestInit): Promise<T> =>
{
    const response = await fetch(url, init);

    if(!response || response.status !== 200) throw new Error(`Failed to fetch "${ url }" — server returned HTTP ${ response?.status ?? 'no response' }`);

    return parseConfigJsonFromResponse<T>(response, url);
};
