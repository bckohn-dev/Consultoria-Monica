<template>
  <header :class="['bg-blue-600 text-white', $route.path === '/catalogo' ? '' : 'shadow-md']">
    <div class="container mx-auto flex justify-between items-center py-4">
      <h1 class="text-2xl font-bold">Catálogo de Apartamentos</h1>
      <nav>
        <ul class="flex space-x-6">
          <li>
            <router-link
              to="/"
              class="hover:text-gray-200"
              :class="{ 'font-bold underline': $route.path === '/' }"
            >
              Home
            </router-link>
          </li>
          <li>
            <router-link to="/catalogo" class="hover:text-gray-200">Catálogo</router-link>
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