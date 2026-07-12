import { describe, expect, it } from 'vitest';
import { NitroMessages } from '../../../../NitroMessages';
import { OutgoingHeader } from '../../OutgoingHeader';
import { CatalogAdminSavePageIconComposer } from '../CatalogAdminSavePageIconComposer';
import { CatalogAdminSavePageImagesComposer } from '../CatalogAdminSavePageImagesComposer';

describe('catalog admin packet contract', () =>
{
    it('matches the emulator page asset update headers', () =>
    {
        expect(OutgoingHeader.CATALOG_ADMIN_SAVE_PAGE_IMAGES).toBe(10060);
        expect(OutgoingHeader.CATALOG_ADMIN_SAVE_PAGE_ICON).toBe(10061);
    });

    it('registers both page asset composers', () =>
    {
        const messages = new NitroMessages();

        expect(messages.composers.get(10060)).toBe(CatalogAdminSavePageImagesComposer);
        expect(messages.composers.get(10061)).toBe(CatalogAdminSavePageIconComposer);
    });
});
