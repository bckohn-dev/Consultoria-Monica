<template>
    <div class="min-h-screen bg-gray-50">
      <Header />
      <main class="container mx-auto my-16">
        <Catalogo />
      </main>
    </div>
  </template>
  
  <script>
  import Header from '../components/Header.vue';
  import Catalogo from '../components/Catalogo.vue';
  
  export default {
    components: { Header, Catalogo },
  };
  </script>