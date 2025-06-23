<template>
  <section class="min-h-screen flex items-center justify-center bg-gray-100 px-4">
    <div class="bg-white p-6 rounded-md shadow-md w-full max-w-md">
      <h2 class="text-xl font-semibold mb-4">Login de Administrador</h2>

      <input v-model="email" type="email" placeholder="Email" class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-navy" />
      <input v-model="senha" type="password" placeholder="Senha" class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-navy" />

      <button @click="fazerLogin" class="w-full bg-navy text-white py-2 rounded hover:bg-navy/80 transition">Entrar</button>

      <p v-if="erro" class="text-red-500 mt-2">{{ erro }}</p>
    </div>
  </section>
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
