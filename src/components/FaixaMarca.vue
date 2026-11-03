<template>
  <span v-if="marcaAtual && comRotulo" class="brand-attribution"><span class="brand-attribution-label">Marca do empreendimento</span><span class="brand-badge" :style="{ '--brand-accent': marcaAtual.cor }"><span class="brand-dot" aria-hidden="true"></span>{{ marcaAtual.label }}</span></span>
  <span v-else-if="marcaAtual" class="brand-badge" :style="{ '--brand-accent': marcaAtual.cor }"><span class="brand-dot" aria-hidden="true"></span>{{ marcaAtual.label }}</span>
</template>
<script setup>
import { computed } from 'vue'
const props = defineProps({ marca: { type: String, default: '' }, comRotulo: { type: Boolean, default: false } })
const marcas = { vibra: { label: 'VIBRA', cor: '#cc601e' }, muda: { label: 'MUDA', cor: '#377144' }, tipu: { label: 'TIPU', cor: '#286fba' } }
const marcaAtual = computed(() => marcas[props.marca?.trim().toLowerCase()] || null)
</script>
