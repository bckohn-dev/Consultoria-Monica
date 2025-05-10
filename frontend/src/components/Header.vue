<template>
  <header :class="['bg-blue-600 text-white', $route.path === '/catalogo' ? '' : 'shadow-md']">
    <div class="container mx-auto flex justify-between items-center py-4 px-4">
      <!-- Título -->
      <h1 class="text-2xl sm:text-4xl font-bold">
        Monica Consultoria Imobiliária
      </h1>

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
          menuAberto ? 'block' : 'hidden', // Controla a visibilidade no mobile
          'absolute sm:static top-16 right-0 sm:right-auto w-full sm:w-auto bg-blue-600 sm:bg-transparent'
        ]"
      >
        <ul class="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 text-sm sm:text-base p-4 sm:p-0">
          <li>
            <router-link
              to="/"
              class="hover:text-gray-200 transition-colors duration-300"
              :class="{ 'font-bold underline': $route.path === '/' }"
            >
              Home
            </router-link>
          </li>
          <li>
            <router-link
              to="/catalogo"
              class="hover:text-gray-200 transition-colors duration-300"
            >
              Catálogo
            </router-link>
          </li>
          <li>
            <router-link
              to="/sobre"
              class="hover:text-gray-200 transition-colors duration-300"
            >
              Sobre
            </router-link>
          </li>
          <li>
            <router-link
              to="/contato"
              class="hover:text-gray-200 transition-colors duration-300"
            >
              Contato
            </router-link>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<script>
export default {
  name: 'Header',
  data() {
    return {
      menuAberto: false, // Controla a visibilidade do menu no mobile
    };
  },
};
</script>