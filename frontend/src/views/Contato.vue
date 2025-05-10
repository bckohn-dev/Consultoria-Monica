<template>
  <div class="flex flex-col min-h-screen">
    <!-- Header -->
    <Header />

    <!-- Conteúdo principal -->
    <section class="container mx-auto flex-grow px-4 text-white py-12 rounded-md mt-8 mb-8">
      <h2 class="text-5xl font-bold text-blue-600 bg-white py-4 px-6 rounded-md text-center mb-12">
        Contato
      </h2>
      
      <!-- Informações de Contato -->
      <div class="mb-12">
        <h3 class="text-4xl font-semibold text-blue-600 bg-white py-3 px-4 rounded-md mb-6">
          Celular
        </h3>
        <p class="text-lg leading-relaxed text-blue-600">
          Entre em contato pelo celular: (11) 94539-3359
        </p>
      </div>
      <div class="mb-12">
        <h3 class="text-4xl font-semibold text-blue-600 bg-white py-3 px-4 rounded-md mb-6">
          Email
        </h3>
        <p class="text-lg leading-relaxed text-blue-600">
          Envie-nos um email: contato@consultoriaimobiliaria.com
        </p>
      </div>
    </section>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script>
import Header from '../components/Header.vue';
import Footer from '../components/Footer.vue';

export default {
  name: 'Contato',
  components: {
    Header,
    Footer,
  },
};
</script>