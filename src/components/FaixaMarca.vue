<template>
  <div
    class="absolute inset-x-0 bottom-0 h-8 sm:h-10 border-t border-black/20 flex items-center"
    :style="{ backgroundColor: estilo.bg, color: estilo.fg }"
    aria-hidden="true"
  >
    <span class="pl-3 sm:pl-4 font-bold tracking-widest text-xs sm:text-sm">
      {{ estilo.label }}
    </span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  marca: { type: String, default: '' } // vibra | muda | tipu
})

const MARCAS = {
  vibra: { label: 'VIBRA', bg: '#FF7A22', fg: '#FFFFFF' },
  muda:  { label: 'MUDA',  bg: '#2E7D32', fg: '#FFFFFF' },
  tipu:  { label: 'TIPU',  bg: '#1E88E5', fg: '#FFFFFF' },
  default: { label: 'IMÓVEL', bg: '#374151', fg: '#FFFFFF' }
}

const estilo = computed(() => MARCAS[props.marca?.toLowerCase()] || MARCAS.default)
</script>
