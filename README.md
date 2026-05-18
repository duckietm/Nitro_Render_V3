# Nitro Renderer

nitro-renderer is a Javascript library for rendering Nitro in the browser using PixiJS

## Installation

npm

```
npm install @nitrots/nitro-renderer
```

yarn

```
yarn add @nitrots/nitro-renderer
```

## JSON / JSON5 configuration parser

Every configuration file and gamedata file loaded by the renderer (figuredata,
furnidata, productdata, effectmap, avatar actions, etc.) goes through
`@nitrots/utils` → `JsonParser.ts`. The parser supports three modes, selected at
the **host build time** through the compile-time constant `__NITRO_JSON_MODE__`:

| Mode     | Behaviour                                                                 |
|----------|---------------------------------------------------------------------------|
| `legacy` | Strict `JSON.parse` only. Comments / trailing commas raise a clear error. |
| `json5`  | `JSON5.parse` only. Accepts comments, trailing commas, single quotes.     |
| `auto`   | Try strict JSON first, fall back to JSON5. Default when the flag is unset.|

URL hints are still honoured: files ending in `.json5` (or served with a
`application/json5` content-type) always go through JSON5, regardless of mode.

### Wiring the flag into a host

The renderer does **not** ship its own build for the flag — the host application
(typically [Nitro V3](https://github.com/duckietm/Nitro-V3.git)) defines it via
its bundler. Example with Vite:

```js
// vite.config.mjs in the host
export default defineConfig({
    define: {
        __NITRO_JSON_MODE__: JSON.stringify('json5')   // or 'legacy' / 'auto'
    }
});
```

If the constant is not defined the parser falls back to `auto`, which preserves
the original behaviour of older releases — so existing hosts keep working
without any change.

### Using the parser directly

```ts
import { parseConfigJson, fetchConfigJson } from '@nitrots/utils';

const data  = parseConfigJson<MyConfig>(rawText, '/configuration/ui-config.json');
const data2 = await fetchConfigJson<MyConfig>('/configuration/ui-config.json5');
```

Errors carry the source URL and, in `legacy` mode, a hint about switching to
JSON5 — making misconfigurations easy to diagnose in production logs.
