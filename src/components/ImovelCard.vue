<template>
  <div
    class="border border-gold rounded-2xl p-4 pb-6 shadow-md bg-white hover:shadow-[0_8px_20px_-4px_rgba(31,35,76,0.2)] transition-shadow duration-300 flex flex-col justify-between h-[470px] mx-2 sm:mx-0"
  >
    <img
      :src="imovel.foto || fallbackImage"
      :alt="imovel.nome || 'Imagem do imóvel'"
      loading="lazy"
      @error="onImageError"
      class="w-full h-[200px] object-cover rounded-xl mb-4 transition-transform duration-300 hover:scale-[1.02]"
    />

    <div class="flex-grow space-y-2">
      <h3 class="text-2xl font-semibold text-mainblue">
        {{ imovel.nome || 'Sem nome' }}
      </h3>
      <hr class="my-2 border-gold" />

      <p class="text-gray-700">Preço: {{ formattedPrice }}</p>

      <p class="text-gray-700 flex items-center">
        <HomeIcon class="w-5 h-5 mr-2" />
        Quartos: {{ typeof imovel.quartos === 'number' ? imovel.quartos : 'N/D' }}
      </p>

      <p class="text-gray-700 flex items-center">
        <img src="../assets/icones/areaIcon.png" alt="Área" class="w-5 h-5 mr-2" />
        {{ imovel.area !== undefined ? `${imovel.area}m²` : 'Área N/D' }}
      </p>
    </div>

    <button
      aria-label="Ver detalhes do imóvel"
      :disabled="loading"
      @click="verDetalhes"
      class="mt-4 bg-mainblue text-white px-4 py-2 h-11 rounded-md font-medium transform hover:scale-105 hover:bg-gold hover:text-mainblue hover:shadow-lg transition-all duration-300 disabled:opacity-50"
    >
      {{ loading ? 'Carregando...' : 'Ver Detalhes' }}
    </button>
  </div>
</template>


<script>
import { HomeIcon } from '@heroicons/vue/24/outline';

export default {
  props: {
    imovel: {
      type: Object,
      required: true,
    },
  },
  components: {
    HomeIcon,
  },
  data() {
    return {
      loading: false,
      fallbackImage: '/default-placeholder.jpg',
    };
  },
  methods: {
    methods: {
      verDetalhes() {
        this.$router.push(`/imovel/${this.imovel.id}`);
      },
      onImageError(event) {
        event.target.src = this.fallbackImage;
      }
    },
  computed: {
    formattedPrice() {
      const price = this.imovel?.preco;
      return typeof price === 'number' && !isNaN(price)
        ? price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
        : 'Não informado';
    }
  },
  mounted() {
    const img = this.$el.querySelector('img');
    if (img && !img.complete) {
      img.addEventListener('error', this.onImageError);
    }
  }
  },
};
</script>

<style>
</style>