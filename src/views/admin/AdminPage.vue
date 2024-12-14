<script setup>
import { useCarsStore } from '../../stores/cars';
import CarCard from '../../components/CarCard.vue';
import AdminForm from './AdminForm.vue';
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';

const {t, locale} = useI18n()

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
    alert(`${t('rentFor')} ${request.renterName} ${t('approved')}!`);
  } catch (error) {
    console.error($t('rentError'), error);
    alert($t('tryAgain'));
  }
};

const rejectRental = (request) => {
  try {
    carsStore.updateRentalRequest(request.id, { status: 'rejected' });
    carsStore.removeRequest(request.id)
    requests.value = requests.value.filter(r => r.id !== request.id);

    alert(`${t('rentFor')} ${request.renterName} ${t('rejected')}!`);
  } catch (error) {
    console.error($t('rentError2'), error);
    alert($t('tryAgain'));
  }
};

onMounted(() => {
  requests.value = carsStore.fetchRentalRequests()
})

</script>

<template>
  <v-container>
    <v-btn @click="openForm" theme="dark" color="dark" variant="flat" class="mb-5">{{$t('addCar') }}</v-btn>
    <h1 class="py-5">{{$t('yourRequests') }}</h1>
    <v-row>
      <v-col v-for="request in requests" :key="request.id" cols="12" md="3"> {{ console.log("MY REQS - ", requests) }}
        <v-card class="card pa-2" @click="showCarDetails(request)" >
          <v-card-title>{{ request.renterName[locale] }}</v-card-title>
          <v-card-text>
            <div class="card-desc">
              <div>
                <div class="d-flex align-center mb-4">
                  <v-icon color="yellow">mdi-star</v-icon>
                  <span class="ml-2">{{ request.rating }} / 5</span>
                  <span class="ml-4">({{ request.rides }} {{$t('rides') }})</span>
                </div>
              </div>
              <div>
                <strong>{{$t('rentStart') }}:</strong> <p>{{ request.rentalStartDate }}</p>
              </div>
              <div>
                <strong>{{$t('rentEnd') }}:</strong> <p>{{ request.rentalEndDate }}</p>
              </div>
              <p><strong>{{$t('status') }}:</strong> {{ request.status === 'approved' ? $t('approved2') : $t('pending') }}</p>
            </div>
            <div class="buttons-wrapper">
                <v-btn v-if="request.status !== 'approved'" color="grey" variant="flat" @click.stop="approveRental(request)" width="100%" class="mt-1">{{$t('approve') }}</v-btn>
                <v-btn v-if="request.status !== 'approved'" color="black" @click.stop="rejectRental(request)" width="100%" class="mt-1">{{$t('reject') }}</v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-dialog v-model="carDetailsDialog" class="responsive-dialog">
        <v-card>
          <v-card-text v-if="selectedCar">
            <v-row>
              <v-col cols="12" md="12">
                <h2 class="mb-1">{{ selectedCar.model }} {{ selectedCar.year }}</h2>
                <h3 class="mb-3 text-green">{{ selectedCar.price.day }} zł/{{$t('day') }}, {{ selectedCar.price.week }} zł/{{$t('week') }}, {{ selectedCar.price.month }} zł/{{$t('month') }}</h3>
                <div class="info-table">
                  <div class="info-row">
                    <div class="info-title"><strong>{{$t('rentType') }}:</strong></div>
                    <div class="info-title"><strong>{{$t('city') }}:</strong></div>
                    <div class="info-title"><strong>{{$t('engineVolume') }}:</strong></div>
                    <div class="info-title"><strong>{{$t('transmission') }}:</strong></div>
                    <div class="info-title"><strong>{{$t('fuelType') }}:</strong></div>
                  </div>
                  <div class="info-row">
                    <div class="info-value">{{ selectedCar.type[locale] }}</div>
                    <div class="info-value">{{ selectedCar.city[locale] }}</div>
                    <div class="info-value">{{ selectedCar.engineType }}</div>
                    <div class="info-value">{{ selectedCar.transmission[locale] }}</div>
                    <div class="info-value">{{ selectedCar.fuel[locale] }}</div>
                  </div>
                </div>
                <v-divider class="my-6"></v-divider>
                <div class="info-table">
                  <div class="info-row">
                    <div class="info-title"><strong>{{$t('cityFuel') }}:</strong></div>
                    <div class="info-title"><strong>{{$t('highwayFuel') }}:</strong></div>
                    <div class="info-title"><strong>{{$t('combinedFuel') }}:</strong></div>
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
                  <v-col cols="12" md="12" v-if="selectedCar.description[locale]">
                    <h4 class="text-h6">{{$t('description') }}</h4>
                    <strong>{{ selectedCar.description[locale] }}</strong>
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
                <v-carousel delimiter-icon="mdi-square" show-arrows="hover" class="responsive-dialog-carousel">
                  <v-carousel-item v-for="(image, index) in selectedCar.images" :key="index" class="fill-height">
                    <v-img :src="image" alt="Car image" cover />
                  </v-carousel-item>
                </v-carousel>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-btn color="error" variant="flat" text @click="carDetailsDialog = false">{{$t('close') }}</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
  </v-row>

  <h1 class="py-5">{{$t('yourCars') }}</h1>
    <v-row>
      <v-col v-for="car in cars" :key="car.id" cols="12" md="4">
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

.responsive-dialog {
  max-height: 750px;
  max-width: 700px;
}

@media (max-width: 768px) {
  .responsive-dialog {
    max-height: 600px;
  }
}

@media (max-width: 480px) {
  .responsive-dialog {
    max-height: 550px;
  }
}

.responsive-dialog-carousel {
  max-height: 400px;

}

@media (max-width: 768px) {
  .responsive-dialog-carousel {
    max-height: 300px;
  }
}

@media (max-width: 480px) {
  .responsive-dialog-carousel {
    max-height: 200px;
  }
}
</style>
