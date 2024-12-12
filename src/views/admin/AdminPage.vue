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
    <h1 class="py-5">Ваши Заявки</h1>
    <v-row>
      <v-col v-for="request in requests" :key="request.id" cols="12" md="3"> {{ console.log("MY REQS - ", requests) }}
        <v-card class="card pa-2" >
          <v-card-title>{{ request.renterName }}</v-card-title>
          <v-card-text>
            <div class="card-desc">
              <div>
                <div class="d-flex align-center mb-4">
                  <v-icon color="yellow">mdi-star</v-icon>
                  <span class="ml-2">{{ request.rating }} / 5</span>
                  <span class="ml-4">({{ request.rides }} поездок)</span>
                </div>
              </div>
              <div>
                <strong>Дата начала аренды:</strong> <p>{{ request.rentalStartDate }}</p>
              </div>
              <div>
                <strong>Дата окончания аренды:</strong> <p>{{ request.rentalEndDate }}</p>
              </div>
              <p><strong>Статус:</strong> {{ request.status === 'approved' ? 'Одобрено' : 'Ожидает одобрения' }}</p>
            </div>
            <div class="buttons-wrapper">
              <v-btn color="grey" @click="showCarDetails(request)" width="100%">Машина</v-btn>
                <v-btn v-if="request.status !== 'approved'" color="green" variant="flat" @click="approveRental(request)" width="100%" class="mt-1">Одобрить</v-btn>
                <v-btn v-if="request.status !== 'approved'" color="error" @click="rejectRental(request)" width="100%" class="mt-1">Отклонить</v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-dialog v-model="carDetailsDialog" max-width="500" max-height="750">
        <v-card>
          <v-card-text v-if="selectedCar">
            <v-row>
              <v-col cols="12" md="12">
                <h2 class="mb-1">{{ selectedCar.model }} {{ selectedCar.year }}</h2>
                <h3 class="mb-3 text-green">{{ selectedCar.price.day }}$ /день, {{ selectedCar.price.week }}$ /неделя, {{ selectedCar.price.month }}$ /месяц</h3>
                <div class="info-table">
                  <div class="info-row">
                    <div class="info-title"><strong>Тип двигателя:</strong></div>
                    <div class="info-title"><strong>Трансмиссия:</strong></div>
                    <div class="info-title"><strong>Тип топлива:</strong></div>
                  </div>
                  <div class="info-row">
                    <div class="info-value">{{ selectedCar.engineType }}</div>
                    <div class="info-value">{{ selectedCar.transmission }}</div>
                    <div class="info-value">{{ selectedCar.fuel }}</div>
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
                    <div class="info-value">{{ selectedCar.fuelConsumption.cityFuel }}</div>
                    <div class="info-value">{{ selectedCar.fuelConsumption.highway }}</div>
                    <div class="info-value">{{ selectedCar.fuelConsumption.combined }}</div>
                  </div>
                </div>
              </v-col>

              <v-col cols="12" md="12">
                <v-row>
                  <v-col cols="12" md="12" v-if="selectedCar.description">
                    <h4 class="text-h6">Описание</h4>
                    <strong>{{ selectedCar.description }}</strong>
                  </v-col>
                  <v-col cols="12" md="12" v-if="selectedCar.checkboxes?.length">
                    <v-chip-group column>
                      <v-chip v-for="(option, index) in selectedCar.checkboxes" :key="index" class="ma-1">
                        {{ option }}
                      </v-chip>
                    </v-chip-group>
                  </v-col>
                </v-row>
              </v-col>

              <v-col cols="12">
                <v-carousel show-arrows height="300">
                  <v-carousel-item v-for="(image, index) in selectedCar.images" :key="index">
                    <v-img :src="image" alt="Car image" cover />
                  </v-carousel-item>
                </v-carousel>
              </v-col>
            </v-row>ƒ
          </v-card-text>
          <v-card-actions>
            <v-btn color="error" text @click="carDetailsDialog = false">Закрыть</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
  </v-row>

  <h1 class="py-5">Ваши машины</h1>
    <v-row>
      <v-col v-for="car in cars" :key="car.id" cols="12" md="3">
        <CarCard :car="car" @edit="editCar" @delete="deleteCar" :isAdmin="true"/>
      </v-col>
    </v-row>
    <AdminForm v-if="showForm" :car="selectedCar" @close="closeForm" />
  </v-container>
</template>

<style>
.car-flex{
  display: flex;
}

.info-table {
  display: grid;
  grid-template-columns: auto 1fr; 
  row-gap: 8px;
  column-gap: 16px; 
}

.info-title {
  font-weight: bold;
  text-align: left; 
}

.info-value {
  text-align: right;
}
</style>
