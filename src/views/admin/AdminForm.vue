<script setup>
import { ref, watch, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useCarsStore } from '../../stores/cars';

const {t, locale} = useI18n()

const props = defineProps({
  car: Object, 
});

const emit = defineEmits(['close']); 
const carsStore = useCarsStore();
const show = ref(true);
const currentStep = ref(1);

const cities = [
  { en: "Warsaw", ru: "Варшава" },
  { en: "Krakow", ru: "Краков" },
  { en: "Poznan", ru: "Познань" }
]

const rentalTypes = [
  { en: "Courier", ru: "Курьер" },
  { en: "Taxi", ru: "Такси" },
  { en: "Bike", ru: "Мопед" },
  { en: "Other", ru: "Другое" },
]

const partners = [
   t('partners.cocaCola'),
   t('partners.fanta'),
   t('partners.sprite')
]

const fuelTypes = [
  { en: "Petrol", ru: "Бензин" },
  { en: "Diesel", ru: "Дизель" },
  { en: "Hybrid", ru: "Гибрид" },
  { en: "Electro", ru: "Электричка" },
]

const transmissionTypes = [
  { en: "Auto", ru: "Автомат" },
  { en: "Manual", ru: "Ручная" }
]

const form = ref({
  city: '',
  type: '',
  partner: '',
  model: '',
  priceDay: '',
  priceWeek: '',
  priceMonth: '',
  available: false,
  year: '',
  engineType: '',
  transmission: '',
  fuel: '',
  description: '',
  checkboxes: [], 
  images: [], 
  cityFuel: '',
  highwayFuel: '',
  combinedFuel: '',
});

const availableOptions = ref([
  { label: 'All-wheel drive', value: 'option1' },
  { label: 'Android Auto', value: 'option2' },
  { label: 'Apple CarPlay', value: 'option3' },
  { label: 'AUX input', value: 'option4' },
  { label: 'Blind Spot Warning', value: 'option5' },
  { label: 'Child seat', value: 'option6' },
  { label: 'USB input', value: 'option7' },
  { label: 'Bluetooth', value: 'option8' },
  { label: 'USB charger', value: 'option9' },
  { label: 'GPS', value: 'option10' }
]);

watch(
  () => props.car,
  (newCar) => {
    if (newCar) {
      form.value = { 
        ...newCar, 
        city: newCar.city[locale.value] || '',
        type: newCar.type[locale.value] || '',
        priceDay: newCar.price.day, 
        priceWeek: newCar.price.week, 
        priceMonth: newCar.price.month,
        cityFuel: newCar.fuelConsumption.cityFuel,
        highwayFuel: newCar.fuelConsumption.highway,
        combinedFuel: newCar.fuelConsumption.combined,
        engineType: newCar.engineType,
        transmission: newCar.transmission[locale.value],
        fuel: newCar.fuel[locale.value],
        description: newCar.description[locale.value]
       }; 
    } else {
      form.value = {
        city: '',
        type: '',
        partner: '',
        model: '',
        priceDay: '',
        priceWeek: '',
        priceMonth: '',
        available: false,
        year: '',
        engineType: '',
        transmission: '',
        fuel: '',
        description: '',
        checkboxes: [],
        images: [],
        cityFuel: '',
        highwayFuel: '',
        combinedFuel: '',
      };
    }
  },
  { immediate: true }
);

const save = () => {
  const selectedCity = cities.find(city => city[locale.value] === form.value.city);
  const selectedType = rentalTypes.find(type => type[locale.value] === form.value.type);
  const selectedFuelType = fuelTypes.find(type => type[locale.value] === form.value.fuel);
  const selectedTransType = transmissionTypes.find(type => type[locale.value] === form.value.transmission);

  const requestBody = {
    ...form.value, 
      price: {
        day: form.value.priceDay, 
        week: form.value.priceWeek, 
        month: form.value.priceMonth
      }, 
      fuelConsumption: {
        cityFuel: form.value.cityFuel, 
        highway: form.value.highwayFuel, 
        combined: form.value.combinedFuel
      },
      city: {
        en: selectedCity.en,
        ru: selectedCity.ru
      },
      type: {
        en: selectedType.en,
        ru: selectedType.ru
      },
      transmission: {
        en: selectedTransType.en,
        ru: selectedTransType.ru
      },
      fuel: {
        en: selectedFuelType.en,
        ru: selectedFuelType.ru
      }
  }

  if (props.car) {
    carsStore.updateCar(requestBody); 
  } else {
    carsStore.addCar(requestBody); 
  }

  emit('close'); 
};

const nextStep = () => {
  if (canMoveToNextStep.value) {
    if (currentStep.value < 4) {
      currentStep.value++;
    }
  }
};

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--;
  }
};

const handleFileChange = (event) => {
  const files = event.target.files;
  if (files.length + form.value.images.length > 3) {
    alert(t("imageAlert"));
    return;
  }

  const imageUrls = Array.from(files).map((file) => URL.createObjectURL(file));
  form.value.images = [...form.value.images, ...imageUrls];
};

const isStep1Valid = computed(() => form.value.city && form.value.type && form.value.partner);
const isStep2Valid = computed(() => form.value.model && form.value.priceDay && form.value.priceWeek && form.value.priceMonth && form.value.year && form.value.engineType && form.value.transmission && form.value.fuel && fuelValidation(form.value.cityFuel) && fuelValidation(form.value.highwayFuel) && fuelValidation(form.value.combinedFuel))
const isStep3Valid = computed(() => form.value.description && form.value.checkboxes.length > 0);
const isStep4Valid = computed(() => form.value.images.length > 0);

const canMoveToNextStep = computed(() => {
  if (currentStep.value === 1) return isStep1Valid.value;
  if (currentStep.value === 2) return isStep2Valid.value;
  if (currentStep.value === 3) return isStep3Valid.value;
  return true;
});

const canSave = computed(() => currentStep.value === 4 && isStep4Valid.value);

const fuelValidation = (value) => {
  if (value === '' || value === null) return true; 
  const numValue = parseFloat(value);
  return numValue >= 0 && numValue <= 10;
};

</script>

<template>
  <v-dialog v-model="show" persistent width="500" max-height="700" @click:outside="emit('close')">
    <v-card class="pa-5">
      <v-card-title>  
        <v-icon 
          color="black" 
          class="mr-4" 
          @click="prevStep" 
          v-if="currentStep !== 1"
        >
          mdi-chevron-left
        </v-icon>
        {{ car ? $t('editCar') : $t('addCar') }}
      </v-card-title>
      <v-card-text>
        <div v-if="currentStep === 1">
          <v-select 
            v-model="form.city" 
            :items="cities.map(city => locale === 'en' ? city.en : city.ru)" 
            :label="$t('city')"
          />
          <v-select 
            v-model="form.type" 
            :items="rentalTypes.map(item => locale === 'en' ? item.en : item.ru)" 
            :label="$t('rentalType')" 
          />
          <v-select 
            v-model="form.partner" 
            :items="partners" 
            :label="$t('partner')"
          />
        </div>

        <div v-if="currentStep === 2">
          <v-text-field 
            v-model="form.model" 
            :label="$t('model')" 
          />
          <v-text-field 
            v-model="form.priceDay" 
            :label="$t('pricePerDay')" 
            type="number" 
          />
          <v-text-field 
            v-model="form.priceWeek" 
            :label="$t('pricePerWeek')" 
            type="number"
          />
          <v-text-field 
            v-model="form.priceMonth" 
            :label="$t('pricePerMonth')" 
            type="number" 
          />
          <v-text-field 
            v-model="form.cityFuel" 
            :label="$t('cityFuel')" 
            type="number" 
            :rules="[v => fuelValidation(v) || $t('fuelValidationMessage')]" 
          />
          <v-text-field 
            v-model="form.highwayFuel" 
            :label="$t('highwayFuel')" 
            type="number" 
            :rules="[v => fuelValidation(v) || $t('fuelValidationMessage')]" 
          />
          <v-text-field 
            v-model="form.combinedFuel" 
            :label="$t('combinedFuel')" 
            type="number" 
            :rules="[v => fuelValidation(v) || $t('fuelValidationMessage')]" 
          />
          <v-text-field 
            v-model="form.year" 
            :label="$t('year')" 
            type="number" 
          />
          <v-text-field 
            v-model="form.engineType" 
            :label="$t('engineVolume')" 
          />
          <v-select 
            v-model="form.transmission"
            :items="transmissionTypes.map(item => locale === 'en' ? item.en : item.ru)" 
            :label="$t('transmission')" 
          />
          <v-select 
            v-model="form.fuel" 
            :items="fuelTypes.map(item => locale === 'en' ? item.en : item.ru)" 
            :label="$t('fuel')" 
          />
        </div>

        <div v-if="currentStep === 3">
          <v-textarea v-model="form.description" :label="t('description')" />
          <v-row>
            <v-col v-for="(option, index) in availableOptions" :key="index" cols="6">
              <v-checkbox
                v-model="form.checkboxes"
                :label="option.label"
                :value="option.label"
              />
            </v-col>
          </v-row>
        </div>

        <div v-if="currentStep === 4">
          <v-file-input @change="handleFileChange" :label="$t('uploadPhotos')" multiple accept="image/*" />
          <div v-if="form.images.length">
            <v-carousel>
              <v-carousel-item v-for="(image, index) in form.images" :key="index">
                <v-img :src="image" alt="Car image" aspect-ratio="16/9" />
              </v-carousel-item>
            </v-carousel>
          </div>
        </div>
      </v-card-text>

      <v-card-actions class="buttons">
        <div>
          <v-btn @click="nextStep" :disabled="!canMoveToNextStep">{{ $t('next') }}</v-btn>
        </div>
        <div>
          <v-btn color="primary" @click="save" :disabled="!canSave">{{ $t('save') }}</v-btn>
        </div>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>