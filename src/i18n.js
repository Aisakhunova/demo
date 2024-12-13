import { createI18n } from 'vue-i18n';

import en from './locales/en.json';
import ru from './locales/ru.json';

const i18n = createI18n({
  legacy: false,
  locale: 'ru', 
  messages: {
    en,
    ru,
  },
});

export function setupI18n(app) {
  app.use(i18n);
}
export {i18n} ;