// main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './index.css';

const vueApp = createApp(App); // ✅ renomeado para evitar conflito
vueApp.use(router);
vueApp.mount('#app');
