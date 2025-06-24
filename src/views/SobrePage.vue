<template>
  <div class="max-w-screen-md mx-auto px-4 py-8">
    <!-- Header -->
    <Header />

    <!-- Conteúdo principal -->
    <hr>
    <section class="container mx-auto my-16 px-4 bg-white text-black py-12 rounded-md">
      <h1 class="text-3xl font-bold text-center mb-6">Sobre Nós</h1>
      
      <!-- Missão, Visão e Valores -->
      <div class="mb-12">
        <h3 class="text-4xl font-semibold bg-mainblue text-gold py-3 px-4 rounded-md mb-6">
          Missão
        </h3>
        <p class="text-gray-700 leading-relaxed text-justify mb-4">
          Nossa missão é conectar pessoas aos imóveis dos seus sonhos, oferecendo um atendimento personalizado e soluções inovadoras no mercado imobiliário.
        </p>
      </div>
      <div class="mb-12">
        <h3 class="text-4xl font-semibold bg-mainblue text-gold py-3 px-4 rounded-md mb-6">
          Visão
        </h3>
        <p class="text-gray-700 leading-relaxed text-justify mb-4">
          Ser referência em consultoria imobiliária, reconhecida pela excelência no atendimento e pela confiança de nossos clientes.
        </p>
      </div>
      <div class="mb-12">
        <h3 class="text-4xl font-semibold bg-mainblue text-gold py-3 px-4 rounded-md mb-6">
          Valores
        </h3>
        <ul class="list-disc list-inside text-lg leading-relaxed">
          <li>Ética e transparência</li>
          <li>Compromisso com o cliente</li>
          <li>Inovação e qualidade</li>
          <li>Respeito e responsabilidade social</li>
        </ul>
      </div>

      <!-- Serviços -->
      <div class="mb-12">
        <h3 class="text-4xl font-semibold bg-mainblue text-gold py-3 px-4 rounded-md mb-6">
          Nossos Serviços
        </h3>
        <ul class="list-disc list-inside text-lg leading-relaxed">
          <li>Consultoria para compra e venda de imóveis</li>
          <li>Avaliação de imóveis</li>
          <li>Intermediação de negociações</li>
          <li>Orientação jurídica e financeira</li>
        </ul>
      </div>

      <!-- Contato -->
      <div class="mb-12">
        <h3 class="text-4xl font-semibold bg-mainblue text-gold py-3 px-4 rounded-md mb-6">
          Entre em Contato
        </h3>
        <p class="text-lg leading-relaxed">
          Estamos à disposição para ajudar você a encontrar o imóvel ideal. Entre em contato conosco pelos canais abaixo:
        </p>
        <ul class="mt-6 text-lg leading-relaxed">
          <li><strong>Email:</strong> contato@consultoriaimobiliaria.com</li>
          <li><strong>Telefone:</strong> (11) 1234-5678</li>
          <li><strong>Endereço:</strong> Rua dos Imóveis, 123, Centro, São Paulo - SP</li>
        </ul>
      </div>
    </section>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script>
import Header from '../components/Header.vue';
import Footer from '../components/Footer.vue';

export default {
  name: 'SobrePage',
  components: {
    Header,
    Footer,
  },
};
</script>