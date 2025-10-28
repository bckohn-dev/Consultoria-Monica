<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <Header />
    <main class="flex-grow">
      <section class="container mx-auto py-10 px-4">
        <div v-if="loading" class="text-center text-gray-600">Carregando detalhes...</div>
        <div v-else-if="erro" class="text-center text-red-600">{{ erro }}</div>
        <div v-else-if="!imovel" class="text-center text-gray-600">Imóvel não encontrado.</div>
        <div v-else class="max-w-5xl mx-auto bg-white shadow-lg rounded-2xl overflow-hidden">
          <!-- Galeria de imagens -->
          <div class="bg-black/5">
            <div class="relative w-full h-[350px] sm:h-[420px] overflow-hidden">
              <img
                :src="images[activeIndex]"
                :alt="`${imovel?.nome || 'Imóvel'} - foto ${activeIndex + 1}`"
                class="w-full h-full object-cover"
                loading="lazy"
                @error="onMainImageError"
              />
              <!-- contador -->
              <div
                v-if="images.length > 1"
                class="absolute bottom-3 right-3 text-xs px-2 py-1 rounded bg-black/60 text-white"
              >
                {{ activeIndex + 1 }} / {{ images.length }}
              </div>
              
              <!-- FAIXA DE MARCA EMBAIXO DA FOTO -->
              <FaixaMarca :marca="imovel?.marca" />

            </div>

            <!-- Miniaturas -->
            <div v-if="images.length > 1" class="flex gap-2 p-3 overflow-x-auto">
              <button
                v-for="(src, i) in images"
                :key="i"
                class="relative flex-shrink-0 w-20 h-16 rounded overflow-hidden border"
                :class="i === activeIndex ? 'border-mainblue ring-2 ring-mainblue/40' : 'border-gray-200'"
                @click="activeIndex = i"
                aria-label="Ver miniatura"
              >
                <img
                  :src="src"
                  :alt="`Miniatura ${i + 1}`"
                  class="w-full h-full object-cover"
                  loading="lazy"
                  @error="onThumbError(i)"
                />
              </button>
            </div>
          </div>

          <div class="p-6 sm:p-8">
            <h1 class="text-3xl font-bold text-mainblue mb-2">{{ imovel.nome }}</h1>
            <div v-if="imovel.prazoEntrega" class="inline-block bg-mainblue text-white text-xs font-semibold px-3 py-1 rounded-full mb-4">
              Entrega prevista: {{ imovel.prazoEntrega }}
            </div>
            <p v-if="imovel.descricao" class="text-gray-600 text-base mb-6">{{ imovel.descricao }}</p>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700 text-base">
              <div><span class="font-semibold">Preço:</span> {{ formatPrice(imovel.preco) }}</div>
              <div><span class="font-semibold">Quartos:</span> {{ imovel.quartos }}</div>
              <div><span class="font-semibold">Área:</span> {{ areaTratada }}</div>
              <div>
                <span class="font-semibold">Vaga de Garagem:</span>
                {{ imovel.vagaGaragem > 0 ? 'Sim' : 'Sem vaga' }}
              </div>
            </div>
          </div>
        </div>
      </section>
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
import { ref, computed, watch } from 'vue'

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

async function fetchImovel(id) {
  loading.value = true
  erro.value = null
  try {
    const res = await axios.get(`/api/imoveis/${id}`)
    imovel.value = res.data
  } catch (e) {
    erro.value = 'Erro ao carregar imóvel'
  } finally {
    loading.value = false
  }
}

// carrega na 1ª vez e quando o parâmetro mudar
watch(() => route.params.id, (id) => { if (id) fetchImovel(id) }, { immediate: true })

function onMainImageError(e) { e.target.src = fallback }
function onThumbError(i) { return (e) => { if (images.value[i] !== fallback) e.target.src = fallback } }

const areaTratada = computed(() => {
  if (imovel.value?.areaMin !== undefined && imovel.value?.areaMax !== undefined) {
    const min = imovel.value.areaMin
    const max = imovel.value.areaMax
    return min === max ? `${min} m²` : `${min} a ${max} m²`
  }
  return 'Área N/D'
})

const formatPrice = (valor) =>
  typeof valor === 'number'
    ? valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    : 'N/D'
</script>
