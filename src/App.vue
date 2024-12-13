<script>
import { useI18n } from 'vue-i18n';
import { ref, computed, onMounted } from 'vue';
import eventBus from './eventBus';

export default {
  setup() {
    const { t, i18n } = useI18n();
    const drawer = ref(false);

    const menuItems = computed(() => [
      { title: t('main'), to: '/' },
      { title: t('admin'), to: '/admin' },
    ]);

    const toggleDrawer = () => {
      drawer.value = !drawer.value;
    };

    const setLocale = (newLocale) => {
      console.log(`Setting locale to: ${newLocale}`);
      eventBus.emit('change-locale', newLocale);
    };

    onMounted(() => {
      eventBus.on('change-locale', (newLocale) => {
        console.log(`Received locale change event: ${newLocale}`);
        if (i18n && i18n.global) {
          i18n.global.locale = newLocale;
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
      <div class="locale-changer" >
        <!-- Using v-select for a nicer dropdown experience -->
        <v-select
          v-model="$i18n.locale"
          :items="$i18n.availableLocales"
          item-text="locale"
          item-value="locale"
          class="language-select mr-3"
          width="120"
          dense
          outlined
          hide-details
          @change="setLocale($i18n.locale)"
        />
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

.language-select {
  width: 200px;
  max-width: 100%;
  color: white;
}
</style>
