import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../views/HomePage.vue';
import CatalogPage from '../views/CatalogPage.vue';
import AdminPage from '../views/AdminPage.vue';
import SobrePage from '../views/SobrePage.vue';

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
  {
    path: '/admin',
    name: 'Admin',
    component: AdminPage,
  },
  {
    path: '/sobre',
    name: 'Sobre',
    component: SobrePage,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;