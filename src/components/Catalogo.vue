<template>
  <section class="container mx-auto my-16">
    <h2 class="text-3xl font-bold text-mainblue mb-8 text-center">Busque seu imóvel</h2>
    <!-- Filtros -->
    <div class="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-8">
      <!-- Quartos -->
      <div class="relative w-full md:w-auto">
        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">🛏️</span>
        <select
          v-model="filtros.quartos"
          class="pl-10 border border-puregold p-3 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-mainblue"
          @change="buscarImoveis"
        >
          <option value="">Quartos</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3+</option>
        </select>
      </div>
        <!-- Preço mín -->
      <div class="relative w-full md:w-auto">
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
      <div class="relative w-full md:w-auto">
        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">💰</span>
        <input
          v-model="filtros.precoMax"
          type="number"
          placeholder="Preço máx. (R$)"
          class="pl-10 border border-puregold p-3 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-mainblue"
          @input="buscarImoveis"
        />
      </div>
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
        @ver-detalhes="mostrarDetalhes"
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
    const filtros = ref({ quartos: '', precoMin: '', precoMax: '' });
    const loading = ref(false);
    const error = ref(null);
    // console.log("🔍 Parâmetros de busca:", params); // Removido pois 'params' não está definido neste escopo

    const mostrarDetalhes = (imovel) => {
      console.log('Imóvel selecionado:', imovel);
      alert(`Detalhes do imóvel: ${imovel.nome}`);
    };

    const buscarImoveis = async () => {
      loading.value = true;
      error.value = null;

      try {
        const params = {};
        if (filtros.value.quartos) params.quartos = filtros.value.quartos;
        if (filtros.value.precoMin) params.precoMin = filtros.value.precoMin;
        if (filtros.value.precoMax) params.precoMax = filtros.value.precoMax;

        console.log("🔍 Parâmetros de busca:", params);

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
      mostrarDetalhes
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
/* Se você quiser customizar a cor do anel de foco, use Tailwind config ou uma classe utilitária */
</style>