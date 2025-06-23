<template>
  <div class="max-w-md mx-auto p-6 mt-20 bg-white shadow rounded-lg">
    <h2 class="text-xl font-semibold mb-4">Login de Administrador</h2>

    <input v-model="email" type="email" placeholder="Email" class="input mb-2" />
    <input v-model="senha" type="password" placeholder="Senha" class="input mb-4" />

    <button @click="fazerLogin" class="btn w-full bg-indigo-600 text-white">Entrar</button>

    <p v-if="erro" class="text-red-500 mt-2">{{ erro }}</p>
  </div>
</template>

<script>
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

export default {
  data() {
    return {
      email: "",
      senha: "",
      erro: "",
    };
  },
  methods: {
    async fazerLogin() {
      this.erro = "";
      const auth = getAuth();
      try {
        await signInWithEmailAndPassword(auth, this.email, this.senha);
        this.$router.push("/admin"); // redireciona para página protegida
      } catch (e) {
        this.erro = "Email ou senha inválidos.";
      }
    },
  },
};
</script>

<style scoped>
.input {
  @apply w-full px-3 py-2 border rounded-md;
}
.btn {
  @apply px-4 py-2 rounded-md font-semibold;
}
</style>
