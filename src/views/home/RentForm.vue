<script setup>
import { ref, watch } from 'vue';
import { useCarsStore } from '../../stores/cars'; 
import { useI18n } from 'vue-i18n';

const {t, locale} = useI18n()

const props = defineProps({
  showRentalForm: {
    type: Boolean,
    required: true
  },
  carId: {
    type: Number,
    required: true
  }
});

const renterNames = {
  ru: "Дмитрий Нагиев",
  en: "Dmitry Nagiev"
}

const emit = defineEmits(['toggleRentalForm', 'submitRentalForm']);
const store = useCarsStore(); 

const renterName = ref(renterNames[locale.value]);
const rentalStartDate = ref('');
const rentalEndDate = ref('');
const isOpen = ref(false)

watch(() => props.showRentalForm, (newValue) => {
  if(newValue) {
    isOpen.value = true
  } else{
    isOpen.value = false
  }
})

watch(locale, (newLocale) => {
  renterName.value = renterNames[locale.value]
});

const submitRentalForm = () => {
  if (!renterName.value || !rentalStartDate.value || !rentalEndDate.value) {
    alert(t('fillAll'));
    return;
  }

  const rating = 4.7; 
  const rides = 150; 

  const requestBody = {
    renterName: {
      ru: renterNames.ru,
      en: renterNames.en
    },
    rentalStartDate: rentalStartDate.value,
    rentalEndDate: rentalEndDate.value,
    approved: false,
    carId: props.carId,
    rating: parseFloat(rating), 
    rides: rides,
  };

  console.log("RENT - ", requestBody);
  
  store.addRentalRequest(requestBody);

  rentalEndDate.value = '';
  rentalStartDate.value = '';
  
  emit('submitRentalForm', requestBody);
  emit('toggleRentalForm');
};

const toggleRentalForm = () => {
  emit('toggleRentalForm');
};

</script>

<template>
  <v-dialog v-model="isOpen" max-width="500px" @click:outside="toggleRentalForm">
    <v-card class="pa-5">
      <v-card-title class="headline">{{ $t('rentalForm') }}</v-card-title>
      <v-card-text>
        <v-form>
          <v-text-field
            v-model="renterName"
            :label="$t('renterName')"
            required
            readonly
          />
          <v-text-field
            v-model="rentalStartDate"
            :label="$t('rentStart')"
            type="date"
            required
          />
          <v-text-field
            v-model="rentalEndDate"
            :label="$t('rentEnd')"
            type="date"
            required
          />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" variant="flat"   @click="submitRentalForm">{{ $t('send') }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>