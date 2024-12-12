<script>
import { ref } from 'vue';

export default {
  setup() {
    const drawer = ref(false);
    const menuItems = [
      { title: 'Главная', to: '/' },
      { title: 'Панель управления', to: '/admin' },
    ];

    const toggleDrawer = () => {
      drawer.value = !drawer.value;
    };

    return {
      drawer,
      menuItems,
      toggleDrawer,
    };
  },
};
</script>
<template>
  <v-app class="wrapper">

    <v-app-bar app class="appBar">
      <v-app-bar-nav-icon @click="toggleDrawer" prepend-icon="square_foot" />
      <v-toolbar-title>Car Sharing Demo</v-toolbar-title>
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
.v-navigation-drawer__content{
  background-color: rgba(23, 21, 31, 0.649);
  color: white;
}

</style>
