<template>
  <header :class="['bg-navy text-white', $route.path === '/catalogo' ? '' : 'shadow-md']">
    <div class="container mx-auto flex justify-between items-center py-2 px-4">
      <!-- Logo -->
      <img
        :src="Logo"
        alt="Monica Consultoria Imobiliária"
        class="main__logo object-contain"
      />

      <!-- Ícone do menu (mobile) -->
      <button
        class="sm:hidden text-white focus:outline-none"
        @click="menuAberto = !menuAberto"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
        </svg>
      </button>

      <!-- Menu de navegação -->
      <nav
        :class="[
          'sm:flex',
          menuAberto ? 'block' : 'hidden',
          'absolute sm:static top-16 right-0 sm:right-auto w-full sm:w-auto bg-navy sm:bg-transparent z-40'
        ]"
      >
        <ul class="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 text-sm sm:text-base p-4 sm:p-0">
          <li>
            <router-link
              to="/"
              class="hover:text-gold transition-colors duration-300"
              :class="{
                'shadow-md': $route.path === '/catalogo',
                'text-white': true
              }"
            >
              Home
            </router-link>
          </li>
          <li>
            <router-link
              to="/catalogo"
              class="hover:text-gold transition-colors duration-300 text-white"
            >
              Catálogo
            </router-link>
          </li>
          <li>
            <router-link
              to="/sobre"
              class="hover:text-gold transition-colors duration-300 text-white"
            >
              Sobre
            </router-link>
          </li>
          <li>
            <button
              @click="abrirContato"
              class="hover:text-gold transition-colors duration-300 text-white"
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
          class="mt-6 bg-navy text-white px-4 py-2 rounded hover:bg-gold hover:text-navy transition-colors duration-300"
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
    };
  },
  methods: {
    abrirContato() {
      this.mostrarContato = true;
    },
    fecharContato() {
      this.mostrarContato = false;
    },
  },
};
</script>

<style scoped>
.main__logo {
  max-height: 80px;
  width: 20%;
  max-width: 220px;
  margin: 0;
  display: block;
}

.bg-navy {
  background-color: #1a237e;
}

.text-navy {
  color: #1a237e;
}

.text-gold {
  color: #bfa14f;
}

.hover\:text-gold:hover {
  color: #bfa14f;
}

.hover\:bg-gold:hover {
  background-color: #bfa14f;
}

.hover\:text-navy:hover {
  color: #1a237e;
}
</style>
