<template>
  <div class="site-page">
    <Header />
    <main id="conteudo">
      <section class="home-hero">
        <div class="hero-copy">
          <p class="eyebrow">MÔNICA CONSULTORIA IMOBILIÁRIA</p>
          <h1>Um novo endereço.<br /><em>Novas possibilidades.</em></h1>
          <p class="hero-description">Encontre o imóvel que acompanha seus planos. Conte com uma consultoria próxima, do primeiro contato à escolha do seu novo lar.</p>
          <div class="hero-actions"><a href="#catalogo" class="button-primary">Explorar imóveis <span aria-hidden="true">↗</span></a><a href="https://wa.me/5511945413470" target="_blank" rel="noopener noreferrer" class="button-outline">Conversar com a Mônica</a></div>
          <div class="hero-note"><span aria-hidden="true">✦</span> Atendimento humano. Escolhas com confiança.</div>
        </div>
        <div class="hero-feature"><p class="eyebrow">CONHEÇA OS DESTAQUES</p><Carrossel /></div>
      </section>
      <div class="trust-strip"><span>Consultoria personalizada</span><span>Imóveis para diferentes planos</span><span>Proximidade em cada etapa</span></div>
      <Catalogo />
      <section class="contact-banner"><div><p class="eyebrow">VAMOS CONVERSAR?</p><h2>O imóvel ideal começa com uma boa conversa.</h2><p>Conte o que você procura. Vamos explorar as possibilidades juntos.</p></div><a href="https://wa.me/5511945413470" target="_blank" rel="noopener noreferrer" class="button-primary">Falar pelo WhatsApp ↗</a></section>
    </main>
    <Footer />
  </div>
</template>
<script setup>
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
import Catalogo from '../components/Catalogo.vue'
import Carrossel from '../components/Carrossel.vue'
</script>
