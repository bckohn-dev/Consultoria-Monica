<template>
  <div class="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
    <h2 class="text-2xl font-semibold text-center mb-6">Cadastro de Imóvel</h2>

    <form @submit.prevent="enviar" class="space-y-4">
      <!-- ID -->
      <div>
        <label for="id" class="block text-sm font-medium text-gray-700">ID *</label>
        <input
          id="id"
          v-model="form.id"
          type="text"
          placeholder="ID do imóvel"
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        />
      </div>

      <!-- Nome -->
      <div>
        <label for="nome" class="block text-sm font-medium text-gray-700">Nome *</label>
        <input
          id="nome"
          v-model="form.nome"
          type="text"
          placeholder="Nome do imóvel"
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        />
      </div>

      <!-- Área -->
      <div>
        <label for="area" class="block text-sm font-medium text-gray-700">Área (m²) *</label>
        <input
          id="area"
          v-model.number="form.area"
          type="number"
          min="1"
          placeholder="Área em metros quadrados"
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        />
      </div>

      <!-- Quartos -->
      <div>
        <label for="quartos" class="block text-sm font-medium text-gray-700">Quartos *</label>
        <input
          id="quartos"
          v-model.number="form.quartos"
          type="number"
          min="0"
          placeholder="Número de quartos"
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        />
      </div>

      <!-- Preço -->
      <div>
        <label for="preco" class="block text-sm font-medium text-gray-700">Preço (R$) *</label>
        <input
          id="preco"
          v-model.number="form.preco"
          type="number"
          min="0"
          step="0.01"
          placeholder="Preço do imóvel"
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        />
      </div>

      <!-- Imagem -->
      <div>
        <label for="imagem" class="block text-sm font-medium text-gray-700">Imagem *</label>
        <input
          id="imagem"
          type="file"
          accept="image/*"
          @change="selecionarImagem"
          class="mt-1 block w-full text-sm text-gray-500 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          required
        />
        <div v-if="preview" class="mt-2">
          <img :src="preview" alt="Preview da imagem" class="w-full h-auto rounded-md" />
        </div>
      </div>

      <!-- Mensagem -->
      <div v-if="mensagem" :class="{'text-red-500': erro, 'text-green-500': !erro}" class="text-center">
        <p>{{ mensagem }}</p>
      </div>

      <!-- Botão -->
      <div class="flex justify-center">
        <button
          type="submit"
          :disabled="loading"
          class="inline-flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
        >
          <span v-if="loading" class="mr-2">Salvando...</span>
          <span v-else>Salvar</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { uploadImagem } from "../services/uploadImagem";
import { salvarImovel } from "../services/imovelService";

export default {
  name: "AdminPage",
  data() {
    return {
      form: {
        id: "",
        nome: "",
        area: null,
        quartos: null,
        preco: null,
        foto: "",
      },
      imagem: null,
      preview: null,
      mensagem: "",
      erro: false,
      loading: false,
    };
  },
  methods: {
    selecionarImagem(event) {
      const file = event.target.files[0];
      if (!file) {
        this.imagem = null;
        this.preview = null;
        return;
      }
      this.imagem = file;

      // Gerar preview
      const reader = new FileReader();
      reader.onload = e => {
        this.preview = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    async enviar() {
      this.mensagem = "";
      this.erro = false;

      // Validação simples extra
      if (
        !this.form.id.trim() ||
        !this.form.nome.trim() ||
        !this.form.area ||
        !this.form.quartos &&
        this.form.quartos !== 0 || 
        !this.form.preco ||
        !this.imagem
      ) {
        this.mensagem = "Por favor, preencha todos os campos obrigatórios e selecione uma imagem.";
        this.erro = true;
        return;
      }

      this.loading = true;
      try {
        const url = await uploadImagem(this.imagem, `${this.form.id}.jpg`);
        this.form.foto = url;
        await salvarImovel(this.form);
        this.mensagem = "Imóvel salvo com sucesso!";
        this.erro = false;

        // Resetar formulário
        this.form = { id: "", nome: "", area: null, quartos: null, preco: null, foto: "" };
        this.imagem = null;
        this.preview = null;
      } catch (e) {
        console.error(e);
        this.mensagem = "Erro ao salvar imóvel. Tente novamente.";
        this.erro = true;
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
/* Estilos adicionais, se necessário */
</style>
