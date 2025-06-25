<template>
  <header class="bg-mainblue text-white shadow-md z-50">
    <div class="container mx-auto flex justify-between items-center px-4 py-3">
      <!-- Logo -->
       <div class="flex flex-col items-center sm:flex-row sm:items-center">
        <img :src="Logo" class="main__logo"/>
        <span class="text-white font-semibold tracking-wide">MÔNICA <br>Consultoria</span>
      </div>

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
          'sm:flex flex-col sm:flex-row absolute sm:static top-full right-0 w-full sm:w-auto transition-all duration-300 z-40',
          menuAberto ? 'block' : 'hidden'
        ]"
      >
        <ul class="flex flex-col sm:flex-row sm:space-x-6 p-4 sm:p-0">
          <li v-for="item in menu" :key="item.nome">
            <router-link
              :to="item.rota"
              class="block py-2 px-4 rounded-md text-white hover:bg-puregold hover:text-mainblue transition-colors duration-200"
            >
              {{ item.nome }}
            </router-link>
          </li>
          <li>
            <button
              @click="abrirContato"
              class="py-2 px-4 rounded-md text-white hover:bg-puregold hover:text-mainblue transition-colors duration-200"
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
        <h2 class="text-2xl font-bold text-mainblue mb-4">Contato</h2>
        <ul class="space-y-2 text-gray-700">
          <li><strong>Email:</strong> contato@consultoriaimobiliaria.com</li>
          <li><strong>Telefone:</strong> (11) 94539-3359</li>
          <li><strong>Endereço:</strong> Rua dos Imóveis, 123, Centro, São Paulo - SP</li>
        </ul>
        <button
          @click="fecharContato"
          class="mt-6 bg-mainblue text-white px-4 py-2 rounded hover:bg-gold hover:text-mainblue transition"
        >
          Fechar
        </button>
      </div>
    </div>
  </header>
</template>

<script>
import Logo from '@/assets/Logo.png';

export default {
  name: 'Header',
  data() {
    return {
      Logo,
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

<style>
.main__logo {
  max-height: 100px;
  width: auto;
  margin: -20px;
  margin-right: -22px;
}
</style>
