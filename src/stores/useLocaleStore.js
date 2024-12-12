import { defineStore } from 'pinia';

export const useLocaleStore = defineStore('locale', {
  state: () => ({
    locale: 'ru', 
  }),
  actions: {
    setLocale(newLocale) {
      this.locale = newLocale;
    },
  },
});
