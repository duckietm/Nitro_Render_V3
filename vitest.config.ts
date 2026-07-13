import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export const aliases = {
    '@nitrots/api': resolve(__dirname, 'packages/api/src'),
    '@nitrots/assets': resolve(__dirname, 'packages/assets/src'),
    '@nitrots/avatar': resolve(__dirname, 'packages/avatar/src'),
    '@nitrots/camera': resolve(__dirname, 'packages/camera/src'),
    '@nitrots/communication': resolve(__dirname, 'packages/communication/src'),
    '@nitrots/configuration': resolve(__dirname, 'packages/configuration/src'),
    '@nitrots/events': resolve(__dirname, 'packages/events/src'),
    '@nitrots/localization': resolve(__dirname, 'packages/localization/src'),
    '@nitrots/room': resolve(__dirname, 'packages/room/src'),
    '@nitrots/session': resolve(__dirname, 'packages/session/src'),
    '@nitrots/sound': resolve(__dirname, 'packages/sound/src'),
    '@nitrots/utils': resolve(__dirname, 'packages/utils/src')
};

export default defineConfig({
    test: {
        globals: true,
        environment: 'jsdom',
        include: ['packages/**/*.{test,spec}.{js,ts}'],
        exclude: ['**/node_modules/**', '**/dist/**', '**/*.e2e.test.ts'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            include: ['packages/*/src/**/*.ts'],
            exclude: [
                '**/node_modules/**',
                '**/dist/**',
                '**/*.d.ts',
                '**/index.ts',
                '**/*.test.ts',
                '**/*.spec.ts'
            ]
        },
        alias: aliases
    },
    resolve: {
        alias: aliases
    }
});
