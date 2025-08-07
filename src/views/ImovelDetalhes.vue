<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <Header />
    <main class="flex-grow">
      <section class="container mx-auto py-10 px-4">
        <div v-if="loading" class="text-center text-gray-600">Carregando detalhes...</div>
        <div v-else-if="erro" class="text-center text-red-600">{{ erro }}</div>
        <div v-else-if="!imovel" class="text-center text-gray-600">Imóvel não encontrado.</div>
        <div v-else class="max-w-5xl mx-auto bg-white shadow-lg rounded-2xl overflow-hidden">
          <img :src="imovel.foto || fallback" alt="Foto do imóvel" class="w-full h-[350px] object-cover" />
          <div class="p-6 sm:p-8">
            <h1 class="text-3xl font-bold text-mainblue mb-2">{{ imovel.nome }}</h1>
            <div v-if="imovel.prazoEntrega" class="inline-block bg-mainblue text-white text-xs font-semibold px-3 py-1 rounded-full mb-4">
              Entrega prevista: {{ imovel.prazoEntrega }}
            </div>
            <p v-if="imovel.descricao" class="text-gray-600 text-base mb-6">{{ imovel.descricao }}</p>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700 text-base">
              <div><span class="font-semibold">Preço:</span> {{ formatPrice(imovel.preco) }}</div>
              <div><span class="font-semibold">Quartos:</span> {{ imovel.quartos }}</div>
              <div><span class="font-semibold">Área:</span> {{ areaTratada }}</div>
              <div>
                <span class="font-semibold">Vaga de Garagem:</span>
                {{ imovel.vagaGaragem > 0 ? imovel.vagaGaragem : 'Sem vaga' }}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
    <Footer />
  </div>
</template>

<script>
import Footer from '../components/Footer.vue';
import Header from '../components/Header.vue';
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { computed } from 'vue';

export default {
  components: { Footer, Header },
  setup() {
    const route = useRoute();
    const imovel = ref(null);
    const erro = ref(null);
    const loading = ref(true);
    const fallback = '/default-placeholder.jpg';

    const areaTratada = computed(() => {
      if (imovel.value?.areaMin !== undefined && imovel.value?.areaMax !== undefined) {
        const min = imovel.value.areaMin;
        const max = imovel.value.areaMax;
        return min === max ? `${min} m²` : `${min} a ${max} m²`;
      }
      return 'Área N/D';
    });

    onMounted(async () => {
      try {
        const { id } = route.params;
        const res = await axios.get(`/api/imoveis/${id}`);
        imovel.value = res.data;
      } catch (err) {
        erro.value = 'Erro ao carregar imóvel';
      } finally {
        loading.value = false;
      }
    });

    const formatPrice = (valor) =>
      typeof valor === 'number' ? valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'N/D';

    return { imovel, erro, loading, fallback, formatPrice, areaTratada };
  }
};
</script>
