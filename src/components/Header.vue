<template>
  <header class="bg-navy text-white shadow-md z-50">
    <div class="container mx-auto flex justify-between items-center px-4 py-3">
      <!-- Logo -->
      <img :src="Logo" alt="Monica Consultoria Imobiliária" class="main__logo" />

      <!-- Mobile menu button -->
      <button class="sm:hidden" @click="menuAberto = !menuAberto">
        <svg class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2"
          viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M4 6h16M4 12h16m-7 6h7" />
        </svg>
      </button>

      <!-- Navigation -->
      <nav
        :class="[
          'sm:flex flex-col sm:flex-row absolute sm:static bg-navy sm:bg-transparent top-full right-0 w-full sm:w-auto transition-all duration-300 z-40',
          menuAberto ? 'block' : 'hidden'
        ]"
      >
        <ul class="flex flex-col sm:flex-row sm:space-x-6 p-4 sm:p-0">
          <li v-for="item in menu" :key="item.nome">
            <router-link
              :to="item.rota"
              class="block py-2 sm:py-0 px-2 sm:px-0 hover:text-gold transition-colors"
            >
              {{ item.nome }}
            </router-link>
          </li>
          <li>
            <button
              @click="abrirContato"
              class="py-2 sm:py-0 hover:text-gold transition-colors"
            >
              Contato
            </button>
          </li>
        </ul>
      </nav>
    </div>

    <!-- Modal de Contato -->
    <div
      v-if="mostrarContato"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="fecharContato"
    >
      <div class="bg-white rounded-lg shadow-lg p-6 w-11/12 sm:w-1/2">
        <h2 class="text-2xl font-bold text-navy mb-4">Contato</h2>
        <ul class="space-y-2 text-gray-700">
          <li><strong>Email:</strong> contato@consultoriaimobiliaria.com</li>
          <li><strong>Telefone:</strong> (11) 94539-3359</li>
          <li><strong>Endereço:</strong> Rua dos Imóveis, 123, Centro, São Paulo - SP</li>
        </ul>
        <button
          @click="fecharContato"
          class="mt-6 bg-navy text-white px-4 py-2 rounded hover:bg-gold hover:text-navy transition"
        >
          Fechar
        </button>
      </div>
    </div>
  </header>
</template>

<script>
import Logo from '@/assets/Logo.jpg';

export default {
  name: 'Header',
  data() {
    return {
      menuAberto: false,
      mostrarContato: false,
      menu: [
        { nome: 'Home', rota: '/' },
        { nome: 'Catálogo', rota: '/catalogo' },
        { nome: 'Sobre', rota: '/sobre' },
      ]
    };
  },
  methods: {
    abrirContato() {
      this.mostrarContato = true;
    },
    fecharContato() {
      this.mostrarContato = false;
    }
  }
};
</script>

<style scoped>
.main__logo {
  max-height: 70px;
  width: auto;
  max-width: 200px;
  object-fit: contain;
}
</style>
