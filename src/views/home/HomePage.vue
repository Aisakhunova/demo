<script setup>
import { ref, computed } from 'vue';
import { useCarsStore } from '../../store/cars';
import CarCard from '../../components/CarCard.vue';

const carsStore = useCarsStore();

const searchCity = ref('');
const searchModel = ref('');
const minPrice = ref(null);
const maxPrice = ref(null);

const filteredCars = computed(() => {
  return carsStore.cars.filter((car) => {
    const matchesCity = searchCity.value
      ? car.city.toLowerCase().includes(searchCity.value.toLowerCase())
      : true;
    const matchesModel = searchModel.value
      ? car.model.toLowerCase().includes(searchModel.value.toLowerCase())
      : true;
    const matchesPrice =
      (!minPrice.value || car.price >= minPrice.value) &&
      (!maxPrice.value || car.price <= maxPrice.value);

    return matchesCity && matchesModel && matchesPrice;
  });
});
</script>

<template>
  <v-container class="wrapper">
    <!-- Форма поиска -->
    <v-row class="mb-4">
      <v-col cols="12" md="4">
        <v-text-field
          v-model="searchCity"
          label="Город"
          outlined
          clearable
        />
      </v-col>
      <v-col cols="12" md="4">
        <v-text-field
          v-model="searchModel"
          label="Модель"
          outlined
          clearable
        />
      </v-col>
      <v-col cols="6" md="2">
        <v-text-field
          v-model="minPrice"
          label="Мин. цена"
          type="number"
          outlined
          clearable
        />
      </v-col>
      <v-col cols="6" md="2">
        <v-text-field
          v-model="maxPrice"
          label="Макс. цена"
          type="number"
          outlined
          clearable
        />
      </v-col>
    </v-row>
    
    <v-row>
      <v-col v-for="car in filteredCars" :key="car.id" cols="12" md="6">
        <CarCard :car="car" />
      </v-col>
    </v-row>
  </v-container>
</template>

