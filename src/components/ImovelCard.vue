<template>
  <div
    class="border border-gold rounded-2xl p-4 shadow-md bg-white hover:shadow-[0_8px_20px_-4px_rgba(31,35,76,0.2)] transition-shadow duration-300 flex flex-col mx-2 sm:mx-0 h-full"
  >
    <!-- Imagem do imóvel -->
    <img
      :src="imovel.foto || fallbackImage"
      :alt="imovel.nome || 'Imagem do imóvel'"
      loading="lazy"
      @error="onImageError"
      class="w-full h-[200px] object-cover rounded-xl mb-4 transition-transform duration-300 hover:scale-[1.02]"
    />

    <!-- Conteúdo principal que cresce -->
    <div class="space-y-2 pb-4">
      <h3 class="text-2xl font-semibold text-mainblue">
        {{ imovel.nome || 'Sem nome' }}
      </h3>
      <hr class="my-2 border-gold" />

      <p class="text-gray-700">Preço: {{ formattedPrice }}</p>

      <p class="text-gray-700 flex items-center">
        <img src="../assets/icones/quartoIcon.png" alt="Quartos" class="w-6 h-6 mr-2" />
        Quartos: {{ typeof imovel.quartos === 'number' ? imovel.quartos : 'N/D' }}
      </p>

      <p class="text-gray-700 flex items-center">
        <img src="../assets/icones/areaIcon.png" alt="Área" class="w-6 h-6 mr-2" />
        <span>{{ areaTratada }}</span>
      </p>

      <p class="text-gray-700 flex items-center">
        <img src="../assets/icones/garagemIcon.png" alt="Garagem" class="w-6 h-6 mr-2" />
        Garagem: {{ imovel.vagaGaragem ? 'Sim' : 'Não' }}
      </p>

      <p class="text-gray-700 flex items-center">
        <img src="../assets/icones/suiteIcon.png" alt="Suíte" class="w-6 h-6 mr-2" />
        Suítes: {{ imovel.suite ? 'Sim' : 'Não' }}
      </p>
    </div>

    <!-- Botão fixo na base do card -->
    <button
      aria-label="Ver detalhes do imóvel"
      :disabled="loading"
      @click="verDetalhes"
      class="mt-auto bg-mainblue text-white px-4 py-2 h-11 rounded-md font-medium transform hover:scale-105 hover:bg-gold hover:text-mainblue hover:shadow-lg transition-all duration-300 disabled:opacity-50"
    >
      {{ loading ? 'Carregando...' : 'Ver Detalhes' }}
    </button>
  </div>
</template>

<script>
import { useRouter } from 'vue-router';
import { computed } from 'vue';

export default {
  props: {
    imovel: {
      type: Object,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const fallbackImage = '/default-placeholder.jpg';
    const router = useRouter();

    const verDetalhes = () => {
      router.push(`/imovel/${props.imovel.id}`);
    };

    const onImageError = (event) => {
      event.target.src = fallbackImage;
    };

    const formattedPrice = computed(() => {
      const price = props.imovel?.preco;
      return typeof price === 'number' && !isNaN(price)
        ? price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
        : 'Não informado';
    });

    const areaTratada = computed(() => {
      const { areaMin, areaMax } = props.imovel;
      if (typeof areaMin === 'number' && typeof areaMax === 'number') {
        return areaMin === areaMax
          ? `${areaMin} m²`
          : `${areaMin} a ${areaMax} m²`;
      }
      return 'Área N/D';
    });

    return {
      verDetalhes,
      onImageError,
      fallbackImage,
      formattedPrice,
      areaTratada,
      loading: props.loading,
    };
  },
};
</script>

<style scoped>
</style>
