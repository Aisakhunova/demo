<script setup>
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import RentForm from '../views/home/RentForm.vue';
import { useCarsStore } from '../store/cars';

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
  <v-card class="card pa-5">
    <v-card-title><h3>{{ props.car.model }}</h3></v-card-title>

    <v-card-text>
      <div class="card-desc">
        <h4>Город: {{ props.car.city }}</h4>
        <p>Цена: {{ props.car.price }}$</p>
        <p v-if="car.available" class="success--text">Машина доступна</p>
        <p v-else class="red--text">
          Забронирована до: 
          {{ carsStore.getCarRentalEndDate(car.id) || 'Нет данных' }}
        </p>
      </div>

      <v-carousel show-arrows :show-indicators="false" height="300">
        <v-carousel-item v-for="(image, index) in props.car.images" :key="index">
          <v-img :src="image" alt="Car image" aspect-ratio="16/9" cover/>
        </v-carousel-item>
      </v-carousel>
    </v-card-text>

    <v-card-actions class="buttons">
      <div v-if="props.isAdmin" class="buttons-right">
        <v-btn theme="dark" variant="flat" @click="$emit('edit', car)">Редактировать</v-btn>
        <v-btn theme="red" color="error" variant="flat" @click="$emit('delete', car.id)">Удалить</v-btn>
      </div>

      <div v-else>
        <v-btn 
          :class="car.available ? 'success--text' : 'red--text'" 
          @click="toggleRentalForm" variant="flat" 
          :disabled="!car.available"
        >
          Арендовать
        </v-btn>
      </div>
      <v-btn theme="dark" variant="flat"  @click="navigateToCarDetail">Подробнее</v-btn>
    </v-card-actions>

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
  font-size: 20px;
  padding: 5px 5px 5px 0;
}

.success--text{
  color: green;
}

.buttons{
  display: flex;
  justify-content: space-between;
}
.v-carousel__controls {
  display: none;
}

@media(max-width: 600px){
  .buttons{
    flex-direction: column;
    align-items: end;
    gap: 16px;
  }
}
</style>
