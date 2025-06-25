<template>
    <div class="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <section class="text-center py-10 px-4 bg-white">
        <h1 class="text-3xl md:text-4xl font-bold text-mainblue mb-4">
          Encontre seu novo lar com confiança
        </h1>
        <p class="text-gray-700 max-w-xl mx-auto mb-6">
          Trabalhamos para ajudar você a encontrar o imóvel ideal com atendimento humano e ágil.
        </p>
        <router-link
          to="/catalogo"
          class="inline-block bg-mainblue text-white font-semibold px-6 py-3 rounded-md hover:bg-puregold transition btn:hover"
        >
          Ver Imóveis
        </router-link>
      </section>
      <main class="flex-grow">
        <section class="px-4 md:px-8 my-6 min-h-[300px]">
          <Carrossel />
        </section>
        <Catalogo class="mt-10" />
      </main>
      <Footer />
    </div>
  </template>
  
  <script>
  import Header from '../components/Header.vue';
  import Carrossel from '../components/Carrossel.vue';
  import Catalogo from '../components/Catalogo.vue';
  import Footer from '../components/Footer.vue';
  
  export default {
    components: { Header, Carrossel, Catalogo, Footer },
  };
  </script>

<style scoped>
.btn:hover {
  background-color: #F3C969;
  color: #1C2541;
}
</style>