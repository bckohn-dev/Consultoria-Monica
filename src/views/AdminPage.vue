<template>
  <div class="site-page admin-page">
    <header class="admin-topbar"><div><p class="eyebrow">MÔNICA CONSULTORIA</p><strong>Painel de imóveis</strong></div><div class="admin-user"><span>{{ adminAuth.currentUser?.email }}</span><button class="button-outline" :disabled="saving || uploading" @click="logout">Sair <LogOut :size="17" aria-hidden="true" /></button></div></header>
    <main class="admin-shell">
      <div class="admin-page-heading"><div><h1>Seu catálogo, organizado.</h1><p class="admin-muted">Cadastre, edite e acompanhe seus imóveis em um só lugar.</p></div><router-link to="/catalogo" class="back-link" target="_blank">Ver catálogo <ArrowUpRight :size="17" aria-hidden="true" /></router-link></div>
      <p v-if="preview" class="admin-environment"><FlaskConical :size="19" aria-hidden="true" /><span><strong>Ambiente de teste.</strong> Alterações aqui não modificam os imóveis do site em produção.</span></p>
      <p v-if="message" class="admin-feedback" role="status">{{ message }}</p>
      <p v-if="error" class="admin-feedback error" role="alert">{{ error }}</p>
      <div class="admin-layout">
        <section class="admin-list-panel" aria-label="Imóveis cadastrados">
          <div class="admin-list-heading"><h2>Imóveis <span>{{ items.length }}</span></h2><button class="button-primary" :disabled="saving || uploading" @click="create">Novo imóvel <Plus :size="17" aria-hidden="true" /></button></div>
          <label class="admin-search">Buscar no catálogo<input v-model="search" placeholder="Nome do imóvel" type="search" /></label>
          <p v-if="loading" class="state-box" role="status">Carregando catálogo…</p>
          <div v-else-if="!items.length" class="state-box"><p>Nenhum imóvel cadastrado.</p><button v-if="preview" class="button-primary" :disabled="saving" @click="seed">Copiar imóveis atuais para o teste</button><button v-else class="clear-filters" @click="load">Tentar novamente</button></div>
          <p v-else-if="!filtered.length" class="state-box">Nenhum imóvel com esse nome.</p>
          <article v-for="item in filtered" :key="item.docId" class="admin-list-item" :class="{ active: editing === item.docId }">
            <img :src="item.foto || '/default-placeholder.jpg'" :alt="item.nome" loading="lazy" @error="imageFallback" />
            <div><h3>{{ item.nome }}</h3><p>{{ money(item.preco) }}</p><span v-if="item.destaque" class="admin-highlight">Em destaque</span></div>
            <button class="admin-icon-button" :disabled="saving || uploading" @click="edit(item)" :aria-label="'Editar ' + item.nome"><Pencil :size="18" /></button>
            <button class="admin-icon-button danger" :disabled="saving || uploading" @click="remove(item)" :aria-label="'Excluir ' + item.nome"><Trash2 :size="18" /></button>
          </article>
        </section>
        <section class="admin-editor" aria-labelledby="editor-title">
          <div class="admin-editor-heading"><div><p class="eyebrow">{{ editing ? 'ATUALIZAR INFORMAÇÕES' : 'UM NOVO ENDEREÇO' }}</p><h2 id="editor-title">{{ editing ? 'Editar imóvel' : 'Novo imóvel' }}</h2></div><span v-if="dirty" class="admin-unsaved">Não salvo</span></div>
          <form class="admin-form" @submit.prevent="save">
            <fieldset :disabled="saving || uploading">
              <label>Nome do imóvel<input v-model="form.nome" maxlength="120" required /></label>
              <div class="admin-form-grid">
                <label>Preço a partir de (R$)<input v-model.number="form.preco" type="number" min="0" step="0.01" required /></label>
                <label>Quartos<input v-model.number="form.quartos" type="number" min="0" max="50" step="1" required /></label>
                <label>Área mínima (m²)<input v-model.number="form.areaMin" type="number" min="0.01" step="0.01" required /></label>
                <label>Área máxima (m²)<input v-model.number="form.areaMax" type="number" :min="form.areaMin || 0.01" step="0.01" required /></label>
                <label>Marca do empreendimento<select v-model="form.marca"><option value="">Sem marca</option><option value="vibra">Vibra</option><option value="muda">Muda</option><option value="tipu">Tipu</option></select></label>
                <label>Entrega prevista<input v-model="form.prazoEntrega" maxlength="80" placeholder="Ex.: 31/12/2026 ou Pronto para morar" /></label>
              </div>
              <div class="admin-checkboxes"><label><input v-model="form.vagaGaragem" type="checkbox" /> Com garagem</label><label><input v-model="form.suite" type="checkbox" /> Com suíte</label><label><input v-model="form.destaque" type="checkbox" /> Mostrar nos destaques</label></div>
              <label v-if="form.destaque">Ordem nos destaques<input v-model.number="form.destaqueOrdem" type="number" min="0" step="1" required /><small>Números menores aparecem primeiro.</small></label>
              <label>Descrição<textarea v-model="form.descricao" rows="8" maxlength="12000" placeholder="Apresente o imóvel, localização, diferenciais e lazer. Use Enter para separar as linhas."></textarea><small>{{ form.descricao.length }} / 12.000 caracteres</small></label>
              <section class="admin-photos" aria-label="Fotos do imóvel">
                <div><h3>Fotos do imóvel</h3><p class="admin-muted">Sem fotos, usamos a imagem padrão do catálogo. A primeira foto enviada será a capa. Até 20 fotos, JPG, PNG ou WebP. Cada arquivo pode ter até 15 MB; as imagens serão otimizadas antes do envio.</p></div>
                <p v-if="!uploadsEnabled" class="admin-environment" role="status">O envio de novas fotos está indisponível neste ambiente de teste. Você pode manter as fotos existentes ou usar a capa padrão.</p><label v-else class="admin-upload"><ImagePlus :size="21" aria-hidden="true" /><span>Adicionar fotos</span><input type="file" accept="image/jpeg,image/png,image/webp" multiple @change="upload" /></label>
                <div class="admin-photo-grid"><div v-if="!photos.length" class="admin-photo"><img :src="'/default-placeholder.jpg'" alt="Capa padrão do catálogo" /><span class="admin-photo-cover">Capa padrão</span></div><div v-for="(url,index) in photos" :key="url" class="admin-photo"><img :src="url" :alt="'Foto ' + (index + 1)" @error="imageFallback" /><span v-if="index === 0" class="admin-photo-cover">Capa</span><div><button type="button" v-if="index > 0" @click="makeCover(index)" :aria-label="'Usar foto ' + (index + 1) + ' como capa'">Usar como capa</button><button type="button" @click="removePhoto(index)" :aria-label="'Remover foto ' + (index + 1)"><X :size="16" /></button></div></div></div>
              </section>
              <div class="admin-save-actions"><button class="button-primary" type="submit">{{ saving ? 'Salvando…' : 'Salvar imóvel' }} <Check :size="17" aria-hidden="true" /></button><button class="clear-filters" type="button" @click="create">Cancelar alterações</button></div>
            </fieldset>
            <p v-if="uploading" role="status" class="admin-muted">Otimizando e enviando fotos…</p>
            <p v-if="saving" role="status" class="admin-muted">Aguarde a confirmação antes de sair.</p>
          </form>
        </section>
      </div>
    </main>
  </div>
</template>
<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { onBeforeRouteLeave, useRouter } from 'vue-router'
import { signOut } from 'firebase/auth'
import { adminAuth, adminRequest, prepareImage } from '../services/adminApi'
import { Plus, Pencil, Trash2, LogOut, ArrowUpRight, ImagePlus, X, Check, FlaskConical } from 'lucide-vue-next'
const router=useRouter()
const items=ref([]), search=ref(''), loading=ref(true), saving=ref(false), uploading=ref(false), preview=ref(false)
const uploadsEnabled=ref(true)
const message=ref(''), error=ref(''), editing=ref(null), photos=ref([])
const empty=()=>({nome:'',preco:0,quartos:1,areaMin:0,areaMax:0,descricao:'',marca:'',prazoEntrega:'',vagaGaragem:false,suite:false,destaque:false,destaqueOrdem:0})
const form=ref(empty()), baseline=ref('')
const snapshot=()=>JSON.stringify({form:form.value,photos:photos.value})
baseline.value=snapshot()
const dirty=computed(()=>snapshot()!==baseline.value)
const filtered=computed(()=>items.value.filter(item=>String(item.nome||'').toLocaleLowerCase('pt-BR').includes(search.value.toLocaleLowerCase('pt-BR'))))
const money=value=>Number.isFinite(Number(value)) ? Number(value).toLocaleString('pt-BR',{style:'currency',currency:'BRL'}) : 'Sob consulta'
function imageFallback(e) { e.target.onerror=null; if(!e.target.src.endsWith('/default-placeholder.jpg'))e.target.src='/default-placeholder.jpg' }
function mayDiscard() { return !dirty.value || window.confirm('Você tem alterações não salvas. Deseja descartá-las?') }
async function load() {
  loading.value=true
  try {
    const data=await adminRequest()
    preview.value=data.preview; uploadsEnabled.value=data.uploadsEnabled !== false
    items.value=data.imoveis.sort((a,b)=>String(a.nome||'').localeCompare(String(b.nome||''),'pt-BR'))
    return true
  } catch(e) {error.value=e.message; return false}
  finally {loading.value=false}
}
function create() {
  if(saving.value || uploading.value || !mayDiscard())return
  editing.value=null; form.value=empty();photos.value=[];baseline.value=snapshot();error.value='';message.value=''
}
function edit(item) {
  if(!mayDiscard())return
  editing.value=item.docId
  form.value={...empty(),...Object.fromEntries(Object.keys(empty()).map(key=>[key,item[key]??empty()[key]]))}
  form.value.descricao=String(form.value.descricao).replace(/\\r\\n|\\n|\\r/g,'\n')
  form.value.vagaGaragem=Boolean(item.vagaGaragem??item.garagem)
  form.value.suite=Boolean(item.suite)
  form.value.areaMin=Number(item.areaMin??item.area??0)
  form.value.areaMax=Number(item.areaMax??item.area??form.value.areaMin)
  form.value.preco=Number(item.preco??0);form.value.quartos=Number(item.quartos??0)
  form.value.destaque=Boolean(item.destaque);form.value.destaqueOrdem=Number(item.destaqueOrdem??0)
  photos.value=[...new Set([item.foto,...(Array.isArray(item.fotos)?item.fotos:[])].filter(url=>url && url !== '/default-placeholder.jpg'))]
  baseline.value=snapshot();error.value='';message.value=''
}
function makeCover(index) { const [url]=photos.value.splice(index,1);photos.value.unshift(url) }
function removePhoto(index) { photos.value.splice(index,1) }
async function upload(event) {
  const files=Array.from(event.target.files||[]);event.target.value=''
  if(!files.length)return
  error.value=''
  if(photos.value.length+files.length>20){error.value='Use até 20 fotos por imóvel.';return}
  uploading.value=true
  try {
    for(const file of files){
      const image=await prepareImage(file)
      const result=await adminRequest('post',{params:{action:'upload'},data:image})
      photos.value.push(result.url)
    }
  }catch(e){error.value=e.message}
  finally{uploading.value=false}
}
async function save(){
  error.value='';message.value=''
  if(Number(form.value.areaMax)<Number(form.value.areaMin)){error.value='Confira a faixa de área.';return}
  saving.value=true
  try{
    const data={...form.value,foto:photos.value[0] || '/default-placeholder.jpg',fotos:[...photos.value]}
    if(editing.value) await adminRequest('patch',{params:{id:editing.value},data})
    else{
      const slug=form.value.nome.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,70)||'imovel'
      data.id=slug+'-'+crypto.randomUUID().slice(0,8)
      await adminRequest('post',{data})
      editing.value=data.id
    }
    baseline.value=snapshot()
    const reloaded=await load()
    message.value=reloaded ? 'Imóvel salvo. O catálogo já está atualizado.' : 'Imóvel salvo, mas não foi possível recarregar a lista. Atualize a página antes de continuar.'
  }catch(e){error.value=e.message}
  finally{saving.value=false}
}
async function remove(item){
  if((dirty.value && editing.value!==item.docId) || saving.value || uploading.value){error.value='Salve ou cancele as alterações antes de excluir outro imóvel.';return}
  if(!mayDiscard() || !window.confirm('Excluir “'+item.nome+'” do catálogo? Uma cópia será guardada para recuperação.'))return
  saving.value=true;error.value='';message.value=''
  try{
    await adminRequest('delete',{params:{id:item.docId}})
    if(editing.value===item.docId){editing.value=null;form.value=empty();photos.value=[];baseline.value=snapshot()}
    await load()
    message.value='Imóvel retirado do catálogo. As fotos e uma cópia de segurança foram preservadas.'
  }catch(e){error.value=e.message}
  finally{saving.value=false}
}
async function seed(){
  saving.value=true;error.value=''
  try{await adminRequest('post',{params:{action:'seed'}});await load();message.value='Catálogo de teste preparado. Você pode editar com segurança.'}
  catch(e){error.value=e.message}
  finally{saving.value=false}
}
async function logout(){if(!mayDiscard())return;baseline.value=snapshot();await signOut(adminAuth);await router.replace('/login')}
function beforeUnload(e){if(dirty.value || saving.value || uploading.value){e.preventDefault();e.returnValue=''}}
onMounted(()=>{load();window.addEventListener('beforeunload',beforeUnload)})
onBeforeUnmount(()=>window.removeEventListener('beforeunload',beforeUnload))
onBeforeRouteLeave(()=>saving.value||uploading.value ? false : mayDiscard())
</script>
