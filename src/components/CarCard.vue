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
  <v-card class="card pa-1">
    <v-card-title>{{ props.car.model }}</v-card-title>

    <v-card-text>
      <div class="card-desc">
        <h4>Город: {{ props.car.city }}</h4>
        <h4>Тип аренды: {{ props.car.type }}</h4>
        <h4>Цена</h4>
       <div class="pl-3">
        <p> {{ props.car.price.day }}$ в день</p>
        <p>{{ props.car.price.week }}$ в неделю</p>
        <p>{{ props.car.price.month }}$ в месяц</p>
       </div>
       <h4>Расход топлива:</h4>
       <div class="pl-3">
        <p>Город: {{ props.car.fuelConsumption.city }}</p>
        <p>Шоссе: {{ props.car.fuelConsumption.highway }}</p>
        <p>Смешанный: {{ props.car.fuelConsumption.combined }}</p>
       </div>
        <h4>Партнер: {{ props.car.partner }}</h4>
        <p v-if="car.available" class="success--text">Машина доступна</p>
        <p v-else class="red--text">
          Забронирована до: 
          {{ carsStore.getCarRentalEndDate(car.id) || 'Нет данных' }}
        </p>
      </div>

      <v-carousel delimiter-icon="mdi-square" show-arrows="hover" height="120">
        <v-carousel-item v-for="(image, index) in props.car.images" :key="index">
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
</style>
