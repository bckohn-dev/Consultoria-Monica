<template>
  <section class="container mx-auto my-16">
    <h2 class="text-3xl font-bold text-navy mb-8 text-center">Catálogo de Imóveis</h2>
    <!-- Filtros -->
    <div class="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-8">
      <select
        v-model="filtros.quartos"
        class="border border-gold p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-navy"
        @change="buscarImoveis"
      >
        <option value="">Quartos</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3+</option>
      </select>
      <input
        v-model="filtros.precoMin"
        type="number"
        placeholder="Preço mín. (R$)"
        class="border border-gold p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-navy"
        @input="buscarImoveis"
      />
      <input
        v-model="filtros.precoMax"
        type="number"
        placeholder="Preço máx. (R$)"
        class="border border-gold p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-navy"
        @input="buscarImoveis"
      />
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
import { ref } from 'vue';
import ImovelCard from './ImovelCard.vue';
import axios from 'axios';

export default {
  components: { ImovelCard },
  setup() {
    const imoveis = ref([]);
    const filtros = ref({ quartos: '', precoMin: '', precoMax: '' });
    const loading = ref(false);
    const error = ref(null);

    const mostrarDetalhes = (imovel) => {
      console.log('Imóvel selecionado:', imovel);
      alert(`Detalhes do imóvel: ${imovel.nome}`);
    };
    const buscarImoveis = async () => {
      loading.value = true;
      error.value = null;
      try {
        // Ajuste para usar o endpoint relativo do Vercel
        const response = await axios.get('/api/imoveis', {
          params: {
            quartos: filtros.value.quartos,
            precoMin: filtros.value.precoMin,
            precoMax: filtros.value.precoMax,
          },
        });
        const items = Array.isArray(response.data) ? response.data : [];
        imoveis.value = items.filter(item => item.nome && typeof item.preco === 'number');

      } catch (err) {
        error.value = err.response?.data?.error || 'Erro ao buscar imóveis. Tente novamente.';
        console.error('Erro ao carregar imóveis:', err);
      } finally {
        loading.value = false;
      }
    };

    buscarImoveis();

    return {
      imoveis, filtros, loading, error, buscarImoveis, mostrarDetalhes
    };
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
/* 
.focus\:ring-navy:focus {
  ring-color: #000080;
}
*/
/* Se você quiser customizar a cor do anel de foco, use Tailwind config ou uma classe utilitária */
</style>