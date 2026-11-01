<template>
  <div class="site-page detail-page">
    <Header />
    <main id="conteudo" class="detail-shell">
      <router-link to="/catalogo" class="back-link"><ArrowLeft :size="16" aria-hidden="true" /> Voltar ao catálogo</router-link>
      <div v-if="loading" class="state-box" role="status">Carregando detalhes...</div>
      <div v-else-if="erro" class="state-box" role="alert"><p>{{ erro }}</p><button class="button-primary" @click="fetchImovel(route.params.id)">Tentar novamente</button></div>
      <p v-else-if="!imovel" class="state-box">Imóvel não encontrado.</p>
      <template v-else>
        <div class="detail-heading"><div><p class="eyebrow">UM NOVO CAPÍTULO COMEÇA AQUI</p><h1>{{ imovel.nome }}</h1></div><FaixaMarca :marca="imovel.marca" com-rotulo /></div>
        <div class="detail-layout">
          <div class="detail-main">
            <section class="detail-gallery" aria-label="Fotos do imóvel">
              <div class="detail-main-photo">
                <img :src="images[activeIndex]" :alt="(imovel.nome || 'Imóvel') + ' — foto ' + (activeIndex + 1)" width="1200" height="900" @error="onMainImageError" />
                <template v-if="images.length > 1">
                  <button class="gallery-arrow gallery-prev" @click="mudarFoto(-1)" aria-label="Foto anterior"><ChevronLeft :size="22" /></button>
                  <button class="gallery-arrow gallery-next" @click="mudarFoto(1)" aria-label="Próxima foto"><ChevronRight :size="22" /></button>
                  <span class="photo-counter" role="status"><Images :size="15" aria-hidden="true" />{{ activeIndex + 1 }} / {{ images.length }}</span>
                </template>
              </div>
              <div v-if="images.length > 1" class="detail-thumbs">
                <button v-for="(src, i) in images" :key="i" :class="{ selected: i === activeIndex }" @click="activeIndex = i" :aria-label="'Ver foto ' + (i + 1)" :aria-pressed="i === activeIndex"><img :src="src" :alt="'Miniatura ' + (i + 1)" loading="lazy" @error="onThumbError(i)($event)" /></button>
              </div>
            </section>
            <section class="detail-description">
              <p class="eyebrow">OS DETALHES FAZEM A DIFERENÇA</p><h2>Conheça o seu próximo espaço.</h2>
              <div class="detail-facts">
                <div><BedDouble :size="22" aria-hidden="true" /><strong>{{ imovel.quartos ?? 'Sob consulta' }}</strong><span>Quartos</span></div>
                <div><Maximize :size="22" aria-hidden="true" /><strong>{{ areaTratada }}</strong><span>Área privativa</span></div>
                <div><CarFront :size="22" aria-hidden="true" /><strong>{{ temGaragem ? 'Com vaga' : 'Sem vaga' }}</strong><span>Garagem</span></div>
                <div><Bath :size="22" aria-hidden="true" /><strong>{{ imovel.suite ? 'Com suíte' : 'Sem suíte' }}</strong><span>Suíte</span></div>
              </div>
              <h3>Sobre o imóvel</h3><p>{{ descricaoFormatada }}</p>
            </section>
          </div>
          <aside class="detail-inquiry" aria-label="Preço e atendimento">
            <p class="eyebrow">SEU PRÓXIMO ENDEREÇO</p>
            <p class="detail-price"><span>A partir de</span>{{ formatPrice(imovel.preco) }}</p>
            <p v-if="imovel.prazoEntrega" class="delivery-note">Entrega prevista <strong>{{ imovel.prazoEntrega }}</strong></p>
            <div class="inquiry-divider"></div>
            <h2>Gostou deste imóvel?</h2><p>Converse com a Mônica para saber mais e dar o próximo passo.</p>
            <a :href="contatoUrl" target="_blank" rel="noopener noreferrer" class="button-primary">Tenho interesse <ArrowUpRight :size="18" aria-hidden="true" /></a>
            <a href="mailto:monicanogueiravendas@gmail.com" class="inquiry-email">Prefiro conversar por e-mail</a>
            <small>Valores e disponibilidade sujeitos a confirmação.</small>
          </aside>
        </div>
      </template>
    </main>
    <Footer />
  </div>
</template>
<script setup>
import FaixaMarca from '../components/FaixaMarca.vue'
import Footer from '../components/Footer.vue'
import Header from '../components/Header.vue'
import axios from 'axios'
import { useRoute } from 'vue-router'
import { ref, computed, watch, onBeforeUnmount } from 'vue'
import { ArrowLeft, ArrowUpRight, BedDouble, Maximize, CarFront, Bath, ChevronLeft, ChevronRight, Images } from 'lucide-vue-next'

const route = useRoute()
const imovel = ref(null)
const erro = ref(null)
const loading = ref(true)
const fallback = '/default-placeholder.jpg'
const activeIndex = ref(0)

// Capa + lista, sem duplicar, com fallback
const images = computed(() => {
  const lista = []
  if (imovel.value?.foto) lista.push(imovel.value.foto)
  if (Array.isArray(imovel.value?.fotos)) lista.push(...imovel.value.fotos)
  const unicas = Array.from(new Set(lista.filter(Boolean)))
  return unicas.length > 0 ? unicas : [fallback]
})

// zera o índice quando o imóvel mudar
watch(() => imovel.value?.id, () => { activeIndex.value = 0 })

let controller, request = 0
async function fetchImovel(id) {
  const current = ++request
  controller?.abort()
  controller = new AbortController()
  imovel.value = null
  activeIndex.value = 0
  loading.value = true
  erro.value = null
  try {
    const res = await axios.get(`/api/imoveis/${encodeURIComponent(id)}`, { signal: controller.signal })
    if (current === request) imovel.value = res.data
  } catch (e) {
    if (current === request && e.code !== 'ERR_CANCELED') erro.value = 'Não foi possível carregar este imóvel. Tente novamente.'
  } finally {
    if (current === request) loading.value = false
  }
}

// carrega na 1ª vez e quando o parâmetro mudar
watch(() => route.params.id, (id) => { if (id) fetchImovel(id) }, { immediate: true })

function onMainImageError(e) { e.target.onerror = null; if (!e.target.src.endsWith(fallback)) e.target.src = fallback }
function onThumbError(i) { return (e) => { e.target.onerror = null; if (!e.target.src.endsWith(fallback)) e.target.src = fallback } }

const areaTratada = computed(() => {
  if (imovel.value?.areaMin !== undefined && imovel.value?.areaMax !== undefined) {
    const min = imovel.value.areaMin
    const max = imovel.value.areaMax
    return min === max ? `${min} m²` : `${min} a ${max} m²`
  }
  return imovel.value?.area != null ? imovel.value.area + ' m²' : 'Sob consulta'
})


const formatPrice = valor =>
  valor != null && valor !== '' && Number.isFinite(Number(valor))
    ? Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'Sob consulta'
const descricaoFormatada = computed(() => {
  const texto = imovel.value?.descricao
  if (!texto) return 'Fale com a Mônica para conhecer todos os detalhes deste imóvel.'
  // Normalize escaped newlines from stored copy; retain Vue's safe text rendering.
  return String(texto).replace(/\\r\\n|\\n|\\r/g, '\n').replace(/\r\n?/g, '\n')
})
const temGaragem = computed(() => Boolean(imovel.value?.vagaGaragem ?? imovel.value?.garagem))
const contatoUrl = computed(() => 'https://wa.me/5511945413470?text=' + encodeURIComponent('Olá, Mônica! Tenho interesse no imóvel ' + (imovel.value?.nome || '') + '. Pode me passar mais informações?'))
function mudarFoto(delta) { activeIndex.value = (activeIndex.value + delta + images.value.length) % images.value.length }
onBeforeUnmount(() => { request++; controller?.abort() })
</script>
