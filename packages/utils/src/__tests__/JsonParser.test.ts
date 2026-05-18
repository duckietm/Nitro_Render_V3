import { describe, expect, it } from 'vitest';
import { fetchConfigJson, parseConfigJson, parseConfigJsonFromResponse } from '../JsonParser';

describe('parseConfigJson', () =>
{
    it('parses strict JSON', () =>
    {
        const result = parseConfigJson('{"a": 1, "b": [2, 3]}');
        expect(result).toEqual({ a: 1, b: [ 2, 3 ] });
    });

    it('falls back to JSON5 for trailing commas', () =>
    {
        const result = parseConfigJson('{"a": 1, "b": [2, 3,],}');
        expect(result).toEqual({ a: 1, b: [ 2, 3 ] });
    });

    it('falls back to JSON5 for comments', () =>
    {
        const result = parseConfigJson(`{
            // a number
            "a": 1,
            /* a list */
            "b": [2, 3]
        }`);
        expect(result).toEqual({ a: 1, b: [ 2, 3 ] });
    });

    it('falls back to JSON5 for unquoted keys and single quotes', () =>
    {
        const result = parseConfigJson("{ a: 1, b: 'hello' }");
        expect(result).toEqual({ a: 1, b: 'hello' });
    });

    it('uses JSON5 directly for .json5 URLs', () =>
    {
        const result = parseConfigJson('{ a: 1, /* hi */ b: 2 }', 'https://example.com/cfg.json5');
        expect(result).toEqual({ a: 1, b: 2 });
    });

    it('throws a helpful error when both strict and JSON5 fail', () =>
    {
        expect(() => parseConfigJson('{ this is :: not json ::', 'cfg.json'))
            .toThrowError(/Failed to parse JSON\/JSON5 in "cfg\.json"/);
    });
});

describe('parseConfigJsonFromResponse', () =>
{
    const buildResponse = (body: string, contentType = 'application/json', url = 'https://example.com/x.json'): Response =>
    {
        const headers = new Headers({ 'content-type': contentType });
        return new Response(body, { status: 200, headers });
    };

    it('parses JSON response bodies', async () =>
    {
        const res = buildResponse('{"a": 1}');
        await expect(parseConfigJsonFromResponse(res, 'https://example.com/x.json')).resolves.toEqual({ a: 1 });
    });

    it('parses JSON5 response bodies with comments', async () =>
    {
        const res = buildResponse('{ /* yo */ a: 1, b: 2, }');
        await expect(parseConfigJsonFromResponse(res, 'https://example.com/x.json')).resolves.toEqual({ a: 1, b: 2 });
    });

    it('respects application/json5 content-type', async () =>
    {
        const res = buildResponse('{ a: 1 }', 'application/json5');
        await expect(parseConfigJsonFromResponse(res, 'https://example.com/x.txt')).resolves.toEqual({ a: 1 });
    });
});

describe('fetchConfigJson', () =>
{
    it('fetches and parses JSON or JSON5', async () =>
    {
        const originalFetch = globalThis.fetch;
        globalThis.fetch = (async () => new Response('{ a: 1, b: 2, }', {
            status: 200,
            headers: { 'content-type': 'application/json' }
        })) as any;

        try
        {
            await expect(fetchConfigJson('https://example.com/cfg.json')).resolves.toEqual({ a: 1, b: 2 });
        }
        finally
        {
            globalThis.fetch = originalFetch;
        }
    });

    it('throws for non-200 responses', async () =>
    {
        const originalFetch = globalThis.fetch;
        globalThis.fetch = (async () => new Response('', { status: 404 })) as any;

        try
        {
            await expect(fetchConfigJson('https://example.com/missing.json')).rejects.toThrowError(/HTTP 404/);
        }
        finally
        {
            globalThis.fetch = originalFetch;
        }
    });
});
