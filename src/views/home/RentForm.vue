<script setup>
import { ref, watch } from 'vue';
import { useCarsStore } from '../../store/cars'; 

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

const emit = defineEmits(['toggleRentalForm', 'submitRentalForm']);
const store = useCarsStore(); 

const renterName = ref('');
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

const submitRentalForm = () => {
  if (!renterName.value || !rentalStartDate.value || !rentalEndDate.value) {
    alert('Пожалуйста, заполните все поля');
    return;
  }
  const requestBody = {
    renterName: renterName.value,
    rentalStartDate: rentalStartDate.value,
    rentalEndDate: rentalEndDate.value,
    approved: false,
    carId: props.carId,
  };
  console.log("RENT - ", requestBody)
  store.addRentalRequest(requestBody);
  emit('submitRentalForm', requestBody);
  emit('toggleRentalForm'); 
};

const toggleRentalForm = () => {
  emit('toggleRentalForm');
};
</script>

<template>
  <v-dialog v-model="isOpen" max-width="500px" @click:outside="toggleRentalForm">
    <v-card>
      <v-card-title class="headline">Форма аренды</v-card-title>
      <v-card-text>
        <v-form>
          <v-text-field
            v-model="renterName"
            label="Имя арендатора"
            required
          />
          <v-text-field
            v-model="rentalStartDate"
            label="Дата начала аренды"
            type="date"
            required
          />
          <v-text-field
            v-model="rentalEndDate"
            label="Дата окончания аренды"
            type="date"
            required
          />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn text @click="toggleRentalForm">Отмена</v-btn>
        <v-btn color="primary" @click="submitRentalForm">Отправить</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

