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

// Информация о компании
const companyInfo = ref({
  name: "Car Rentals Ltd.",
  rating: 4.5,
  reviewsCount: 120,
  description: "Car Rentals Ltd. offers a wide range of vehicles for all your rental needs. Whether you're looking for a luxury ride or an economy car, we have something for you!",
  contact: "+123 456 789",
  location: "123 Main Street, Cityville"
});
</script>

<template>
  <v-container>
    <v-btn @click="goBack" color="grey" class="mb-3">
      Назад
    </v-btn>

    <v-card class="pa-5">
      <v-card-title>{{ car?.model }}</v-card-title>
      <v-card-text>
        <div class="d-flex">
          <div>
          <p><strong>Модель:</strong> {{ car?.model }}</p>
          <p><strong>Цена в день:</strong> {{ car?.price.day }}$</p>
          <p><strong>Цена в неделю:</strong> {{ car?.price.week }}$</p>
          <p><strong>Цена в месяц:</strong> {{ car?.price.month }}$</p>
          <p><strong>Год выпуска:</strong> {{ car?.year }}</p>
          <p><strong>Тип двигателя:</strong> {{ car?.engineType }}</p>
          <p><strong>Трансмиссия:</strong> {{ car?.transmission }}</p>
          <p><strong>Тип топлива:</strong> {{ car?.fuel }}</p>
          <p><strong>Описание:</strong> {{ car?.description }}</p>
          
          <div v-if="car?.checkboxes.length">
            <p><strong>Опции:</strong></p>
            <ul class="ml-8">
              <li v-for="(option, index) in car.checkboxes" :key="index">{{ option }}</li>
            </ul>
          </div>

          <p><strong>Доступность:</strong> {{ car?.available ? 'Доступна' : 'Не доступна' }}</p>
        </div>

        <!-- Рейтинг и информация о компании -->
        
        <v-divider vertical class="mx-5"></v-divider>

        <div class="mb-4">
          <h3>Описание</h3>
          <div>
            {{ car?.description }}
          </div>
          <h3 class="mt-3">О компании:</h3>
          <div class="d-flex align-center mb-4">
          <v-icon color="yellow">mdi-star</v-icon>
          <span class="ml-2">{{ companyInfo.rating }} / 5</span>
          <span class="ml-4">({{ companyInfo.reviewsCount }} отзывов)</span>
        </div>
          
          <p>{{ companyInfo.description }}</p>
          <p><strong>Контакты:</strong> {{ companyInfo.contact }}</p>
          <p><strong>Адрес:</strong> {{ companyInfo.location }}</p>
        </div>
        </div>

        <v-carousel show-arrows :show-indicators="false" class="mt-3">
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
