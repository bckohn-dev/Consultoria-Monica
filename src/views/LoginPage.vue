<template>
  <div class="site-page"><Header />
    <main class="admin-login-shell">
      <section class="admin-login-card" aria-labelledby="login-title">
        <p class="eyebrow">ACESSO RESTRITO</p><h1 id="login-title">Seu catálogo,<br />sob seu cuidado.</h1>
        <p class="admin-muted">Entre com a conta autorizada para gerenciar os imóveis.</p>
        <button class="button-outline google-login" :disabled="busy" @click="googleLogin">Entrar com Google <ArrowUpRight :size="18" aria-hidden="true" /></button>
        <div class="login-divider"><span>ou com e-mail e senha</span></div>
        <form @submit.prevent="emailLogin" class="admin-form">
          <label>E-mail<input v-model.trim="email" type="email" autocomplete="username" required /></label>
          <label>Senha<input v-model="password" type="password" autocomplete="current-password" required /></label>
          <button class="button-primary" :disabled="busy">{{ busy ? 'Verificando…' : 'Entrar no painel' }}</button>
        </form>
        <button class="clear-filters login-reset" :disabled="busy" @click="resetPassword">Esqueci minha senha</button>
        <button v-if="needsVerification" class="clear-filters login-reset" :disabled="busy" @click="verifyEmail">Reenviar confirmação de e-mail</button>
        <p v-if="message" class="admin-feedback" role="status">{{ message }}</p>
        <p v-if="error" class="admin-feedback error" role="alert">{{ error }}</p>
        <router-link to="/" class="back-link">← Voltar ao site</router-link>
      </section>
    </main><Footer />
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, sendPasswordResetEmail, sendEmailVerification, setPersistence, browserSessionPersistence, signOut } from 'firebase/auth'
import { adminAuth, adminRequest } from '../services/adminApi'
import { ArrowUpRight } from 'lucide-vue-next'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
const router = useRouter()
const email = ref(''), password = ref(''), busy = ref(false), error = ref(''), message = ref(''), needsVerification = ref(false)
function authMessage(e) {
  if (e.code === 'auth/unauthorized-domain') return 'Este endereço de teste precisa ser autorizado no Firebase Authentication.'
  if (e.code === 'auth/operation-not-allowed' || e.code === 'auth/configuration-not-found') return 'Este método de entrada ainda precisa ser habilitado no Firebase.'
  if (e.code === 'auth/popup-blocked') return 'Permita a janela de login do Google e tente novamente.'
  if (e.code === 'auth/too-many-requests') return 'Muitas tentativas. Aguarde um pouco antes de tentar novamente.'
  return e.code?.startsWith('auth/') ? 'Não foi possível entrar. Confira a conta e tente novamente.' : (typeof e.message === 'string' ? e.message : 'Não foi possível entrar. Tente novamente.')
}
async function login(action) {
  busy.value=true; error.value=''; message.value=''; needsVerification.value=false
  let stage='provider'
  try {
    await setPersistence(adminAuth,browserSessionPersistence)
    await action()
    if (!adminAuth.currentUser.emailVerified) {
      needsVerification.value=true
      throw new Error('Confirme seu e-mail antes de entrar. Use o botão abaixo para receber o link.')
    }
    stage='authorization'
    await adminRequest('get',{params:{action:'session'}})
    await router.replace('/admin')
  } catch (e) {
    console.warn('Admin login failure', {stage,code:typeof e.code==='string'?e.code:'unknown'})
    if (e.code !== 'auth/popup-closed-by-user' && e.code !== 'auth/cancelled-popup-request') error.value=authMessage(e)
    // An unverified account stays signed in only to request email verification.
    if (!needsVerification.value) await signOut(adminAuth)
  } finally { busy.value=false; password.value='' }
}
const emailLogin = () => login(() => signInWithEmailAndPassword(adminAuth,email.value,password.value))
function googleLogin() {
  const provider = new GoogleAuthProvider()
  provider.setCustomParameters({prompt:'select_account'})
  return login(() => signInWithPopup(adminAuth,provider))
}
async function resetPassword() {
  error.value=''; message.value=''
  if (!email.value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) { error.value='Preencha seu e-mail para recuperar a senha.'; return }
  busy.value=true
  try { await sendPasswordResetEmail(adminAuth,email.value); message.value='Se houver uma conta cadastrada, você receberá as instruções por e-mail.' }
  catch (e) { error.value=authMessage(e) }
  finally { busy.value=false }
}
async function verifyEmail() {
  busy.value=true
  try { await sendEmailVerification(adminAuth.currentUser); message.value='Confira seu e-mail e entre novamente após confirmar.' }
  catch (e) { error.value=authMessage(e) }
  finally { busy.value=false }
}
</script>
