<template>
  <div class="site-page"><Header /><main id="conteudo" tabindex="-1" class="privacy-shell">
    <h1>Página não encontrada.</h1>
    <p>O endereço pode ter mudado. Você pode voltar ao catálogo para continuar sua busca.</p>
    <router-link to="/catalogo" class="back-link">Voltar ao catálogo</router-link>
  </main><Footer /></div>
</template>
<script setup>
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
</script>
