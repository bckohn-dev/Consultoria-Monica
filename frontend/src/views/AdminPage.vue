<template>
  <div class="container mx-auto my-16">
    <h1 class="text-3xl font-bold mb-8">Gerenciar Imóveis</h1>

    <!-- Formulário para adicionar/editar imóveis -->
    <form @submit.prevent="salvarImovel" class="mb-8">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input v-model="form.nome" type="text" placeholder="Nome do Imóvel" class="border p-3 rounded" required />
        <input v-model="form.foto" type="text" placeholder="URL da Foto" class="border p-3 rounded" required />
        <input v-model.number="form.preco" type="number" placeholder="Preço (R$)" class="border p-3 rounded" required />
        <input v-model.number="form.quartos" type="number" placeholder="Quartos" class="border p-3 rounded" required />
        <input v-model.number="form.area" type="number" placeholder="Área (m²)" class="border p-3 rounded" required />
      </div>
      <button type="submit" class="mt-4 bg-blue-600 text-white px-4 py-2 rounded">
        {{ form.id ? 'Salvar Alterações' : 'Adicionar Imóvel' }}
      </button>
    </form>

    <!-- Lista de imóveis -->
    <div v-if="imoveis.length === 0" class="text-center text-gray-600">Nenhum imóvel cadastrado.</div>
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="imovel in imoveis" :key="imovel.id" class="border p-4 rounded shadow">
        <img :src="imovel.foto" :alt="imovel.nome" class="w-full h-48 object-cover rounded mb-4" />
        <h3 class="text-xl font-bold">{{ imovel.nome }}</h3>
        <p>Preço: R${{ imovel.preco.toLocaleString('pt-BR') }}</p>
        <p>Quartos: {{ imovel.quartos }}</p>
        <p>Área: {{ imovel.area }}m²</p>
        <div class="mt-4 flex space-x-2">
          <button @click="editarImovel(imovel)" class="bg-yellow-500 text-white px-4 py-2 rounded">Editar</button>
          <button @click="removerImovel(imovel.id)" class="bg-red-600 text-white px-4 py-2 rounded">Remover</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      imoveis: [],
      form: {
        id: null,
        nome: '',
        foto: '',
        preco: null,
        quartos: null,
        area: null,
      },
    };
  },
  methods: {
    async carregarImoveis() {
      try {
        const response = await axios.get('http://localhost:3000/api/imoveis');
        this.imoveis = response.data;
      } catch (error) {
        console.error('Erro ao carregar imóveis:', error);
      }
    },
    async salvarImovel() {
      try {
        console.log('ID do imóvel:', this.form.id);
        if (this.form.id) {
          // Editar imóvel
          await axios.put(`http://localhost:3000/api/imoveis/${this.form.id}`, this.form);
        } else {
          // Adicionar imóvel
          const response = await axios.post('http://localhost:3000/api/imoveis', this.form);
          this.imoveis.push(response.data);
        }
        this.resetarFormulario();
        this.carregarImoveis();
      } catch (error) {
        console.error('Erro ao salvar imóvel:', error);
      }
    },
    editarImovel(imovel) {
      console.log('Editando imóvel:', imovel); // Log para depuração
      this.form = { ...imovel }; // Preenche o formulário com os dados do imóvel, incluindo o ID
    },
    async removerImovel(id) {
      try {
        await axios.delete(`http://localhost:3000/api/imoveis/${id}`);
        this.carregarImoveis();
      } catch (error) {
        console.error('Erro ao remover imóvel:', error);
      }
    },
    resetarFormulario() {
      this.form = { id: null, nome: '', foto: '', preco: null, quartos: null, area: null };
    },
  },
  created() {
    this.carregarImoveis();
  },
};
</script>