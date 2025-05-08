<template>
  <div
    class="border rounded-lg p-4 shadow-md bg-white hover:shadow-lg transition-shadow duration-300"
  >
    <img
      :src="imovel.foto"
      :alt="imovel.nome"
      loading="lazy"
      class="w-full h-48 object-cover rounded-md mb-4"
    />
    <h3 class="text-xl font-semibold text-gray-800">{{ imovel.nome }}</h3>
    <p class="text-gray-600">Preço: R${{ imovel.preco.toLocaleString('pt-BR') }}</p>
    <p class="text-gray-600 flex items-center">
      <HomeIcon class="w-5 h-5 mr-2" /> Quartos: {{ imovel.quartos }}
    </p>
    <p class="text-gray-600">Área: {{ imovel.area }}m²</p>
    <button
      :disabled="loading"
      class="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-300 disabled:opacity-50"
    >
      {{ loading ? 'Carregando...' : 'Ver Detalhes' }}
    </button>
  </div>
</template>

<script>
export default {
  props: {
    imovel: Object,
  },
  data() {
    return {
      loading: false, // Define o estado inicial de loading
    };
  },
  methods: {
    async verDetalhes() {
      this.loading = true;
      try {
        // Simula uma ação, como carregar detalhes do imóvel
        await new Promise(resolve => setTimeout(resolve, 1000));
        alert(`Detalhes do imóvel: ${this.imovel.nome}`);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>