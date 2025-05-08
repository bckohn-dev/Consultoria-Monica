<template>
  <div
    class="border rounded-lg p-4 shadow-md bg-white hover:shadow-lg transition-shadow duration-300"
  >
    <img
      :src="imovel.foto"
      :alt="imovel.nome"
      class="w-full h-48 object-cover rounded-md mb-4"
    />
    <h3 class="text-xl font-semibold text-gray-800">{{ imovel.nome }}</h3>
    <p class="text-gray-600">Preço: R${{ imovel.preco.toLocaleString('pt-BR') }}</p>
    <p class="text-gray-600 flex items-center">
      <HomeIcon class="w-5 h-5 mr-2" /> Quartos: {{ imovel.quartos }}
    </p>
    <p class="text-gray-600">Área: {{ imovel.area }}m²</p>
    <button
      class="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-300"
    >
      Ver Detalhes
    </button>
  </div>
</template>

<script>
import { HomeIcon } from '@heroicons/vue/24/outline';

export default {
  components: { HomeIcon },
  props: {
    imovel: Object,
  },
};
</script>