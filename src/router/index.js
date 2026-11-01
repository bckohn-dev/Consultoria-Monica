import { createRouter, createWebHistory } from 'vue-router';

const Home = () => import('../views/HomePage.vue');
const Catalogo = () => import('../views/CatalogPage.vue');
const Admin = () => import('../views/AdminPage.vue');
// const Contato = () => import('../views/ContatoPage.vue');
const Sobre = () => import('../views/SobrePage.vue');

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/catalogo', name: 'Catalogo', component: Catalogo },
  { path: '/admin', name: 'Admin', component: Admin, meta: { admin: true } },
  { path: '/privacidade', name: 'Privacidade', component: () => import('../views/PrivacyPage.vue') },
  { path: '/login', name: 'Login', component: () => import('../views/LoginPage.vue') },
  // { path: '/contato', name: 'Contato', component: Contato },
  { path: '/sobre', name: 'Sobre', component: Sobre },
  { path: '/imovel/:id', name: 'ImovelDetalhes', component: () => import('../views/ImovelDetalhes.vue')}
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) { return savedPosition || { top: 0 } },
});

router.beforeEach(async to => {
  if (!to.meta.admin) return true
  const { adminAuth, adminRequest } = await import('../services/adminApi')
  await adminAuth.authStateReady()
  if (!adminAuth.currentUser) return '/login'
  try { await adminRequest('get', { params: { action:'session' } }); return true }
  catch { return '/login' }
})
export default router;
