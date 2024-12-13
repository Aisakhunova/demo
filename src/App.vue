<script>
import { useI18n } from 'vue-i18n';
import { ref, computed, onMounted } from 'vue';
import eventBus from './eventBus'; // Импортируем Event Bus

export default {
  setup() {
    const { t, i18n } = useI18n(); // Извлекаем t и i18n через useI18n
    const drawer = ref(false);

    // Используем computed для реактивного изменения menuItems при изменении локали
    const menuItems = computed(() => [
      { title: t('main'), to: '/' },
      { title: t('admin'), to: '/admin' },
    ]);

    const toggleDrawer = () => {
      drawer.value = !drawer.value;
    };

    // Функция для смены локали
    const setLocale = (newLocale) => {
      console.log(`Setting locale to: ${newLocale}`); // Логируем изменение локали
      eventBus.emit('change-locale', newLocale); // Отправляем событие смены локали
    };

    // Слушаем событие смены локали и обновляем i18n
    onMounted(() => {
      eventBus.on('change-locale', (newLocale) => {
        console.log(`Received locale change event: ${newLocale}`);
        if (i18n && i18n.global) {
          i18n.global.locale = newLocale; // Обновляем локаль через i18n
        } else {
          console.error('i18n или i18n.global не инициализировано');
        }
      });
    });

    return {
      drawer,
      menuItems,
      toggleDrawer,
      setLocale,
    };
  },
};
</script>

<template>
  <v-app class="wrapper">
    <v-app-bar app class="appBar">
      <v-app-bar-nav-icon @click="toggleDrawer" prepend-icon="square_foot" />
      <v-toolbar-title>Car Sharing Demo </v-toolbar-title>
      <div class="locale-changer">
        <select v-model="$i18n.locale">
          <option v-for="locale in $i18n.availableLocales" :key="`locale-${locale}`" :value="locale">{{ locale }}</option>
        </select>
      </div>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" app>
      <v-list>
        <v-list-item
          v-for="(item, index) in menuItems"
          :key="index"
          :to="item.to"
          router
        >
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<style>
.v-toolbar__content,
.v-navigation-drawer__content {
  background-color: rgba(23, 21, 31, 0.649);
  color: white;
}
</style>
