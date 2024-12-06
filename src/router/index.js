import {createRouter, createWebHistory} from 'vue-router';
import HomePage from '../views/home/HomePage.vue';
import AdminPage from '../views/admin/AdminPage.vue';
import CarDetail from '../components/CarDetail.vue'

const routes = [
    {path: '/', name: 'Home', component: HomePage},
    {path: '/admin', name: 'Admin', component: AdminPage},
    {
        path: '/car/:carId',
        name: 'car-detail',
        component: CarDetail
      },
];

export const router = createRouter({
    history: createWebHistory(),
    routes,
});
