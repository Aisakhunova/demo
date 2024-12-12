import { createApp } from 'vue';
import App from './App.vue';
import { createVuetify } from 'vuetify';
import 'vuetify/styles'; // Import global styles
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { setupI18n } from './i18n';
import '@mdi/font/css/materialdesignicons.css'; 

import {router} from './router';
import { createPinia } from 'pinia'; 

const vuetify = createVuetify({
    components,
    directives,
    icons: {
        defaultSet: 'mdi',
      },
});

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(vuetify);
app.use(router);
setupI18n(app)
app.mount('#app');
