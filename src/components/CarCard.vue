<script setup>
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import RentForm from '../views/home/RentForm.vue';
import { useCarsStore } from '../stores/cars';

const props = defineProps({
  car: Object,
  isAdmin: {
    default: false,
    type: Boolean
  }
});

const router = useRouter();
const carsStore = useCarsStore();
const showRentForm = ref(false);

const toggleRentalForm = () => {
  showRentForm.value = !showRentForm.value;
};

const handleRentalSubmit = (rentalData) => {
  console.log('Форма аренды отправлена', rentalData);
};

const navigateToCarDetail = () => {
  router.push({ name: 'car-detail', params: { carId: props.car.id } });
};
</script>

<template>
  <v-card class="card pa-1">
    <v-card-text>
      

      <v-row class="pb-8">
        

        <v-col cols="12" md="12">
          <v-card class="pa-5 card">
          <h2>{{ props.car.model }}</h2>
          <h2 class="mb-1">{{ props.car.year }}</h2>
          <h3 class="text-green">{{ props.car.price.day }}$ /день,</h3>
          <h3 class="text-green">{{ props.car.price.week }}$ /неделя,</h3>
          <h3 class="mb-3 text-green">{{ props.car.price.modnth }}$ /месяц</h3>
          <div class="info-table">
            <div class="info-row">
              <div class="info-title"><strong>Город:</strong></div>
              <div class="info-title"><strong>Партнер</strong></div>
              <div class="info-title"><strong>Тип двигателя:</strong></div>
              <div class="info-title"><strong>Трансмиссия:</strong></div>
              <div class="info-title"><strong>Тип топлива:</strong></div>
            </div>
            <div class="info-row">
              <div class="info-value">{{ props.car.city }}</div>
              <div class="info-value">{{ props.car.partner }}</div>
              <div class="info-value">{{ props.car.engineType }}</div>
              <div class="info-value">{{ props.car.transmission }}</div>
              <div class="info-value">{{ props.car.fuel }}</div>
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
              <div class="info-value">{{ props.car.fuelConsumption.cityFuel }}</div>
              <div class="info-value">{{ props.car.fuelConsumption.highway }}</div>
              <div class="info-value">{{ props.car.fuelConsumption.combined }}</div>
            </div>
          </div>
          <h3 v-if="car.available" class="success--text mt-3 mb-5" >Машина доступна</h3>
        <h3 v-else class="red--text mt-3">
          Забронирована до: 
          {{ carsStore.getCarRentalEndDate(car.id) || 'Нет данных' }}
        </h3>
          </v-card>

        </v-col>
      </v-row>
      <v-carousel delimiter-icon="mdi-square" show-arrows="hover" class="responsive-carousel">
        <v-carousel-item v-for="(image, index) in props.car.images" :key="index" >
          <v-img :src="image" alt="Car image" aspect-ratio="16/9" cover/>
        </v-carousel-item>
      </v-carousel>
    </v-card-text>

    <div v-if="props.isAdmin" class="px-2">
      <div >
        <v-btn color="green" variant="flat" @click="$emit('edit', car)" width="100%">Редактировать</v-btn>
      </div>
      <div>
        <v-btn theme="red" color="error" variant="flat" @click="$emit('delete', car.id)" width="100%" class="mt-1">Удалить</v-btn>
      </div>
    </div>

    <div v-else class="px-2">
      <v-btn 
        :class="car.available ? 'success--text' : 'red--text'" 
        @click="toggleRentalForm" variant="flat" 
        :disabled="!car.available"
        width="100%"
        color="green"
      >
        Арендовать
      </v-btn>
    </div>
    <div class="px-2">
      <v-btn theme="grey" color="grey" variant="flat" @click="navigateToCarDetail" width="100%" class="mt-1 ">Подробнее</v-btn>
    </div>
  </v-card>
  <RentForm
    :showRentalForm="showRentForm"
    :carId="props.car.id"
    @toggleRentalForm="toggleRentalForm"
    @submitRentalForm="handleRentalSubmit"
  />
</template>

<style>

.card {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1), 0 6px 20px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  transition: box-shadow 0.3s ease-in-out;
  background-color: rgb(218, 218, 224);
}

.card:hover {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2), 0 12px 30px rgba(0, 0, 0, 0.2);
}

.red--text {
  color: red !important;
}

.card-desc{
  padding: 5px 5px 5px 0;
}

.success--text{
  color: green;
}

.buttons{
  display: flex;
}
.v-carousel__controls {
  display: none;
}

.buttons-wrapper{
  display: flex;
  flex-direction: column;
  align-items: center;
}

.buttons-wrapper-1{
  display: flex;
  flex-direction: column;
}

@media(max-width: 600px){
  .buttons{
    flex-direction: column;
    align-items: end;
    gap: 16px;
  }
}

.responsive-carousel {
  max-height: 200px;
}

@media (max-width: 1000px) {
  .responsive-carousel {
    max-height: 400px;
  }
}

@media (max-width: 480px) {
  .responsive-carousel {
    max-height: 200px;
  }
}
</style>
../stores/cars