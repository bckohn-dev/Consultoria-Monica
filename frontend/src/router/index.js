import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../views/HomePage.vue';
import CatalogPage from '../views/CatalogPage.vue';
import AdminPage from '../views/AdminPage.vue';
import SobrePage from '../views/SobrePage.vue';
import LoginPage from '../views/LoginPage.vue';
import { getAuth, onAuthStateChanged } from "firebase/auth";

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
    path: '/login',
    name: 'Login',
    component: LoginPage,
  },
  {
    path: '/admin',
    name: 'Admin',
    component: AdminPage,
    meta: { requiresAuth: true }, // Adicionando meta para autenticação
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

// Guardião de rota
router.beforeEach((to, from, next) => {
  const auth = getAuth();
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (!requiresAuth) return next();

  onAuthStateChanged(auth, user => {
    if (user) {
      next();
    } else {
      next("/login");
    }
  });
});

export default router;