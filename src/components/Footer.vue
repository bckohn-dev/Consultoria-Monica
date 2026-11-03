<template>
  <footer class="site-footer">
    <div class="footer-main">
      <div class="footer-brand">
        <router-link to="/" class="brand-lockup" aria-label="Mônica Consultoria — início"><img :src="symbol" class="brand-symbol" alt="" width="66" height="66" /><span class="brand-wordmark"><strong>Mônica</strong><span>Consultoria imobiliária</span></span></router-link>
        <p>Um novo endereço.<br />Novas possibilidades para a sua vida.</p>
        <span class="footer-creci">CreciSP 266907</span>
      </div>
      <nav aria-label="Navegação do rodapé" class="footer-column"><h2>Explore</h2><router-link to="/">Início</router-link><router-link to="/catalogo">Catálogo de imóveis</router-link><router-link to="/sobre">Sobre a consultoria</router-link></nav>
      <div class="footer-column"><h2>Vamos conversar</h2><a href="https://wa.me/5511945413470" target="_blank" rel="noopener noreferrer"><Phone :size="15" aria-hidden="true" />(11) 94541-3470 <ArrowUpRight :size="14" aria-hidden="true" /></a><a href="mailto:monicanogueiravendas@gmail.com"><Mail :size="15" aria-hidden="true" /><span>monicanogueiravendas@gmail.com</span></a></div>
      <nav class="footer-column footer-socials" aria-label="Redes sociais"><h2>Acompanhe</h2><a v-for="social in socials" :key="social.name" :href="social.url" target="_blank" rel="noopener noreferrer"><component :is="social.icon" :size="16" aria-hidden="true" />{{ social.name }}<ArrowUpRight :size="13" aria-hidden="true" /></a></nav>
    </div>
    <div class="footer-bottom"><p>© {{ year }} Mônica Consultoria Imobiliária. Todos os direitos reservados.</p><router-link to="/privacidade">Privacidade e cookies</router-link></div>
  </footer>
</template>
<script setup>
import { Music, Instagram, Video, Phone, Mail, ArrowUpRight } from 'lucide-vue-next'
import symbol from '@/assets/brand-symbol.svg'
const year = new Date().getFullYear()
const socials = [
  { name: 'Instagram', icon: Instagram, url: 'https://www.instagram.com/monicanogueira156' },
  { name: 'TikTok', icon: Music, url: 'https://www.tiktok.com/@monicanogueira211' },
  { name: 'Kwai', icon: Video, url: 'https://kwai-video.com/u/@monicanogueira230/CoZIxgN7' },
]
</script>
