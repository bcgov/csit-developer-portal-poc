import {
  createTranslationMessages,
  createTranslationResource,
} from '@backstage/frontend-plugin-api';
import { catalogTranslationRef } from '@backstage/plugin-catalog/alpha';

const catalogEnMessages = createTranslationMessages({
  ref: catalogTranslationRef,
  full: false,
  messages: {
    'indexPage.title': '{{orgName}} Catalogue',
  },
});

export const catalogTranslations = createTranslationResource({
  ref: catalogTranslationRef,
  translations: {
    en: async () => ({
      default: catalogEnMessages,
    }),
  },
});