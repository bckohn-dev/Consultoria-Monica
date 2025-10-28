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
            :aria-label="`Ver detalhes de ${item.nome || item.id}`"
            tabindex="0"
            @keyup.enter="irParaImovel(item)"
          >
            <img
              :src="item.foto"
              :alt="`Imagem do imóvel ${item.nome || item.id}`"
              class="w-full h-full object-cover object-center"
            />

            <!-- Titulo imovel -->
            <div
              class="absolute inset-x-0 bottom-0
                    bg-gradient-to-t from-black/70 via-black/40 to-transparent
                    text-white p-4 sm:p-6"
              :class="item.marca ? 'pb-10 sm:pb-12' : ''"  <!-- reserva o espaço da faixa -->
            >
              <h3 class="text-xl sm:text-2xl font-bold drop-shadow">
                {{ item.nome || 'Imóvel' }}
              </h3>
            </div>

            <!-- faixa de marca -->
            <FaixaMarca :marca="item.marca" />
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  </section>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { api } from '@/services/api'
import FaixaMarca from '@/components/FaixaMarca.vue'

export default {
  components: { Swiper, SwiperSlide, FaixaMarca },
  setup() {
    const router = useRouter()
    const destaques = ref([])
    const loading = ref(true)
    const erro = ref('')
    const ROTA_BASE = '/imovel'
    const fallbackImagem = '/placeholder-carrossel.jpg'

    async function carregarDestaques() {
      loading.value = true
      erro.value = ''
      try {
        const { data } = await api.get('/destaques')
        const lista = Array.isArray(data) ? data : (data?.destaques || [])
        const normalizados = (lista || [])
          .filter(it => it && it.id && it.foto)
          .map(it => ({
            id: String(it.id),
            nome: it.nome ? String(it.nome) : `Imóvel ${it.id}`,
            foto: String(it.foto),
            marca: (it.marca || '').toLowerCase()
          }))
        destaques.value = normalizados.length
          ? normalizados
          : [{ id: 'fallback', nome: 'Destaque', foto: fallbackImagem, marca: '' }]
      } catch (e) {
        console.error('Erro ao buscar destaques:', e)
        erro.value = 'Não foi possível carregar os destaques.'
        destaques.value = [{ id: 'erro', nome: 'Erro ao carregar', foto: fallbackImagem, marca: '' }]
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
