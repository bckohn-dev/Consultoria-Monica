<template>
  <section class="container mx-auto my-16">
    <h2 class="text-3xl font-bold text-mainblue mb-8 text-center">Busque seu imóvel</h2>
    <!-- Filtros -->
    <div class="overflow-x-auto bg-white shadow-md rounded-lg p-6 mb-10 flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
      <!-- Quartos -->
      <div class="relative w-full md:w-auto" title="Quartos">
        <label
          for="quartos"
          class="flex items-center pl-3 pr-2 py-2 border border-puregold rounded-md w-full cursor-pointer hover:shadow-md transition-shadow duration-200"
        >
          <span class="text-gray-500">🛏️</span>
          <span class="ml-2 truncate">Quartos</span>
          <select
            id="quartos"
            v-model="filtros.quartos"
            class="absolute inset-0 opacity-0 cursor-pointer"
            @change="buscarImoveis"
          >
            <option value="">Quartos</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3+</option>
          </select>
        </label>
      </div>

      <!-- Garagem -->
      <div class="relative w-full md:w-auto" title="Garagem">
        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">🚗</span>
        <select
          v-model="filtros.garagem"
          class="truncate-option pl-10 border border-puregold p-3 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-mainblue"
          @change="buscarImoveis"
        >
          <option value="">Garagem</option>
          <option value="true">Sim</option>
          <option value="false">Não</option>
        </select>
      </div>

      <!-- Suíte -->
      <div class="relative w-full md:w-auto" title="Suítes">
        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">🛁</span>
        <select
          v-model="filtros.suite"
          class="truncate-option pl-10 border border-puregold p-3 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-mainblue"
          @change="buscarImoveis"
        >
          <option value="">Suítes</option>
          <option value="true">Sim</option>
          <option value="false">Não</option>
        </select>
      </div>

      <!-- Preço mín -->
      <div class="relative w-full md:w-auto" title="preço mínimo">
        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">💰</span>
        <input
          v-model="filtros.precoMin"
          type="number"
          placeholder="Preço mín. (R$)"
          class="pl-10 border border-puregold p-3 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-mainblue"
          @input="buscarImoveis"
        />
      </div>
      <!-- Preço máx -->
      <div class="relative w-full md:w-auto" title="preço máximo">
        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">💰</span>
        <input
          v-model="filtros.precoMax"
          type="number"
          placeholder="Preço máx. (R$)"
          class="pl-10 border border-puregold p-3 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-mainblue"
          @input="buscarImoveis"
        />
      </div>

      <!-- Reset Filter -->
      <button
        @click="resetarFiltros"
        title="Limpar filtros"
        class="text-sm font-semibold text-red-500 hover:text-red-700 hover:underline focus:outline-none focus:ring-2 focus:ring-red-500 rounded-md px-4 py-2 transition duration-200"
      >
        ❌ Limpar filtros
      </button>
    </div>
    <!-- Lista de Imóveis -->
    <div v-if="loading" class="text-center text-gray-600">Carregando...</div>
    <div v-else-if="error" class="text-center text-red-600">{{ error }}</div>
    <div v-else-if="imoveis.length === 0" class="text-center text-gray-600">
      Nenhum imóvel encontrado.
    </div>
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <ImovelCard
        v-for="imovel in imoveis"
        :key="imovel.id"
        :imovel="imovel"
      />
    </div>
  </section>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import ImovelCard from './ImovelCard.vue';

export default {
  components: { ImovelCard },
  setup() {
    const API_BASE = '/api';
    const imoveis = ref([]);
    const filtros = ref({ quartos: '', precoMin: '', precoMax: '', garagem: '', suite: ''});
    const loading = ref(false);
    const error = ref(null);

    const mostrarDetalhes = (imovel) => {
      console.log('Imóvel selecionado:', imovel);
      alert(`Detalhes do imóvel: ${imovel.nome}`);
    };
    const resetarFiltros = () => {
      filtros.value = { quartos: '', precoMin: '', precoMax: '', garagem: '', suite: '' };
      buscarImoveis();
    };

    const buscarImoveis = async () => {
      loading.value = true;
      error.value = null;

      try {
        const params = {};
        if (filtros.value.quartos) params.quartos = filtros.value.quartos;
        if (filtros.value.precoMin) params.precoMin = filtros.value.precoMin;
        if (filtros.value.precoMax) params.precoMax = filtros.value.precoMax;
        if (filtros.value.garagem) params.garagem = filtros.value.garagem;
        if (filtros.value.suite) params.suite = filtros.value.suite;


        const response = await axios.get(`${API_BASE}/imoveis`, { params });
        imoveis.value = Array.isArray(response.data) ? response.data : [];
      } catch (err) {
        error.value = err.response?.data?.error || 'Erro ao buscar imóveis. Tente novamente.';
        console.error('Erro ao carregar imóveis:', err);
      } finally {
        loading.value = false;
      }
    };


    // ✅ Executa a busca automática ao carregar o componente
    onMounted(() => {
      buscarImoveis();
    });

    return {
      imoveis,
      filtros,
      loading,
      error,
      buscarImoveis,
      mostrarDetalhes,
      resetarFiltros
    };
  }
};
</script>

<style>
/* Adicionando cores personalizadas */
.border-gold {
  border-color: #BDB76B;
}
/* 
.focus\:ring-navy:focus {
  ring-color: #000080;
}
*/
/* Ajustando texto dos filtros conforme tamanho da tela */
@media (max-width: 1300px) and (min-width: 768px) {
  .truncate-option {
    width: 3rem !important;
    text-indent: -9999px;
  }

  .truncate-placeholder::placeholder {
    color: transparent;
  }
}
</style>