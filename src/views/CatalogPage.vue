<template>
  <h1 class="text-2xl font-bold text-center mt-8 mb-4">Catálogo Completo</h1>
  <div class="max-w-screen-xl mx-auto px-4 min-h-screen bg-gray-50">
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