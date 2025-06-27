<template>
  <Header />
  <div class="max-w-screen-xl mx-auto px-4 min-h-screen bg-gray-50">
    <h1 class="text-4xl font-bold text-center text-mainblue mt-8 mb-2 flex justify-center items-center gap-2">
      🏠 Catálogo Completo
    </h1>
    <div class="w-24 h-1 bg-puregold mx-auto mb-6 rounded-full"></div>
    <main class="container mx-auto my-16">
      <Catalogo />
    </main>
  </div>
  <Footer />
</template>
  
<script>
import Header from '../components/Header.vue';
import Catalogo from '../components/Catalogo.vue';
import Footer from '../components/Footer.vue';

export default {
  components: { Header, Catalogo, Footer },
};
</script>