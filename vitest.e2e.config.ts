import { defineConfig } from 'vitest/config';
import { aliases } from './vitest.config';

export default defineConfig({
    test: {
        environment: 'node',
        include: ['packages/**/*.e2e.test.ts'],
        exclude: ['**/node_modules/**', '**/dist/**'],
        testTimeout: 90000,
        setupFiles: ['packages/communication/src/e2e/setup.ts'],
        alias: aliases
    },
    resolve: {
        alias: aliases
    }
});
