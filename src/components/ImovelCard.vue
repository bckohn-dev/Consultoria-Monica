<template>
  <article class="property-card">
    <div class="property-photo">
      <img :src="imovel.foto || fallbackImage" :alt="imovel.nome || 'Imagem do imóvel'" loading="lazy" width="600" height="400" @error="onImageError" />
      <FaixaMarca :marca="imovel.marca" />
    </div>
    <div class="property-content">
      <p class="eyebrow">ENCONTRE SEU LUGAR</p>
      <h3>{{ imovel.nome || 'Imóvel disponível' }}</h3>
      <p class="property-price"><span>A partir de</span>{{ formattedPrice }}</p>
      <div class="property-facts">
        <span><BedDouble :size="18" aria-hidden="true" />Quartos: {{ imovel.quartos ?? 'N/D' }}</span>
        <span><Maximize :size="18" aria-hidden="true" />{{ areaTratada }}</span>
        <span><CarFront :size="18" aria-hidden="true" />{{ temGaragem ? 'Com garagem' : 'Sem garagem' }}</span>
        <span><Bath :size="18" aria-hidden="true" />{{ imovel.suite ? 'Com suíte' : 'Sem suíte' }}</span>
      </div>
      <button :disabled="loading" @click="verDetalhes" class="property-action" :aria-label="'Ver detalhes do imóvel ' + (imovel.nome || '')">{{ loading ? 'Carregando...' : 'Ver detalhes' }} <ArrowUpRight :size="19" aria-hidden="true" /></button>
    </div>
  </article>
</template>
<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { BedDouble, Maximize, CarFront, Bath, ArrowUpRight } from 'lucide-vue-next'
import FaixaMarca from './FaixaMarca.vue'
const props = defineProps({ imovel: { type: Object, required: true }, loading: { type: Boolean, default: false } })
const router = useRouter()
const fallbackImage = '/default-placeholder.jpg'
const temGaragem = computed(() => Boolean(props.imovel.vagaGaragem ?? props.imovel.garagem))
const formattedPrice = computed(() => {
  const value = props.imovel.preco
  return value != null && value !== '' && Number.isFinite(Number(value))
    ? Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'Sob consulta'
})
const areaTratada = computed(() => {
  const { areaMin, areaMax, area } = props.imovel
  if (areaMin != null && areaMax != null) return areaMin === areaMax ? areaMin + ' m²' : areaMin + ' a ' + areaMax + ' m²'
  return area != null ? area + ' m²' : 'Área sob consulta'
})
function onImageError(event) { event.target.onerror = null; if (!event.target.src.endsWith(fallbackImage)) event.target.src = fallbackImage }
function verDetalhes() { if (props.imovel.id) router.push('/imovel/' + encodeURIComponent(props.imovel.id)) }
</script>
