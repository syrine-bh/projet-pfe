import { resources } from '../i18n/translationConfig';

declare module 'i18next' {
  interface CustomTypeOptions {
    resources: typeof resources['en'];
  }
}