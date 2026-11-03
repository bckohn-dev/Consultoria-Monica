<template>
  <section class="featured-carousel" aria-label="Imóveis em destaque">
    <div v-if="loading" class="feature-state" role="status">Carregando destaques...</div>
    <div v-else-if="erro" class="feature-state"><p>{{ erro }}</p><router-link to="/catalogo">Explorar o catálogo →</router-link></div>
    <Swiper v-else :modules="[SwiperNavigation, SwiperPagination, SwiperA11y, SwiperKeyboard]" :keyboard="{ enabled: true, onlyInViewport: true }" :navigation="destaques.length > 1" :pagination="destaques.length > 1 ? { clickable: true } : false" :a11y="{ prevSlideMessage: 'Imóvel anterior', nextSlideMessage: 'Próximo imóvel', paginationBulletMessage: 'Ir para o destaque {{index}}' }" :loop="destaques.length >= 3" :slides-per-view="1">
      <SwiperSlide v-for="item in destaques" :key="item.id">
        <router-link :to="['fallback', 'erro'].includes(item.id) ? '/catalogo' : '/imovel/' + encodeURIComponent(item.id)" class="feature-image-link" :aria-label="'Ver detalhes de ' + item.nome">
          <img :src="item.foto" :alt="'Imagem do imóvel ' + item.nome" width="900" height="700" />
          <div class="feature-caption"><FaixaMarca :marca="item.marca" /><span class="feature-title">{{ item.nome }}</span><span class="feature-discover">Conhecer imóvel <span aria-hidden="true">↗</span></span></div>
        </router-link>
      </SwiperSlide>
    </Swiper>
  </section>
</template>
<script>
import { ref, onMounted } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Pagination, A11y, Keyboard } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { api } from '@/services/api'
import FaixaMarca from '@/components/FaixaMarca.vue'

export default {
  components: { Swiper, SwiperSlide, FaixaMarca },
  setup() {
    const destaques = ref([])
    const loading = ref(true)
    const erro = ref('')
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

    onMounted(carregarDestaques)

    return {
      SwiperNavigation: Navigation,
      SwiperA11y: A11y,
      SwiperKeyboard: Keyboard,
      SwiperPagination: Pagination,
      destaques,
      loading,
      erro
    }
  }
}
</script>
