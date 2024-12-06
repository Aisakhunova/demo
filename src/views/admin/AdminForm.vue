<script setup>
import { ref, watch, computed } from 'vue';
import { useCarsStore } from '../../store/cars';

const props = defineProps({
  car: Object, 
});

const emit = defineEmits(['close']); 

const carsStore = useCarsStore();
const show = ref(true);
const currentStep = ref(1);
const form = ref({
  city: '',
  rentalType: '',
  partner: '',
  model: '',
  price: '',
  available: false,
  year: '',
  engineType: '',
  transmission: '',
  fuel: '',
  description: '',
  checkboxes: [],
  images: [], 
});

watch(
  () => props.car,
  (newCar) => {
    if (newCar) {
      form.value = { ...newCar }; 
    } else {
      form.value = {
        city: '',
        rentalType: '',
        partner: '',
        model: '',
        price: '',
        available: false,
        year: '',
        engineType: '',
        transmission: '',
        fuel: '',
        description: '',
        checkboxes: [],
        images: [],
      };
    }
  },
  { immediate: true }
);

const save = () => {
  if (props.car) {
    carsStore.updateCar(form.value); 
  } else {
    carsStore.addCar(form.value); 
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
    alert('Можно загрузить не более 3 изображений.');
    return;
  }

  const imageUrls = Array.from(files).map((file) => URL.createObjectURL(file));
  form.value.images = [...form.value.images, ...imageUrls];
};

const isStep1Valid = computed(() => form.value.city && form.value.rentalType && form.value.partner);
const isStep2Valid = computed(() => form.value.model && form.value.price && form.value.year && form.value.engineType && form.value.transmission && form.value.fuel);
const isStep3Valid = computed(() => form.value.description && form.value.checkboxes.length > 0);
const isStep4Valid = computed(() => form.value.images.length > 0);

const canMoveToNextStep = computed(() => {
  if (currentStep.value === 1) return isStep1Valid.value;
  if (currentStep.value === 2) return isStep2Valid.value;
  if (currentStep.value === 3) return isStep3Valid.value;
  return true;
});

const canSave = computed(() => currentStep.value === 4 && isStep4Valid.value);


</script>

<template>
  <v-dialog v-model="show" persistent width="500" max-height="700" @click:outside="emit('close')">
    <v-card class="pa-5">
      <v-card-title>{{ car ? 'Редактировать' : 'Добавить' }} машину</v-card-title>
      <v-card-text>
        <div v-if="currentStep === 1">
          <v-select v-model="form.city" :items="['Варшава', 'Краков', 'Познань']" label="Город" />
          <v-select v-model="form.rentalType" :items="['Курьер', 'Такси']" label="Тип аренды" />
          <v-text-field v-model="form.partner" label="Партнер" />
        </div>

        <div v-if="currentStep === 2">
          <v-text-field v-model="form.model" label="Модель" />
          <v-text-field v-model="form.price" label="Цена" type="number" />
          <v-text-field v-model="form.year" label="Год" type="number" />
          <v-text-field v-model="form.engineType" label="Тип двигателя" />
          <v-text-field v-model="form.transmission" label="Трансмиссия" />
          <v-text-field v-model="form.fuel" label="Топливо" />
        </div>

        <div v-if="currentStep === 3">
          <v-textarea v-model="form.description" label="Описание" />
          <v-checkbox
            v-for="(checkbox, index) in 10"
            :key="index"
            v-model="form.checkboxes"
            :label="'Опция ' + (index + 1)"
          />
        </div>

        <div v-if="currentStep === 4">
          <v-file-input @change="handleFileChange" label="Загрузить фото" multiple accept="image/*" />
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
          <v-btn @click="prevStep" :disabled="currentStep === 1">Назад</v-btn>
          <v-btn @click="nextStep" :disabled="!canMoveToNextStep">Далее</v-btn>
        </div>
       <div>
        <v-btn color="primary" @click="save" :disabled="!canSave">Сохранить</v-btn>
        <v-btn @click="$emit('close')">Отмена</v-btn>
       </div>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
