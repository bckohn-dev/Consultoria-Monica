<template>
  <section class="w-full sm:w-full max-w-7xl mx-auto my-16 pt-20 px-4 sm:px-8">
    <div class="mx-auto w-full max-w-[95%] sm:max-w-full">
      <div v-if="loading" class="text-center text-gray-600 py-8">Carregando destaques...</div>
      <div v-else-if="erro" class="text-center text-red-600 py-8">{{ erro }}</div>

      <Swiper
        v-else
        :modules="[SwiperNavigation, SwiperPagination]"
        :navigation="destaques.length > 1"
        :pagination="destaques.length > 1"
        :loop="destaques.length >= 3"
        :slides-per-view="1"
        :slides-per-group="1"
        class="rounded-lg overflow-hidden"
      >
        <SwiperSlide v-for="item in destaques" :key="item.id">
          <div
            class="relative h-[250px] w-full sm:h-auto sm:aspect-[16/6] cursor-pointer"
            @click="irParaImovel(item)"
            role="button"
            :aria-label="`Ver detalhes de ${item.nome}`"
            tabindex="0"
            @keyup.enter="irParaImovel(item)"
          >
            <img
              :src="item.foto"
              :alt="item.nome"
              class="w-full h-full object-cover object-center"
            />

            <!-- Faixa com o nome do imóvel -->
            <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent text-white p-4 sm:p-6">
              <h3 class="text-xl sm:text-2xl font-bold drop-shadow">
                {{ item.nome }}
              </h3>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  </section>
</template>

<script>
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import axios from 'axios'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

export default {
  components: { Swiper, SwiperSlide },
  setup() {
    const router = useRouter()
    const destaques = ref([])
    const loading = ref(true)
    const erro = ref('')
    const API_BASE = '/api/destaques'
    const ROTA_BASE = '/imovel'
    const fallbackImagem = '/placeholder-carrossel.jpg'

    async function carregarDestaques() {
      try {
        const res = await axios.get(API_BASE)
        const dados = Array.isArray(res.data) ? res.data : (res.data?.destaques || [])
        const normalizados = (dados || [])
          .filter(it => it && it.id && it.nome && it.foto)
          .map(it => ({ id: String(it.id), nome: String(it.nome), foto: String(it.foto) }))

        if (normalizados.length === 0) {
          destaques.value = [{ id: 'fallback', nome: 'Destaque', foto: fallbackImagem }]
        } else {
          destaques.value = normalizados
        }
      } catch (e) {
        console.error('Erro ao buscar destaques:', e)
        erro.value = 'Não foi possível carregar os destaques.'
        destaques.value = [{ id: 'erro', nome: 'Erro ao carregar', foto: fallbackImagem }]
      } finally {
        loading.value = false
      }
    }

    function irParaImovel(item) {
      if (!item?.id) return
      router.push(`${ROTA_BASE}/${item.id}`)
    }

    onMounted(carregarDestaques)

    return {
      SwiperNavigation: Navigation,
      SwiperPagination: Pagination,
      destaques,
      loading,
      erro,
      irParaImovel
    }
  }
}
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
