import { createRouter, createWebHistory } from 'vue-router';
import { OWNER_ENTRY_PATH, OWNER_PANEL_PATH } from '../config/adminRoutes.js';

const Home = () => import('../views/HomePage.vue');
const Catalogo = () => import('../views/CatalogPage.vue');
const Admin = () => import('../views/AdminPage.vue');
// const Contato = () => import('../views/ContatoPage.vue');
const Sobre = () => import('../views/SobrePage.vue');

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/catalogo', name: 'Catalogo', component: Catalogo },
  { path: OWNER_PANEL_PATH, name: 'Admin', component: Admin, meta: { admin: true, noIndex: true } },
  { path: '/privacidade', name: 'Privacidade', component: () => import('../views/PrivacyPage.vue') },
  { path: OWNER_ENTRY_PATH, name: 'Login', component: () => import('../views/LoginPage.vue'), meta: { noIndex: true } },
  // { path: '/contato', name: 'Contato', component: Contato },
  { path: '/sobre', name: 'Sobre', component: Sobre },
  { path: '/imovel/:id', name: 'ImovelDetalhes', component: () => import('../views/ImovelDetalhes.vue')},
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: () => import('../views/NotFoundPage.vue'), meta: { noIndex: true } }
];

export function createSiteRouter(history = createWebHistory()) {
  const router = createRouter({
    history,
    routes,
    scrollBehavior(to, from, savedPosition) { return savedPosition || (to.hash ? { el: to.hash, top: 24 } : { top: 0 }) },
  });

  router.beforeEach(async to => {
    if (!to.meta.admin) return true
    try {
      const { adminAuth, adminRequest } = await import('../services/adminApi')
      await adminAuth.authStateReady()
      if (!adminAuth.currentUser) return OWNER_ENTRY_PATH
      await adminRequest('get', { params: { action: 'session' } })
      return true
    } catch { return OWNER_ENTRY_PATH }
  })
  router.afterEach(to => {
    if (typeof document === 'undefined') return
    let robots = document.head.querySelector('meta[data-route-privacy]')
    if (to.meta.noIndex) {
      if (!robots) {
        robots = document.createElement('meta')
        robots.name = 'robots'
        robots.setAttribute('data-route-privacy', '')
        document.head.appendChild(robots)
      }
      robots.content = 'noindex, nofollow, noarchive'
    } else { robots?.remove() }
  })
  return router
}
export default createSiteRouter();
