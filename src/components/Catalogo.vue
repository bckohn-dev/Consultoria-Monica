<template>
  <section id="catalogo" class="catalog-shell" aria-labelledby="catalog-title">
    <div class="section-heading">
      <div><p class="eyebrow">IMÓVEIS PARA O SEU MOMENTO</p><h2 id="catalog-title">Seu próximo endereço começa aqui.</h2></div>
      <p>Explore as opções e encontre o espaço que combina com você.</p>
    </div>
    <form class="search-panel" @submit.prevent="buscarImoveis">
      <label>Quartos<select v-model="filtros.quartos" @change="buscarImoveis"><option value="">Todos</option><option value="1">1 quarto</option><option value="2">2 quartos</option><option value="3">3 ou mais</option></select></label>
      <label>Garagem<select v-model="filtros.garagem" @change="buscarImoveis"><option value="">Todas</option><option value="true">Com garagem</option><option value="false">Sem garagem</option></select></label>
      <label>Suíte<select v-model="filtros.suite" @change="buscarImoveis"><option value="">Todas</option><option value="true">Com suíte</option><option value="false">Sem suíte</option></select></label>
      <label>Preço mínimo (R$)<input v-model="filtros.precoMin" type="number" min="0" step="any" placeholder="Sem mínimo" @input="agendarBusca" /></label>
      <label>Preço máximo (R$)<input v-model="filtros.precoMax" type="number" min="0" step="any" placeholder="Sem máximo" @input="agendarBusca" /></label>
      <button type="submit" class="button-primary">Buscar imóveis</button>
      <button type="button" class="clear-filters" @click="resetarFiltros">Limpar filtros</button>
    </form>
    <p v-if="validacao" class="state-box" role="alert">{{ validacao }}</p>
    <div class="results-bar">
      <p role="status">{{ loading ? 'Buscando imóveis…' : imoveis.length + (imoveis.length === 1 ? ' imóvel encontrado' : ' imóveis encontrados') }}</p>
      <label>Ordenar por <select v-model="ordem"><option value="">Ordem do catálogo</option><option value="menor">Menor preço</option><option value="maior">Maior preço</option></select></label>
    </div>
    <div v-if="loading" class="state-box" role="status">Carregando...</div>
    <div v-else-if="error" class="state-box" role="alert"><p>{{ error }}</p><button class="button-primary" @click="buscarImoveis">Tentar novamente</button></div>
    <div v-else-if="imoveis.length === 0" class="state-box"><h3>Nenhum imóvel encontrado.</h3><p>Experimente ampliar a faixa de preço ou limpar os filtros.</p><button class="clear-filters" @click="resetarFiltros">Limpar filtros</button></div>
    <div v-else class="property-grid"><ImovelCard v-for="imovel in ordenados" :key="imovel.id" :imovel="imovel" /></div>
  </section>
</template>
<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import axios from 'axios'
import ImovelCard from './ImovelCard.vue'
const vazio = () => ({ quartos: '', precoMin: '', precoMax: '', garagem: '', suite: '' })
const imoveis = ref([]), filtros = ref(vazio()), loading = ref(false), error = ref(null), validacao = ref(''), ordem = ref('')
let timer, controller, request = 0
const ordenados = computed(() => {
  if (!ordem.value) return imoveis.value
  const price = item => item.preco !== '' && item.preco != null && Number.isFinite(Number(item.preco)) ? Number(item.preco) : null
  return [...imoveis.value].sort((a,b) => {
    const x = price(a), y = price(b)
    if (x === null) return y === null ? 0 : 1
    if (y === null) return -1
    return ordem.value === 'menor' ? x-y : y-x
  })
})
function agendarBusca() {
  clearTimeout(timer)
  // Invalidate in-flight responses immediately while the visitor is typing.
  request++
  controller?.abort()
  timer = setTimeout(buscarImoveis, 350)
}
async function buscarImoveis() {
  clearTimeout(timer)
  const current = ++request
  controller?.abort()
  validacao.value = ''
  const { precoMin, precoMax } = filtros.value
  if ((precoMin !== '' && Number(precoMin) < 0) || (precoMax !== '' && Number(precoMax) < 0) ||
      (precoMin !== '' && precoMax !== '' && Number(precoMin) > Number(precoMax))) {
    validacao.value = 'Informe uma faixa de preço válida: o mínimo deve ser menor ou igual ao máximo.'
    loading.value = false
    return
  }
  controller = new AbortController()
  loading.value = true
  error.value = null
  try {
    const params = Object.fromEntries(Object.entries(filtros.value).filter(([,v]) => v !== ''))
    const response = await axios.get('/api/imoveis', { params, signal: controller.signal })
    if (current === request) imoveis.value = Array.isArray(response.data) ? response.data : []
  } catch (err) {
    if (current === request && err.code !== 'ERR_CANCELED') error.value = 'Erro ao buscar imóveis. Tente novamente.'
  } finally {
    if (current === request) loading.value = false
  }
}
function resetarFiltros() { filtros.value = vazio(); buscarImoveis() }
onMounted(buscarImoveis)
onBeforeUnmount(() => { clearTimeout(timer); request++; controller?.abort() })
</script>
