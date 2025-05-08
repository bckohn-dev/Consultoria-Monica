import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../views/HomePage.vue';
import CatalogPage from '../views/CatalogPage.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
  },
  {
    path: '/catalogo',
    name: 'Catalogo',
    component: CatalogPage,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;