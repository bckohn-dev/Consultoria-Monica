<template>
  <div>
    <Header />
    <!-- Content Div -->
    <div class="max-w-screen-md mx-auto px-4 py-8">
      <!-- Conteúdo principal -->
      <section class="container mx-auto my-16 px-4 bg-white text-mainblue py-12 rounded-md">
        <h1 class="text-3xl font-bold text-center mb-6">Sobre</h1>
        
        <!-- Missão, Visão e Valores com layout em cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div class="bg-white shadow-lg rounded-xl p-6 border-t-4 border-gold text-center">
            <h3 class="text-2xl font-semibold text-mainblue mb-2">🏆 Missão</h3>
            <p class="text-gray-700 text-sm leading-relaxed">
              Conectar pessoas aos imóveis dos seus sonhos, com atendimento personalizado e soluções inovadoras.
            </p>
          </div>

          <div class="bg-white shadow-lg rounded-xl p-6 border-t-4 border-gold text-center">
            <h3 class="text-2xl font-semibold text-mainblue mb-2">🌟 Visão</h3>
            <p class="text-gray-700 text-sm leading-relaxed">
              Ser referência em consultoria imobiliária, reconhecida pela excelência e confiança dos clientes.
            </p>
          </div>

          <div class="bg-white shadow-lg rounded-xl p-6 border-t-4 border-gold text-center">
            <h3 class="text-2xl font-semibold text-mainblue mb-2">💡 Valores</h3>
            <ul class="text-gray-700 text-sm space-y-1 text-left list-disc list-inside">
              <li>Ética e transparência</li>
              <li>Compromisso com o cliente</li>
              <li>Inovação e qualidade</li>
              <li>Respeito e responsabilidade social</li>
            </ul>
          </div>
        </div>
        <hr><br>
        <!-- Nossos Serviços -->
        <div class="mb-12">
          <h3 class="text-3xl font-bold text-mainblue text-center mb-8">Serviços</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div class="bg-white border border-gold rounded-xl p-6 shadow-md flex flex-col items-center text-center">
              <img :src="compraIcon" alt="Compra e venda" class="w-12 h-12 mr-2" />
              <h4 class="text-lg font-semibold text-mainblue mb-2">Compra e Venda</h4>
              <p class="text-sm text-gray-700">Consultoria completa na compra e venda de imóveis residenciais e comerciais.</p>
            </div>
            <div class="bg-white border border-gold rounded-xl p-6 shadow-md flex flex-col items-center text-center">
              <img :src="negociacaoIcon" alt="Avaliação de imóveis" class="w-12 h-12 mr-2" />
              <h4 class="text-lg font-semibold text-mainblue mb-2">Intermediação</h4>
              <p class="text-sm text-gray-700">Apoio em negociações seguras e transparentes entre as partes envolvidas.</p>
            </div>
          </div>
        </div>

        <!-- Contato -->
        <hr><br>
        <div class="mb-12">
          <h3 class="text-3xl font-bold text-mainblue text-center mb-8">Contato</h3>
          <div class="bg-white border border-gold shadow-md rounded-xl p-6 text-center">

            <p class="text-gray-700 leading-relaxed mb-4">
              Estamos à disposição para ajudar você a encontrar o imóvel ideal.<br>
              Fale conosco pelos canais abaixo:
            </p>
            <ul class="text-lg leading-loose text-mainblue">
              <li>📧 <strong>Email:</strong> <a href="mailto:contato@consultoriaimobiliaria.com" class="underline hover:text-gold">contato@consultoriaimobiliaria.com</a></li>
              <li>📞 <strong>Telefone:</strong> <a href="tel:+551112345678" class="underline hover:text-gold">(11) 1234-5678</a></li>
            </ul>
          </div>
        </div>


      </section>
    </div>
    
    <Footer />
  </div>
</template>

<script>
import Header from '../components/Header.vue';
import Footer from '../components/Footer.vue';
import compraIcon from '@/assets/icones/compra.png';
import negociacaoIcon from '@/assets/icones/negociacao.png';

export default {
  name: 'SobrePage',
  components: {
    Header,
    Footer,
  },
  data() {
    return {
      compraIcon,
      negociacaoIcon,
    };
  },
};
</script>