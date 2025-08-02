<template>
  <section class="w-full sm:w-full max-w-7xl mx-auto my-16 pt-20 px-4 sm:px-8">
    <div class="mx-auto w-full max-w-[95%] sm:max-w-full">
      <Swiper
        :modules="[SwiperNavigation, SwiperPagination]"
        :navigation="destaques.length > 1"
        :pagination="destaques.length > 1"
        :loop="destaques.length >= 3"
        :slides-per-view="1"
        :slides-per-group="1"
        class="rounded-lg overflow-hidden"
      >
        <SwiperSlide v-for="item in destaques" :key="item.id">
          <div class="relative h-[250px] w-full sm:h-auto sm:aspect-[16/6]">
            <img
              :src="item.foto"
              :alt="item.nome"
              class="w-full h-full object-cover object-center"
            />
            <div class="absolute bottom-0 left-0 bg-black bg-opacity-50 text-white p-4 w-full">
              <h3 class="text-2xl font-bold">{{ item.nome }}</h3>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  </section>
</template>

<script>
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import axios from 'axios';
import { ref, onMounted } from 'vue';

export default {
  components: { Swiper, SwiperSlide },
  setup() {
    const destaques = ref([]);
    const API_BASE = '/api/carrossel';
    const fallbackImagem = '/placeholder-carrossel.jpg'; // certifique-se que essa imagem está em /public

    onMounted(async () => {
      try {
        const res = await axios.get(API_BASE);

        let imagens = [];

        // Tratar casos onde o backend retorna array de strings (urls) ou array de objetos
        if (Array.isArray(res.data)) {
          imagens = res.data;
        } else if (Array.isArray(res.data.imagens)) {
          imagens = res.data.imagens;
        }
        
        // 🔍 Normalizar para objetos válidos com id/nome/foto
        const destaquesNormalizados = imagens
        .filter((url) =>
          typeof url === 'string' &&
          url.trim() !== '' &&
          url.startsWith('https://') &&
          /\.(jpe?g|png|webp|gif)(\?|$)/i.test(url)
        )
        .map((url, i) => ({
          id: `img-${i}`,
          nome: `Destaque ${i + 1}`,
          foto: url
        }));


        if (destaquesNormalizados.length > 0) {
          destaques.value = destaquesNormalizados;
        } else {
          console.warn("⚠ Nenhuma imagem válida — usando imagem padrão");
          destaques.value = [{
            id: 'fallback',
            nome: 'Destaque',
            foto: fallbackImagem
          }];
        }
      } catch (err) {
        console.error("Erro ao buscar carrossel:", err);
        destaques.value = [{
          id: 'erro',
          nome: 'Erro ao carregar',
          foto: fallbackImagem
        }];
      }
    });

    return {
      SwiperNavigation: Navigation,
      SwiperPagination: Pagination,
      destaques
    };
  }
};
</script>

<style>
.swiper-button-next,
.swiper-button-prev {
  color: #BDB76B; /* Dourado */
  background: rgba(0, 0, 128, 0.5); /* Azul marinho transparente */
  border-radius: 50%;
  padding: 20px;
  transition: background 0.3s ease;
}
.swiper-button-next:hover,
.swiper-button-prev:hover {
  background: rgba(0, 0, 128, 0.7);
}
.swiper-pagination-bullet-active {
  background: #BDB76B;
}
</style>
