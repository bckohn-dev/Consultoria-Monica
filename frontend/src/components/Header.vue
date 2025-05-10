<template>
  <header :class="['bg-blue-600 text-white', $route.path === '/catalogo' ? '' : 'shadow-md']">
    <div class="container mx-auto flex justify-between items-center py-5 px-5">
      <h1 class="text-4xl font-bold">Monica Consultoria Imobiliaria</h1> 
      <nav>
        <ul class="flex space-x-6">
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
            <router-link to="/catalogo" class="hover:text-gray-200 transition-colors duration-300">Catálogo</router-link>
          </li>
          <li>
            <router-link to="/sobre" class="hover:text-gray-200 transition-colors duration-300">Sobre</router-link>
          </li>
          <li>
            <router-link to="/contato" class="hover:text-gray-200 transition-colors duration-300">Contato</router-link>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<script>
export default {
  name: 'Header',
};
</script>