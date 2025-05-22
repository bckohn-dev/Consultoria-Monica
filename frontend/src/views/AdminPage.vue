<template>
  <div class="admin-form">
    <h2>Cadastro de Imóvel</h2>

    <input v-model="form.id" placeholder="ID" />
    <input v-model="form.nome" placeholder="Nome" />
    <input v-model="form.area" placeholder="Área (m²)" type="number" />
    <input v-model="form.quartos" placeholder="Quartos" type="number" />
    <input v-model="form.preco" placeholder="Preço" type="number" />
    <input type="file" @change="selecionarImagem" />

    <button @click="enviar">Salvar</button>

    <p v-if="mensagem">{{ mensagem }}</p>
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
        area: 0,
        quartos: 0,
        preco: 0,
        foto: "",
      },
      imagem: null,
      mensagem: "",
    };
  },
  methods: {
    selecionarImagem(event) {
      this.imagem = event.target.files[0];
    },
    async enviar() {
      if (!this.form.id || !this.imagem) {
        this.mensagem = "Preencha todos os campos e selecione uma imagem.";
        return;
      }

      try {
        const url = await uploadImagem(this.imagem, `${this.form.id}.jpg`);
        this.form.foto = url;
        await salvarImovel(this.form);
        this.mensagem = "Imóvel salvo com sucesso!";
        this.form = { id: "", nome: "", area: 0, quartos: 0, preco: 0, foto: "" };
        this.imagem = null;
      } catch (e) {
        console.error(e);
        this.mensagem = "Erro ao salvar imóvel.";
      }
    },
  },
};
</script>
