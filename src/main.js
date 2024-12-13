import { createApp } from 'vue';
import App from './App.vue';
import { createVuetify } from 'vuetify';
import 'vuetify/styles'; 
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { setupI18n } from './i18n';
import '@mdi/font/css/materialdesignicons.css'; 
import en from '../src/locales/en.json'
import ru from '../src/locales/ru.json'
import { createI18n } from 'vue-i18n';

import {router} from './router';
import { createPinia } from 'pinia';

const vuetify = createVuetify({
    components,
    directives,
    icons: {
        defaultSet: 'mdi',
    },
});

const i18n = createI18n({
  locale: 'en',
  messages: {
    en: en,
    ru: ru,
  },
});

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(vuetify);
app.use(router);
app.use(i18n);

app.mount('#app');
