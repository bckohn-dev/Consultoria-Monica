<template>
  <div
    class="border border-gold rounded-lg p-4 shadow-md bg-white hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between h-[450px] mx-2 sm:mx-0"
  >
    <img
      :src="imovel.foto || fallbackImage"
      :alt="imovel.nome || 'Imagem do imóvel'"
      loading="lazy"
      @error="onImageError"
      class="w-full h-[200px] object-cover rounded-md mb-2"
    />
    <div class="flex-grow">
      <h3 class="text-xl font-semibold text-navy">
        {{ imovel.nome || 'Sem nome' }}
      </h3>
      <hr class="my-2 border-gold" />
      <p class="text-gray-600">
        Preço: {{ formattedPrice }}
      </p>
      <p class="text-gray-600 flex items-center">
        <HomeIcon class="w-5 h-5 mr-2" />
        Quartos: {{ typeof imovel.quartos === 'number' ? imovel.quartos : 'N/D' }}
      </p>

      <p class="text-gray-600 flex items-center">
        <img src="../assets/icones/areaIcon.png" alt="Área" class="w-5 h-5 mr-2" />
        {{ imovel.area !== undefined ? `${imovel.area}m²` : 'Área N/D' }}
      </p>

    </div>
    <button
      aria-label="Ver detalhes do imóvel"
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
    async verDetalhes() {
      this.loading = true;
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        this.$emit('ver-detalhes', this.imovel);
      } finally {
        this.loading = false;
      }
    },
    onImageError(event) {
      event.target.src = this.fallbackImage;
    },
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