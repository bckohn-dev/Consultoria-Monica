<template>
  <section class="container mx-auto my-16 pt-20">
    <Swiper
      :modules="[SwiperNavigation, SwiperPagination]"
      navigation
      pagination
      :loop="true"
      class="rounded-lg overflow-hidden"
    >
      <SwiperSlide v-for="item in destaques" :key="item.id">
        <div class="relative">
          <img :src="item.foto" :alt="item.nome" class="w-full h-[500px] object-cover" />
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

export default {
  components: { Swiper, SwiperSlide },
  setup() {
    return { SwiperNavigation: Navigation, SwiperPagination: Pagination };
  },
  data() {
    return {
      destaques: [
        { id: 'apto-centro-01', nome: 'Apto Ouro Verde', foto: 'http://localhost:3000/imoveis/apto1.jpg' },
        { id: 'apto-praia-01', nome: 'Apto Praia Azul', foto: 'http://localhost:3000/imoveis/apto2.jpg' },
      ],
    };
  },
};
</script>

<style>
.swiper-button-next,
.swiper-button-prev {
  color: #ffffff;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  padding: 20px;
}
.swiper-pagination-bullet-active {
  background: #1e3a8a;
}
</style>