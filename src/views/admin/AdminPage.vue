<script setup>
import { useCarsStore } from '../../store/cars';
import CarCard from '../../components/CarCard.vue';
import AdminForm from './AdminForm.vue';
import { ref, computed, onMounted } from 'vue';

const carsStore = useCarsStore();
const cars = computed(() => carsStore.cars);
const requests = ref([]);
const carDetailsDialog = ref(false); 
const showForm = ref(false);
const selectedCar = ref(null);

const openForm = () => {
    selectedCar.value = null;
    showForm.value = true;
};

const editCar = car => {
    selectedCar.value = car;
    showForm.value = true;
};

const closeForm = () => {
    showForm.value = false;
};

const deleteCar = id => {
    carsStore.deleteCar(id);
};

const showCarDetails = (request) => {
  const car = carsStore.getCarById(request.carId);
  if (car) {
    selectedCar.value = car;
    carDetailsDialog.value = true;
  } else {
    alert('Машина не найдена');
  }
};

const isAdmin = true; 

const getRequestsForCar = (carId) => {
  return requests.value.filter(request => request.carId === carId);
};

const approveRental = (request) => {
  try {
    carsStore.updateRentalRequest(request.id, { status: 'approved' });
    const car = carsStore.getCarById(request.carId);
    if (car) {
      carsStore.updateCar({ ...car, available: false });
    }      
    alert(`Аренда для ${request.renterName} одобрена!`);
  } catch (error) {
    console.error("Ошибка при одобрении аренды:", error);
    alert("Произошла ошибка. Попробуйте снова.");
  }
};

const rejectRental = (request) => {
  try {
    carsStore.updateRentalRequest(request.id, { status: 'rejected' });
    carsStore.removeRequest(request.id)
    requests.value = requests.value.filter(r => r.id !== request.id);

    alert(`Аренда для ${request.renterName} отклонена!`);
  } catch (error) {
    console.error("Ошибка при отклонении аренды:", error);
    alert("Произошла ошибка. Попробуйте снова.");
  }
};

onMounted(() => {
  requests.value = carsStore.fetchRentalRequests()
})

</script>

<template>
  <v-container>
    <v-btn @click="openForm" theme="dark" color="dark" variant="flat" class="mb-5">Добавить машину</v-btn>
    <v-row >
      <v-col v-for="car in carsStore.cars" :key="car.id" cols="12" md="4">
        <v-card class="card pa-5">
          <v-card-title><h3>{{ car.model }}</h3></v-card-title>
          <v-card-text>
            <div class="card-desc">
              <p>Цена: {{ car.price }}$</p>
              <p v-if="isAdmin">Доступные заявки: {{ getRequestsForCar(car.id).length }}</p>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-divider></v-divider>
  <h1 class="py-5">Ваши Заявки</h1>
  <v-row>
    <v-col v-for="request in requests" :key="request.id" cols="12" md="6"> {{ console.log("MY REQS - ", requests) }}
      <v-card class="card pa-5" >
        <v-card-title><h3>{{ request.renterName }}</h3></v-card-title>
        <v-card-text>
          <div class="card-desc">
            <p>Дата начала аренды: {{ request.rentalStartDate }}</p>
            <p>Дата окончания аренды: {{ request.rentalEndDate }}</p>
            <p>Статус: {{ request.status === 'approved' ? 'Одобрено' : 'Ожидает одобрения' }}</p>
          </div>
          <div class="buttons">
            <v-btn color="grey" @click="showCarDetails(request)">Посмотреть</v-btn>
            <div>
              <v-btn v-if="request.status !== 'approved'" theme="red" color="green" variant="flat" @click="approveRental(request)">Одобрить</v-btn>
              <v-btn v-if="request.status !== 'approved'" color="error" @click="rejectRental(request)" class="ml-3">Отклонить</v-btn>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-col>

    <v-dialog v-model="carDetailsDialog" max-width="600">
      <v-card>
        <v-card-title>Детали машины</v-card-title>
        <v-card-text v-if="selectedCar">
          <p>Модель: {{ selectedCar.model }}</p>
          <p>Цена: {{ selectedCar.price }}$</p>
          <p>Год: {{ selectedCar.year }}</p>
          <p>Тип двигателя: {{ selectedCar.engineType }}</p>
          <p>Трансмиссия: {{ selectedCar.transmission }}</p>
          <p>Топливо: {{ selectedCar.fuel }}</p>
          <v-carousel show-arrows>
            <v-carousel-item v-for="(image, index) in selectedCar.images" :key="index">
              <v-img :src="image" alt="Car image" aspect-ratio="16/9" />
            </v-carousel-item>
          </v-carousel>
        </v-card-text>
        <v-card-actions>
          <v-btn color="error" variant="flat" text @click="carDetailsDialog = false">Закрыть</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>

  <h1 class="py-5">Ваши машины</h1>
    <v-row>
      <v-col v-for="car in cars" :key="car.id" cols="12" md="6">
        <CarCard :car="car" @edit="editCar" @delete="deleteCar" :isAdmin="true"/>
      </v-col>
    </v-row>
    <AdminForm v-if="showForm" :car="selectedCar" @close="closeForm" />
  </v-container>
</template>
