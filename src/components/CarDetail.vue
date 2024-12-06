<script setup>
import { useRoute, useRouter } from 'vue-router'; 
import { useCarsStore } from '../store/cars';
import { ref, onMounted } from 'vue';

const route = useRoute();
const router = useRouter(); 
const carId = route.params.carId;
const car = ref(null);

const carsStore = useCarsStore();

onMounted(() => {
  car.value = carsStore.getCarById(Number(carId)); 
});

const goBack = () => {
  router.go(-1); 
};

</script>

<template>
  <v-container>
    <v-btn @click="goBack" color="grey" class="mb-3">
      Назад
    </v-btn>

    <v-card>
      <v-card-title>{{ car?.model }}</v-card-title>
      <v-card-text>
        <p><strong>Модель:</strong> {{ car?.model }}</p>
        <p><strong>Цена:</strong> {{ car?.price }}$</p>
        <p><strong>Год выпуска:</strong> {{ car?.year }}</p>
        <p><strong>Тип двигателя:</strong> {{ car?.engineType }}</p>
        <p><strong>Трансмиссия:</strong> {{ car?.transmission }}</p>
        <p><strong>Тип топлива:</strong> {{ car?.fuel }}</p>
        <p><strong>Описание:</strong> {{ car?.description }}</p>
        
        <div v-if="car?.checkboxes.length">
          <p><strong>Опции:</strong></p>
          <ul>
            <li v-for="(option, index) in car.checkboxes" :key="index">{{ option }}</li>
          </ul>
        </div>

        <p><strong>Доступность:</strong> {{ car?.available ? 'Доступна' : 'Не доступна' }}</p>

        <v-carousel show-arrows :show-indicators="false">
          <v-carousel-item v-for="(image, index) in car?.images" :key="index">
            <v-img 
              :src="image" 
              alt="Car image" 
              aspect-ratio="16/9" 
              cover
              :lazy="false" 
            />
          </v-carousel-item>
        </v-carousel>
      </v-card-text>
    </v-card>
  </v-container>
</template>

