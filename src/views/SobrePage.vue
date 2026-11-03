<template>
  <div class="site-page">
    <Header />
    <main id="conteudo" tabindex="-1" class="about-shell">
      <section class="about-intro" aria-labelledby="about-title">
        <div><p class="eyebrow">SOBRE A MÔNICA CONSULTORIA</p><h1 id="about-title">Imóveis conectam.<br /><em>Pessoas fazem a diferença.</em></h1></div>
        <div class="about-intro-copy"><p>Encontrar um imóvel é dar espaço a novos planos. Na Mônica Consultoria, ajudamos você nessa escolha com atendimento personalizado, transparência e proximidade.</p></div>
      </section>
      <section class="about-principles" aria-label="Missão, visão e valores">
        <article><span class="principle-number">01 / PROPÓSITO</span><Target :size="26" aria-hidden="true" /><h2>Missão</h2><p>Conectar pessoas aos imóveis dos seus sonhos, com atendimento personalizado e soluções inovadoras.</p></article>
        <article><span class="principle-number">02 / DIREÇÃO</span><Compass :size="26" aria-hidden="true" /><h2>Visão</h2><p>Ser referência em consultoria imobiliária, reconhecida pela excelência e confiança dos clientes.</p></article>
        <article><span class="principle-number">03 / ESSÊNCIA</span><HeartHandshake :size="26" aria-hidden="true" /><h2>Valores</h2><ul><li>Ética e transparência</li><li>Compromisso com o cliente</li><li>Inovação e qualidade</li><li>Respeito e responsabilidade social</li></ul></article>
      </section>
      <section class="about-services" aria-labelledby="services-title">
        <div class="about-section-heading"><p class="eyebrow">COMO PODEMOS AJUDAR</p><h2 id="services-title">Uma orientação próxima.<br />Em cada etapa da sua escolha.</h2><p>Conheça os serviços da nossa consultoria imobiliária.</p></div>
        <div class="service-list">
          <article><span class="service-icon"><House :size="25" aria-hidden="true" /></span><div><h3>Compra e venda</h3><p>Consultoria completa na compra e venda de imóveis residenciais e comerciais.</p></div></article>
          <article><span class="service-icon"><Handshake :size="25" aria-hidden="true" /></span><div><h3>Intermediação</h3><p>Apoio em negociações seguras e transparentes entre as partes envolvidas.</p></div></article>
        </div>
      </section>
      <section class="about-contact" aria-labelledby="about-contact-title">
        <div><p class="eyebrow">O PRÓXIMO PASSO É UMA CONVERSA</p><h2 id="about-contact-title">Vamos falar sobre<br />os seus planos?</h2><p>Estamos à disposição para ajudar você a encontrar o imóvel ideal.</p></div>
        <div class="about-contact-actions">
          <a href="https://wa.me/5511945413470" target="_blank" rel="noopener noreferrer" class="button-primary">Conversar pelo WhatsApp <ArrowUpRight :size="18" aria-hidden="true" /></a>
          <a href="mailto:monicanogueiravendas@gmail.com"><Mail :size="18" aria-hidden="true" /><span>monicanogueiravendas@gmail.com</span></a>
          <a href="tel:+5511945413470"><Phone :size="18" aria-hidden="true" /><span>(11) 94541-3470</span></a>
        </div>
      </section>
    </main>
    <Footer />
  </div>
</template>
<script setup>
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
import { ArrowUpRight, Target, Compass, HeartHandshake, House, Handshake, Mail, Phone } from 'lucide-vue-next'
</script>
