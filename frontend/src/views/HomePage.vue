<template>
    <div class="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main class="flex-grow">
        <Carrossel />
        <Catalogo />
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