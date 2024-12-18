<script setup>
import { ref, computed, watch } from 'vue';
import { useCarsStore } from '../../stores/cars';
import CarCard from '../../components/CarCard.vue';
import { useI18n } from 'vue-i18n';

const carsStore = useCarsStore();
const {t, locale} = useI18n()
const isNavigationOpen = ref(false)

const isFilterOpen = ref({
  city: false,
  model: false,
  type: false,
  price: false,
});

const toggleFilter = (filter) => {
  isFilterOpen.value[filter] = !isFilterOpen.value[filter];
};

const searchCity = ref(t('cities.warsaw'));
const searchModel = ref('');
const searchPartner = ref('')
const priceRange = ref([0, 500]); 
const pricePeriod = ref('day'); 
const consumptionRange = ref([0, 10])
const consumptionType = ref(t('cityFuel'))
const searchType = ref('')

const pricePeriods = [
  { en: "day", ru: "день", value: 'day' },
  { en: "week", ru: "неделя", value: 'week' },
  { en: "month", ru: "месяц", value: 'month' }
];

const consumptionTypes = [
  { en: "Fuel consumption in the city", ru: "Расход топлива в городе", value: 'cityFuel' },
  { en: "Fuel consumption on the highway", ru: "Расход топлива на шоссе", value: 'highwayFuel' },
  { en: "Fuel consumption in combined terrain", ru: "Расход топлива в смешенной местности", value: 'combinedFuel' }
];

const cities = [
  { en: "Warsaw", ru: "Варшава" },
  { en: "Krakow", ru: "Краков" },
  { en: "Poznan", ru: "Познань" }
]

const localizedCities = computed(() =>
  cities.map(city => city[locale.value])
);

const localizedPricePeriods = computed(() =>
  pricePeriods.map(item => item[locale.value])
);

const localizedConsumptionTypes = computed(() =>
  consumptionTypes.map(item => item[locale.value])
);

watch(locale, (newLocale) => {
  if (searchCity.value) {
    const cityMatch = cities.find(
      (item) => item[locale.value === 'en' ? 'ru' : 'en'] === searchCity.value
    );
    const pricePeriodMatch = pricePeriods.find(
      (item) => item[locale.value === 'en' ? 'ru' : 'en'] === pricePeriod.value
    );
    const consumptionTypeMatch = consumptionTypes.find(
      (item) => item[locale.value === 'en' ? 'ru' : 'en'] === consumptionType.value
    );
    const typeMatch = types.find(
      (item) => item[locale.value === 'en' ? 'ru' : 'en'] === searchType.value
    );

    if (cityMatch) {
      searchCity.value = cityMatch[locale.value];
    }
    if (pricePeriodMatch) {
      pricePeriod.value = pricePeriodMatch[locale.value];
    }
    if (consumptionTypeMatch) {
      consumptionType.value = consumptionTypeMatch[locale.value];
    }
    if (typeMatch) {
      searchType.value = typeMatch[locale.value];
    }
  }
});

const models = ['BMW', 'Tesla', 'Ford', 'Honda', 'Toyota', 'Chevrolet' ];
const partners = ['Coca Cola', 'Fanta', 'Sprite'];

const types = [
  { en: "Courier", ru: "Курьер" },
  { en: "Taxi", ru: "Такси" },
  { en: "Bike", ru: "Мопед" },
  { en: "Other", ru: "Другое" },
]

const localizedTypes = computed(() =>
  types.map(item => item[locale.value])
);

const filteredCars = computed(() => {
  return carsStore.cars.filter((car) => {
    const carPrice1 = pricePeriods.find(item => item[locale.value] === pricePeriod.value); 
    console.log('carPrice1-', carPrice1)
    const cons1 = consumptionTypes.find(item => item[locale.value] === consumptionType.value); 
    const carPrice = car.price[carPrice1['en']]
    const cons = car.fuelConsumption[cons1.value]

    const matchesCity = searchCity.value
      ? car.city[locale.value].toLowerCase().includes(searchCity.value.toLowerCase())
      : true;
    const matchesModel = searchModel.value
      ? car.model.toLowerCase().includes(searchModel.value.toLowerCase())
      : true;
    const matchesType = searchType.value
      ? car.type[locale.value].toLowerCase().includes(searchType.value.toLowerCase())
      : true;
    const matchesPrice =
      carPrice >= priceRange.value[0] && carPrice <= priceRange.value[1];
    const matchesConsumption =
      cons >= consumptionRange.value[0] && cons <= consumptionRange.value[1];
    const matchesPartner = searchPartner.value
      ? car.partner.toLowerCase().includes(searchPartner.value.toLowerCase())
      : true;

    return matchesCity && matchesModel && matchesPrice && matchesPartner && matchesConsumption && matchesType;
  });
});

</script>

<template>
  <v-container class="wrapper">
    <v-btn
      class="d-md-none py-7"
      block
      color="primary"
      @click="isNavigationOpen = !isNavigationOpen"
    >
      {{ $t('filters') }}
      <v-icon>mdi-filter-variant</v-icon>
    </v-btn>

    <v-expand-transition>
      <div v-if="isNavigationOpen || !$vuetify.display.mobile" class="filters-container">
        <v-card flat outlined >
          <v-row>
            <v-col cols="12" md="2" class="mb-2 pb-0">
              <v-select
                v-model="searchCity"
                :items="localizedCities"
                :label="$t('city')"
                outlined
                clearable
                dense
              />
            </v-col>

            <v-col cols="12" md="2" class="mb-0 pb-0">
              <v-select
                v-model="searchModel"
                :items="models"
                :label="$t('model')"
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
              {{ $t('price') }}
                <v-icon>{{ isFilterOpen.price ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
              </v-btn>
                <div v-if="isFilterOpen.price" class="filter-content">
                  <div class="text-end">{{ priceRange[0] }} zł - {{ priceRange[1] }} zł</div>
                  <v-range-slider
                    v-model="priceRange"
                    :min="0"
                    :max="500"
                    :label="$t('priceRange')"
                    :step="5"
                    outlined
                    ticks
                  />
                  <v-select
                    v-model="pricePeriod"
                    :items="localizedPricePeriods"
                    :label="$t('priceFor')"
                    outlined
                  />
                </div>
              </v-col>

              <v-col cols="12" md="2" class="mb-0 pb-0" >
                <v-select
                  v-model="searchType"
                  :items="localizedTypes"
                  :label="$t('rentType')"
                  outlined
                  clearable
                  dense
                />
              </v-col>

              <v-col cols="12" md="2" class="mb-0 pb-0" >
                <v-select
                  v-model="searchPartner"
                  :items="partners"
                  :label="$t('partner')"
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
                  {{ t('fuelConsumption') }}
                  <v-icon>{{ isFilterOpen.consumption ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
                </v-btn>
                  <div v-if="isFilterOpen.consumption" class="filter-content">
                    <div class="text-end">{{ consumptionRange[0] }} - {{ consumptionRange[1] }} </div>
                    <v-range-slider
                      v-model="consumptionRange"
                      :min="0"
                      :max="10"
                      :label="$t('fuelConsumption')"
                      :step="0.1"
                      outlined
                      ticks
                    />
                    <v-select
                      v-model="consumptionType"
                      :items="localizedConsumptionTypes"
                      :label="$t('consumptionType')"
                      outlined
                    />
                  </div>
              </v-col>
            </v-row>
          </v-card>
        </div>
    </v-expand-transition>

    <v-row class="mt-7">
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

.filters-container {
  background: white;
  border-bottom: 1px solid #ccc;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative; 
  z-index: 10;
}

</style>
