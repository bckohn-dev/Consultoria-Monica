<template>
  <!-- só renderiza a faixa se houver marca válida -->
  <div
    v-if="estilo"
    class="absolute inset-x-0 bottom-0 h-8 sm:h-10 border-t border-black/20 flex items-center"
    :style="{ backgroundColor: estilo.bg, color: estilo.fg }"
    aria-hidden="true"
  >
    <span class="pl-3 sm:pl-4 font-brand font-extrabold tracking-widebrand text-xs sm:text-sm">
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
}

const estilo = computed(() => {
  const key = props.marca?.toLowerCase()
  return key && MARCAS[key] ? MARCAS[key] : null   // <- null = não renderiza
})
</script>
