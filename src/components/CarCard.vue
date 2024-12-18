<script setup>
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import RentForm from '../views/home/RentForm.vue';
import { useCarsStore } from '../stores/cars';
import { useI18n } from 'vue-i18n';

const {t, locale} = useI18n()

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
  console.log(t('rentFormSent'), rentalData);
};

const navigateToCarDetail = () => {
  router.push({ 
    name: 'car-detail', 
    params: { carId: props.car.id}, 
    query: {isAdmin: props.isAdmin} 
  });
};

</script>

<template>
  <v-card class="card pa-1" @click="navigateToCarDetail">
    <v-card-text>
      <v-row class="pb-8">
        <v-col cols="12" md="12">
          <v-card class="pa-5 card">
            <h2>{{ props.car.model }}</h2>
            <h2 class="mb-1">{{ props.car.year }}</h2>
            <h3 class="text-green">{{ props.car.price.day }} zł/{{ $t('day') }},</h3>
            <h3 class="text-green">{{ props.car.price.week }} zł/{{ $t('week') }},</h3>
            <h3 class="mb-3 text-green">{{ props.car.price.month }} zł/{{ $t('month') }}</h3>
            <h3 v-if="car.available" class="success--text mt-3 mb-5" >{{ $t('carIsAvailable') }}</h3>
            <h3 v-else class="red--text mt-3">
              {{ $t('orderedUntill') }}: 
              {{ carsStore.getCarRentalEndDate(car.id) || $t('noData') }}
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
        <v-btn 
          color="grey" 
          variant="flat" 
          @click.stop="$emit('edit', car)" 
          width="100%"
          >
            {{ $t('edit') }}
        </v-btn>
      </div>
      <div>
        <v-btn 
          theme="red" 
          color="black" 
          variant="flat" 
          @click.stop="$emit('delete', car.id)" 
          width="100%"
          class="mt-1"
        >
          {{ $t('delete') }}
        </v-btn>
      </div>
    </div>

    <div v-else class="px-2">
      <v-btn 
        :class="car.available ? 'success--text' : 'red--text'" 
        @click.stop="toggleRentalForm" variant="flat" 
        :disabled="!car.available"
        width="100%"
        color="green"
      >
        {{ $t('rent') }}
      </v-btn>
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