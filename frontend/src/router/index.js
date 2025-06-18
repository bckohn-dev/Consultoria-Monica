import { createRouter, createWebHistory } from 'vue-router';

const Home = () => import('../views/HomePage.vue');
const Catalogo = () => import('../views/CatalogPage.vue');
const Admin = () => import('../views/AdminPage.vue');
const Contato = () => import('../views/ContatoPage.vue');
const Sobre = () => import('../views/SobrePage.vue');

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/catalogo', name: 'Catalogo', component: Catalogo },
  { path: '/admin', name: 'Admin', component: Admin },
  { path: '/contato', name: 'Contato', component: Contato },
  { path: '/sobre', name: 'Sobre', component: Sobre },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
