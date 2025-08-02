<template>
  <div class="min-h-screen flex flex-col">
    <Header />
    <main class="flex-grow">
      <section class="container mx-auto py-10">
        <div v-if="loading" class="text-center">Carregando detalhes...</div>
        <div v-else-if="erro" class="text-center text-red-600">{{ erro }}</div>
        <div v-else-if="!imovel" class="text-center">Imóvel não encontrado.</div>
        <div v-else class="max-w-4xl mx-auto bg-white shadow-md p-6 rounded-lg">
          <img :src="imovel.foto || fallback" alt="Foto" class="w-full h-[300px] object-cover rounded mb-4" />
          <h1 class="text-3xl font-bold text-mainblue mb-2">{{ imovel.nome }}</h1>
          <p><strong>Preço:</strong> {{ formatPrice(imovel.preco) }}</p>
          <p><strong>Quartos:</strong> {{ imovel.quartos }}</p>
          <p><strong>Área:</strong> {{ imovel.area }}m²</p>
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

export default {
  components: { Footer, Header },
  setup() {
    const route = useRoute();
    const imovel = ref(null);
    const erro = ref(null);
    const loading = ref(true);
    const fallback = '/default-placeholder.jpg';

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

    return { imovel, erro, loading, fallback, formatPrice };
  }
};
</script>
