<template>
  <div
    class="border border-gold rounded-lg p-4 shadow-md bg-white hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between h-[450px] mx-2 sm:mx-0"
  >
    <img
      :src="imovel.foto"
      :alt="imovel.nome"
      loading="lazy"
      class="w-full h-48 object-cover rounded-md mb-4"
    />
    <div class="flex-grow">
      <h3 class="text-xl font-semibold text-navy">{{ imovel.nome }}</h3>
      <hr class="my-2 border-gold" />
      <p class="text-gray-600">
        Preço: R${{ imovel.preco?.toLocaleString('pt-BR') || '—' }}
      </p>
      <p class="text-gray-600 flex items-center">
        <HomeIcon class="w-5 h-5 mr-2" /> Quartos: {{ imovel.quartos }}
      </p>
      <p class="text-gray-600 flex items-center">
        <img src="../assets/icones/areaIcon.png" alt="Área" class="w-5 h-5 mr-2" />
        {{ imovel.area }}m²
      </p>
    </div>
    <button
      :disabled="loading"
      @click="verDetalhes"
      class="mt-4 bg-navy text-white px-4 py-2 rounded-md hover:bg-gold hover:text-navy transition-colors duration-300 disabled:opacity-50"
    >
      {{ loading ? 'Carregando...' : 'Ver Detalhes' }}
    </button>
  </div>
</template>

<script>
import { HomeIcon } from '@heroicons/vue/24/outline';

export default {
  props: {
    imovel: Object,
  },
  components: {
    HomeIcon,
  },
  data() {
    return {
      loading: false,
    };
  },
  methods: {
    async verDetalhes() {
      this.loading = true;
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        alert(`Detalhes do imóvel: ${this.imovel.nome}`);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style>
/* Adicionando cores personalizadas */
.border-gold {
  border-color: #BDB76B;
}
.text-navy {
  color: #000080;
}
.bg-navy {
  background-color: #000080;
}
.hover\:bg-gold:hover {
  background-color: #BDB76B;
}
.hover\:text-navy:hover {
  color: #000080;
}
</style>