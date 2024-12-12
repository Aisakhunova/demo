<script setup>
import { useRoute, useRouter } from 'vue-router'; 
import { useCarsStore } from '../store/cars';
import { ref, onMounted } from 'vue';

const route = useRoute();
const router = useRouter(); 
const carId = route.params.carId;
const car = ref(null);

const carsStore = useCarsStore();

onMounted(() => {
  car.value = carsStore.getCarById(Number(carId)); 
});

const goBack = () => {
  router.go(-1); 
};

// Информация о компании
const companyInfo = ref({
  name: "Car Rentals Ltd.",
  rating: 4.5,
  reviewsCount: 120,
  description: "Car Rentals Ltd. offers a wide range of vehicles for all your rental needs. Whether you're looking for a luxury ride or an economy car, we have something for you!",
  contact: "+123 456 789",
  location: "123 Main Street, Cityville"
});
</script>

<template>
  <v-container>
    <v-btn @click="goBack" color="grey" class="mb-3">
      Назад
    </v-btn>
    <v-card class="pa-5">
      <v-row>
        <v-col cols="12" md="7">
          <div v-if="car">
            <v-carousel show-arrows :show-indicators="false" class="mt-3">
              <v-carousel-item v-for="(image, index) in car?.images" :key="index">
                <v-img 
                  :src="image" 
                  alt="Car image" 
                  aspect-ratio="16/9" 
                  cover
                  class="fill-height"
                  :lazy="false" 
                />
              </v-carousel-item>
            </v-carousel>
          </div>
        </v-col>

        <v-col cols="12" md="5">
          <v-card class="pa-5">
          <h2 class="mb-1">{{ car?.model }} {{ car?.year }}</h2>
          <h3 class="mb-3 text-green">{{ car?.price.day }}$ /день, {{ car?.price.week }}$ /неделя, {{ car?.price.month }}$ /месяц</h3>
          <div class="info-table">
            <div class="info-row">
              <div class="info-title"><strong>Тип двигателя:</strong></div>
              <div class="info-title"><strong>Трансмиссия:</strong></div>
              <div class="info-title"><strong>Тип топлива:</strong></div>
            </div>
            <div class="info-row">
              <div class="info-value">{{ car?.engineType }}</div>
              <div class="info-value">{{ car?.transmission }}</div>
              <div class="info-value">{{ car?.fuel }}</div>
            </div>
          </div>
          <v-divider class="mt-6"></v-divider>
          <h3 class="mt-2">Расход топлива</h3>
          <div class="info-table">
            <div class="info-row">
              <div class="info-title"><strong>Город:</strong></div>
              <div class="info-title"><strong>Шоссе:</strong></div>
              <div class="info-title"><strong>Смешанный:</strong></div>
            </div>
            <div class="info-row">
              <div class="info-value">{{ car?.fuelConsumption.cityFuel }}</div>
              <div class="info-value">{{ car?.fuelConsumption.highway }}</div>
              <div class="info-value">{{ car?.fuelConsumption.combined }}</div>
            </div>
          </div>
          </v-card>

          <v-card class="pa-5 mt-5">
            <h4 class="mb-1">Автор объявления</h4>
            <v-row dense>
              <v-col cols="auto">
                <div class="py-1"><v-icon color="black">mdi-account</v-icon></div>
                <div class="py-1"><v-icon color="black">mdi-phone</v-icon></div>
                <div class="pt-1"><v-icon color="black">mdi-map-marker</v-icon></div>
              </v-col>
              <v-col cols="auto">
                <div class="py-1">{{ companyInfo.name }}</div>
                <div class="py-1">{{ companyInfo.contact }}</div>
                <div class="pt-1">{{companyInfo.location  }}</div>
              </v-col>
              <v-col cols="12" md="12">
                <v-icon color="yellow">mdi-star</v-icon>
                  <span class="ml-2">{{ companyInfo.rating }} / 5</span>
                  <span class="ml-4">({{ companyInfo.reviewsCount }} отзывов)</span>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
      
      <v-card-text>
        <v-row>
          <v-col cols="12" md="12">
            <v-row>
              <v-col cols="12" md="12" v-if="car?.description">
                <h4 class="text-h6">Описание</h4>
                <strong>{{ car?.description }}</strong>
              </v-col>
              <v-col cols="12" md="12" v-if="car?.checkboxes?.length">
                <v-chip-group column>
                  <v-chip v-for="(option, index) in car?.checkboxes" :key="index" class="ma-1">
                    {{ option }}
                  </v-chip>
                </v-chip-group>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
    </v-card-text>
    </v-card>
  </v-container>
</template>