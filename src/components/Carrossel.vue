<template>
  <section class="container mx-auto my-16 pt-20">
    <Swiper
      :modules="[SwiperNavigation, SwiperPagination]"
      navigation
      pagination
      :loop="destaques.length >= 3"
      :slides-per-view="1"
      :slides-per-group="1"
      class="rounded-lg overflow-hidden"
    >
      <SwiperSlide v-for="item in destaques" :key="item.id">
        <div class="relative">
          <img :src="item.foto" :alt="item.nome" class="w-full h-[300px] sm:h-[500px] object-cover" />
          <div class="absolute bottom-0 left-0 bg-black bg-opacity-50 text-white p-4 w-full">
            <h3 class="text-2xl font-bold">{{ item.nome }}</h3>
          </div>
        </div>
      </SwiperSlide>
    </Swiper>
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
    const fallbackImagem = '/placeholder-carrossel.jpg'; // Coloque essa imagem em /public

    onMounted(async () => {
      try {
        const res = await axios.get(API_BASE);
        console.log("Dados do carrossel:", res.data);

        if (!Array.isArray(res.data) || res.data.length === 0) {
          console.warn("⚠ Nenhuma imagem retornada do carrossel — usando imagem padrão");
          destaques.value = [{
            id: 'fallback',
            nome: 'Destaque',
            foto: fallbackImagem
          }];
          return;
        }

        destaques.value = res.data.map((url, i) => ({
          id: `img-${i}`,
          nome: `Destaque ${i + 1}`,
          foto: url,
        }));
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
  color: #BDB76B; /* Cor dourada */
  background: rgba(0, 0, 128, 0.5); /* Fundo azul marinho */
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
