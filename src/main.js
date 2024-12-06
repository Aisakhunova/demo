import { createApp } from 'vue';
import App from './App.vue';
import { createVuetify } from 'vuetify';
import 'vuetify/styles'; // Import global styles
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import '@mdi/font/css/materialdesignicons.css'; // Шрифты иконок MDI

import {router} from './router';
import { createPinia } from 'pinia'; 

const vuetify = createVuetify({
    components,
    directives,
    icons: {
        defaultSet: 'mdi', // Убедитесь, что используется 'mdi'
      },
});

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(vuetify);
app.use(router);
app.mount('#app');
