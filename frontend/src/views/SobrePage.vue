<template>
  <div>
    <!-- Header -->
    <Header />

    <!-- Conteúdo principal -->
    <section class="container mx-auto my-16 px-4 bg-blue-600 text-white py-12 rounded-md">
      <h2 class="text-5xl font-bold text-blue-600 bg-white py-4 px-6 rounded-md text-center mb-12">
        Sobre a Nossa Consultoria Imobiliária
      </h2>
      
      <!-- Missão, Visão e Valores -->
      <div class="mb-12">
        <h3 class="text-4xl font-semibold text-blue-600 bg-white py-3 px-4 rounded-md mb-6">
          Missão
        </h3>
        <p class="text-lg leading-relaxed">
          Nossa missão é conectar pessoas aos imóveis dos seus sonhos, oferecendo um atendimento personalizado e soluções inovadoras no mercado imobiliário.
        </p>
      </div>
      <div class="mb-12">
        <h3 class="text-4xl font-semibold text-blue-600 bg-white py-3 px-4 rounded-md mb-6">
          Visão
        </h3>
        <p class="text-lg leading-relaxed">
          Ser referência em consultoria imobiliária, reconhecida pela excelência no atendimento e pela confiança de nossos clientes.
        </p>
      </div>
      <div class="mb-12">
        <h3 class="text-4xl font-semibold text-blue-600 bg-white py-3 px-4 rounded-md mb-6">
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
        <h3 class="text-4xl font-semibold text-blue-600 bg-white py-3 px-4 rounded-md mb-6">
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
        <h3 class="text-4xl font-semibold text-blue-600 bg-white py-3 px-4 rounded-md mb-6">
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