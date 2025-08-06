<template>
  <header class="bg-mainblue text-white shadow-md z-50">
    <div class="container mx-auto relative flex justify-between items-center px-4 py-3">
      <!-- container do logo -->
      <div class="flex flex-col items-center gap-y-0.5 sm:flex-row sm:items-center sm:gap-x-2 text-center sm:text-left">
        <img :src="Logo" class="main__logo" alt="Logo MC" />
        <div class="sm:text-center sm:ml-2 leading-tight">
          <div class="text-white font-semibold">Mônica</div>
          <div class="text-white font-semibold">Consultoria</div>
        </div>
      </div>

      <!-- Mobile menu button -->
      <button class="sm:hidden" @click="alternarMenu" aria-label="Abrir menu de navegação">
        <svg class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2"
          viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M4 6h16M4 12h16m-7 6h7" />
        </svg>
      </button>

      <!-- Navigation - Mobile -->
      <nav
        :class="[
          'sm:hidden bg-[#1c2140] w-full absolute top-full right-0 transition-all duration-300 z-40 shadow-xl border-t border-puregold rounded-b-lg',
          menuAberto ? 'block' : 'hidden'
        ]"
      >
        <ul class="flex flex-col divide-y divide-white/10">
          <li v-for="item in menu" :key="item.nome" class="px-6 py-3">
            <router-link
              :to="item.rota"
              class="block text-white font-semibold hover:text-puregold transition"
              @click="menuAberto = false"
            >
              {{ item.nome }}
            </router-link>
          </li>
          <li class="px-6 py-3">
            <button
              @click="abrirContato"
              class="text-white font-semibold hover:text-puregold transition"
            >
              Contato
            </button>
          </li>
        </ul>
      </nav>
      <!-- Navigation - Desktop -->
      <nav class="hidden sm:flex space-x-6">
        <ul class="flex flex-row items-center">
          <li v-for="item in menu" :key="item.nome">
            <router-link
              :to="item.rota"
              class="block py-2 px-4 rounded-md text-white hover:bg-puregold hover:text-mainblue transition-colors duration-200"
            >
              {{ item.nome }}
            </router-link>
          </li>
          <li>
            <button
              @click="abrirContato"
              class="py-2 px-4 rounded-md text-white hover:bg-puregold hover:text-mainblue transition-colors duration-200"
            >
              Contato
            </button>
          </li>
        </ul>
      </nav>
    </div>
    <!-- Modal de Contato -->
    <div
      v-if="mostrarContato"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="fecharContato"
    >
      <div
        class="bg-white rounded-xl shadow-2xl p-6 sm:p-8 w-11/12 sm:w-[400px] animate-fade-in"
      >
        <!-- Título -->
        <div class="mb-6">
          <h2 class="text-2xl font-bold text-mainblue mb-1 flex items-center gap-2">
            <Phone class="w-6 h-6 text-mainblue" /> Contato
          </h2>
        </div>

        <!-- Lista de contato -->
        <ul class="space-y-4 text-gray-800 text-base">
          <li class="flex items-start gap-3">
            <Mail class="w-5 h-5 text-gray-600" />
            <div>
              <strong>Email:</strong>
              <button 
                @click="copiarEmail('monicanogueiravendas@gmail.com')" 
                class="ml-1 text-mainblue underline hover:text-gold transition"
              >
                monicanogueiravendas@gmail.com
              </button>
            </div>
          </li>
          <li class="flex items-center gap-2 mt-2">
            <a
              href="https://wa.me/5511945413470"
              target="_blank"
              class="flex items-center gap-2 text-green-600 hover:text-green-700 transition"
            >
              <!-- Ícone WhatsApp -->
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 32 32" fill="currentColor">
                <path d="M16.01 2.003c-7.73 0-13.99 6.26-13.99 13.99 0 2.472.654 4.886 1.89 7.012l-1.998 7.184 7.37-1.93c1.986 1.08 4.223 1.646 6.728 1.646 7.73 0 13.99-6.26 13.99-13.99 0-7.73-6.26-13.99-13.99-13.99zm.003 25.15c-2.105 0-4.098-.565-5.84-1.632l-.42-.25-4.374 1.146 1.177-4.235-.273-.438c-1.145-1.836-1.75-3.96-1.75-6.126 0-6.434 5.236-11.67 11.67-11.67s11.67 5.236 11.67 11.67c0 6.435-5.236 11.67-11.67 11.67zm6.057-8.412c-.332-.167-1.963-.968-2.27-1.078-.306-.112-.53-.167-.755.168s-.867 1.078-1.063 1.296c-.195.22-.39.247-.722.083-.33-.166-1.392-.513-2.65-1.635-.98-.872-1.642-1.946-1.835-2.276-.192-.33-.021-.51.145-.678.15-.15.33-.39.495-.585.167-.195.222-.33.332-.55.11-.22.055-.415-.028-.583-.084-.167-.755-1.82-1.035-2.49-.273-.655-.552-.566-.755-.577-.195-.01-.417-.01-.64-.01-.222 0-.583.084-.89.417s-1.17 1.143-1.17 2.79 1.198 3.233 1.365 3.453c.166.22 2.34 3.57 5.667 5.006.792.34 1.41.542 1.892.693.795.253 1.52.218 2.09.132.637-.095 1.963-.8 2.24-1.573.277-.772.277-1.428.195-1.573-.083-.145-.305-.222-.637-.39z"/>
              </svg>

              <strong>WhatsApp:</strong>
              <span>(11) 94541-3470</span>
            </a>
          </li>
        </ul>

        <!-- Botão -->
        <button
          @click="fecharContato"
          class="mt-6 flex items-center gap-2 bg-mainblue text-white px-4 py-2 rounded hover:bg-gold hover:text-mainblue transition"
        >
          ❌ Fechar
        </button>
      </div>
    </div>
  </header>
</template>

<script>
import Logo from '@/assets/Logo.png';
import { Phone, Mail } from 'lucide-vue-next';

export default {
  name: 'Header',
  components: {
    Phone,
    Mail
  },
  data() {
    return {
      Logo,
      menuAberto: false,
      mostrarContato: false,
      menu: [
        { nome: 'Home', rota: '/' },
        { nome: 'Catálogo', rota: '/catalogo' },
        { nome: 'Sobre', rota: '/sobre' },
      ]
    };
  },
  methods: {
    alternarMenu() {
      this.menuAberto = !this.menuAberto;
    },
    abrirContato() {
      this.mostrarContato = true;
    },
    fecharContato() {
      this.mostrarContato = false;
    },
    copiarEmail(email) {
      navigator.clipboard.writeText(email)
        .then(() => {
          alert('E-mail copiado!');
        })
        .catch(err => {
          console.error('Erro ao copiar e-mail:', err);
        });
    }
  },
  watch: {
    menuAberto(novoValor) {
      this.$emit('toggle-menu', novoValor);
    }
  }
};

</script>

<style>
/* MOBILE padrão */
.main__logo {
  max-height: 80px;
  width: auto;
  margin-bottom: -0.9rem;
  margin-top: -0.5rem;
}

/* DESKTOP (telas ≥ 640px) */
@media (min-width: 640px) {
  .main__logo {
    max-height: 120px;
    margin-right: -1.5rem;
    margin-top: -1rem;
    margin-bottom: -1.5rem;
  }
}

/* Animação de fade-in */
@keyframes fade-in {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}

</style>
