<script setup>
import { useRoute, useRouter } from 'vue-router'; 
import { useCarsStore } from '../stores/cars';
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';

const route = useRoute();
const router = useRouter(); 
const carId = route.params.carId;
const car = ref(null)
const {t, locale} = useI18n()

const carsStore = useCarsStore();

onMounted(() => {
  car.value = carsStore.getCarById(Number(carId)); 
  console.log("CAR - ", car.value)
});

const goBack = () => {
  router.go(-1); 
};

const companyInfo = ref({
  name: "Car Rentals Ltd.",
  rating: 4.5,
  reviewsCount: 120,
  contact: "+123 456 789",
  location: "123 Main Street, Cityville"
});
</script>

<template>
  <v-container>
    <v-btn @click="goBack" color="grey" class="mb-3">
      <v-icon color="black" class="mr-4" >mdi-chevron-left</v-icon>
    </v-btn>
    <v-card class="pa-5">
      <v-row>
        <v-col cols="12" md="7">
          <div v-if="car">
            <v-carousel show-arrows :show-indicators="false" class="mt-3 responsive-dialog-carousel">
              <v-carousel-item v-for="(image, index) in car?.images" :key="index">
                <v-img 
                  :src="image" 
                  alt="Car image" 
                  aspect-ratio="16/9" 
                  cover
                  :lazy="false" 
                />
              </v-carousel-item>
            </v-carousel>
          </div>
        </v-col>

        <v-col cols="12" md="5">
          <v-card class="pa-5">
          <h2 class="mb-1">{{ car?.model }} {{ car?.year }}</h2>
          <h3 class="text-green">{{ car?.price.day }} zł/{{ $t('day') }},</h3>
          <h3 class="text-green">{{ car?.price.week }} zł/{{ $t('week') }},</h3>
          <h3 class="mb-3 text-green">{{ car?.price.month }} zł/{{ $t('month') }}</h3>
          <div class="info-table">
            <div class="info-row">
              <div class="info-title"><strong>{{ $t('rentType') }}:</strong></div>
              <div class="info-title"><strong>{{ $t('city') }}:</strong></div>
              <div class="info-title"><strong>{{ $t('engineVolume') }}:</strong></div>
              <div class="info-title"><strong>{{ $t('transmission') }}:</strong></div>
              <div class="info-title"><strong>{{ $t('fuelType') }}:</strong></div>
            </div>
            <div class="info-row">
              <div class="info-value">{{ car?.type[locale] }}</div>
              <div class="info-value">{{ car?.city[locale] }}</div>
              <div class="info-value">{{ car?.engineType }}</div>
              <div class="info-value">{{ car?.transmission[locale] }}</div>
              <div class="info-value">{{ car?.fuel[locale] }}</div>
            </div>
          </div>
          <v-divider class="my-6"></v-divider>
          <div class="info-table">
            <div class="info-row">
              <div class="info-title"><strong>{{ $t('cityFuel') }}:</strong></div>
              <div class="info-title"><strong>{{ $t('highwayFuel') }}:</strong></div>
              <div class="info-title"><strong>{{ $t('combinedFuel') }}:</strong></div>
            </div>
            <div class="info-row">
              <div class="info-value">{{ car?.fuelConsumption.cityFuel }}</div>
              <div class="info-value">{{ car?.fuelConsumption.highway }}</div>
              <div class="info-value">{{ car?.fuelConsumption.combined }}</div>
            </div>
          </div>
          </v-card>
        </v-col>
      </v-row>
      <v-row class="d-flex align-baseline">
        <v-col cols="12" md="7">
            <v-row>
              <v-col cols="12" md="12" v-if="car?.description[locale]">
                <h4 class="text-h6">{{ $t('description') }}</h4>
                <strong>{{ car?.description[locale] }}</strong>
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
       <v-col cols="12" md="5">
        <v-card class="pa-5 mt-5">
            <h4 class="mb-1">{{ $t('author') }}</h4>
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
                  <span class="ml-4">({{ companyInfo.reviewsCount }} {{ $t('reviews') }})</span>
              </v-col>
            </v-row>
          </v-card>
       </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>