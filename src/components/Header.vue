<template>
  <a class="skip-link" href="#conteudo">Pular para o conteúdo</a>
  <header class="site-header" @keydown.esc="fecharMenu">
    <div class="header-inner">
      <router-link to="/" class="brand-lockup" aria-label="Mônica Nogueira, Consultoria Imobiliária — início">
        <img :src="Logo" class="brand-symbol" alt="Logo MC" width="66" height="66" />
        <span class="brand-wordmark"><strong>Mônica Nogueira</strong><span>Consultoria imobiliária</span></span>
      </router-link>
      <button ref="menuToggle" class="menu-toggle" @click="menuAberto = !menuAberto" :aria-expanded="menuAberto" aria-controls="primary-nav" :aria-label="menuAberto ? 'Fechar menu de navegação' : 'Abrir menu de navegação'"><X v-if="menuAberto" :size="22" /><Menu v-else :size="22" /></button>
      <nav id="primary-nav" class="primary-nav" :class="{ 'is-open': menuAberto }" aria-label="Navegação principal">
        <router-link v-for="item in menu" :key="item.rota" :to="item.rota" @click="menuAberto = false">{{ item.nome }}</router-link>
        <button ref="contactTrigger" class="header-contact" @click="abrirContato">Contato <ArrowUpRight :size="16" aria-hidden="true" /></button>
      </nav>
    </div>
  </header>
  <Teleport to="body">
    <dialog ref="dialog" class="contact-dialog" aria-labelledby="contact-title" @close="aoFechar" @click="fecharFora">
      <div class="contact-dialog-inner">
        <button class="dialog-close" @click="fecharContato" aria-label="Fechar contato"><X :size="21" /></button>
        <span class="contact-emblem"><MessageCircle :size="25" aria-hidden="true" /></span>
        <p class="eyebrow">UM CONTATO MAIS PRÓXIMO</p>
        <h2 id="contact-title">Vamos encontrar<br />o seu próximo lar?</h2>
        <p class="contact-description">Conte seus planos para a Mônica e descubra as possibilidades para o seu novo endereço.</p>
        <a class="contact-channel whatsapp-channel" href="https://wa.me/5511945413470" target="_blank" rel="noopener noreferrer"><MessageCircle :size="22" aria-hidden="true" /><span><strong>WhatsApp:</strong><span>(11) 94541-3470</span></span><ArrowUpRight :size="19" aria-hidden="true" /></a>
        <a class="contact-channel email-channel" href="mailto:monicanogueiravendas@gmail.com"><Mail :size="22" aria-hidden="true" /><span><strong>Email:</strong><span>monicanogueiravendas@gmail.com</span></span><ArrowUpRight :size="19" aria-hidden="true" /></a>
        <p class="contact-signature">Mônica Consultoria Imobiliária <span>·</span> CRECI SP 266907</p>
      </div>
    </dialog>
  </Teleport>
</template>
<script setup>
import { ref, watch, onBeforeUnmount } from 'vue'
import { Menu, X, MessageCircle, Mail, ArrowUpRight } from 'lucide-vue-next'
import Logo from '@/assets/brand-symbol.svg'
const emit = defineEmits(['toggle-menu'])
const menuAberto = ref(false), dialog = ref(null), contactTrigger = ref(null), menuToggle = ref(null)
const menu = [{nome:'Home',rota:'/'},{nome:'Catálogo',rota:'/catalogo'},{nome:'Sobre',rota:'/sobre'}]
let previousOverflow = ''
watch(menuAberto, value => emit('toggle-menu', value))
function fecharMenu(event) {
  if (!menuAberto.value) return
  event.preventDefault()
  menuAberto.value = false
  menuToggle.value?.focus()
}
function abrirContato() {
  menuAberto.value = false
  previousOverflow = document.body.style.overflow
  dialog.value.showModal()
  document.body.style.overflow = 'hidden'
}
function aoFechar() { document.body.style.overflow = previousOverflow; (window.matchMedia?.('(max-width: 680px)').matches ? menuToggle.value : contactTrigger.value)?.focus() }
function fecharContato() { dialog.value.close() }
function fecharFora(event) {
  if (event.target !== dialog.value) return
  const rect = dialog.value.getBoundingClientRect()
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) fecharContato()
}
onBeforeUnmount(() => { if (dialog.value?.open) { dialog.value.close(); document.body.style.overflow = previousOverflow } })
</script>
