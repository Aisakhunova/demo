<script setup>
import { ref, computed } from 'vue';
import { useCarsStore } from '../../stores/cars';
import CarCard from '../../components/CarCard.vue';

const carsStore = useCarsStore();

const isFilterOpen = ref({
  city: false,
  model: false,
  type: false,
  price: false,
});

const toggleFilter = (filter) => {
  isFilterOpen.value[filter] = !isFilterOpen.value[filter];
};

const searchCity = ref('Варшава');
const searchModel = ref('');
const searchPartner = ref('')
const priceRange = ref([0, 500]); 
const pricePeriod = ref('day'); 
const consumptionRange = ref([0, 10])
const consumptionType = ref('cityFuel')
const searchType = ref('')

const pricePeriods = [
  { title: 'День', value: 'day' },
  { title: 'Неделя', value: 'week' },
  { title: 'Месяц', value: 'month' },
];

const consumptionTypes = [
  { title: 'Город', value: 'cityFuel' },
  { title: 'Шоссе', value: 'highway' },
  { title: 'Смешанный', value: 'combined' },
];

const cities = ['Краков', 'Варшава', 'Познань'];
const models = ['BMW', 'Tesla', 'Ford', 'Honda', 'Toyota', 'Chevrolet' ];
const partners = ['Coca Cola', 'Fanta', 'Sprite'];
const types = ['Такси', 'Курьер', 'Мопед', 'Другое']

const filteredCars = computed(() => {
  return carsStore.cars.filter((car) => {
    console.log("car check - ", car)
    console.log('vallllll', searchCity.value);
    const carPrice = car.price[pricePeriod.value]; 
    const consumption = car.fuelConsumption[consumptionType.value]; 
    const matchesCity = searchCity.value
      ? car.city.toLowerCase().includes(searchCity.value.toLowerCase())
      : true;
    const matchesModel = searchModel.value
      ? car.model.toLowerCase().includes(searchModel.value.toLowerCase())
      : true;
    const matchesType = searchType.value
      ? car.type.toLowerCase().includes(searchType.value.toLowerCase())
      : true;
    const matchesPrice =
      carPrice >= priceRange.value[0] && carPrice <= priceRange.value[1];
    const matchesConsumption =
      consumption >= consumptionRange.value[0] && consumption <= consumptionRange.value[1];
    const matchesPartner = searchPartner.value
      ? car.partner.toLowerCase().includes(searchPartner.value.toLowerCase())
      : true;

    return matchesCity && matchesModel && matchesPrice && matchesPartner && matchesConsumption && matchesType;
  });
});
</script>

<template>
  <v-container class="wrapper">
    <v-row>
      <v-col cols="12" md="2" class="mb-2 pb-0">
        <v-select
          v-model="searchCity"
          :items="cities"
          label="Город"
          outlined
          clearable
          dense
        />
      </v-col>

      <v-col cols="12" md="2" class="mb-0 pb-0">
        <v-select
          v-model="searchModel"
          :items="models"
          label="Модель"
          outlined
          clearable
          dense
        />
      </v-col>

      <v-col cols="12" md="8">
        <v-btn
          class="filter-toggle"
          block
          text
          @click="toggleFilter('price')"
        >
          Цена
          <v-icon>{{ isFilterOpen.price ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
        </v-btn>
        <v-slide-y-transition>
          <div v-if="isFilterOpen.price" class="filter-content">
            <div class="text-end">{{ priceRange[0] }} ₽ - {{ priceRange[1] }} ₽</div>
            <v-range-slider
              v-model="priceRange"
              :min="0"
              :max="500"
              label="Диапазон цен"
              :step="5"
              outlined
              ticks
            />
            <v-select
              v-model="pricePeriod"
              :items="pricePeriods"
              label="Цена за"
              outlined
            />
          </div>
        </v-slide-y-transition>
      </v-col>

      <v-col cols="12" md="2" class="mb-0 pb-0" >
        <v-select
          v-model="searchType"
          :items="types"
          label="Тип аренды"
          outlined
          clearable
          dense
        />
      </v-col>

      <v-col cols="12" md="2" class="mb-0 pb-0" >
        <v-select
          v-model="searchPartner"
          :items="partners"
          label="Партнер"
          outlined
          clearable
          dense
        />
      </v-col>

      <v-col cols="12" md="8">
        <v-btn
          class="filter-toggle"
          block
          text
          @click="toggleFilter('consumption')"
        >
          Расход топлива
          <v-icon>{{ isFilterOpen.consumption ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
        </v-btn>
        <v-slide-y-transition>
          <div v-if="isFilterOpen.consumption" class="filter-content">
            <div class="text-end">{{ consumptionRange[0] }} - {{ consumptionRange[1] }} </div>
            <v-range-slider
              v-model="consumptionRange"
              :min="0"
              :max="10"
              label="Расход топлива"
              :step="0.1"
              outlined
              ticks
            />
            <v-select
              v-model="consumptionType"
              :items="consumptionTypes"
              label="Тип расхода"
              outlined
            />
          </div>
        </v-slide-y-transition>
      </v-col>
    </v-row>

    <v-row>
      <v-col v-for="car in filteredCars" :key="car.id" cols="12" md="4">
        <CarCard :car="car" />
      </v-col>
    </v-row>
  </v-container>
</template>


<style scoped>
.filter-toggle {
  justify-content: space-between;
}
.filter-content {
  padding: 8px;
  background: #f9f9f9;
  border-radius: 4px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
}
</style>



../../stores/cars