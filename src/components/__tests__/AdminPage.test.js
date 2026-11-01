import { render,screen,fireEvent,waitFor } from '@testing-library/vue'
import { describe,it,expect,vi,beforeEach } from 'vitest'
import { createRouter,createMemoryHistory } from 'vue-router'
const request=vi.hoisted(()=>vi.fn())
vi.mock('../../services/adminApi',()=>({adminAuth:{currentUser:{email:'owner@example.com'}},adminRequest:request,prepareImage:vi.fn()}))
vi.mock('firebase/auth',()=>({signOut:vi.fn()}))
import Admin from '../../views/AdminPage.vue'
const property={docId:'original-doc',id:'public-id',nome:'Apartamento atual',preco:100,areaMin:30,areaMax:40,quartos:2,foto:'https://example.com/cover.jpg',fotos:['https://example.com/second.jpg'],marca:'vibra',descricao:'Descrição',destaque:false}
async function setup(){
  const router=createRouter({history:createMemoryHistory(),routes:[{path:'/admin',component:Admin},{path:'/catalogo',component:{template:'<div />'}},{path:'/login',component:{template:'<div />'}}]})
  await router.push('/admin')
  return render(Admin,{global:{plugins:[router]}})
}
beforeEach(()=>{
  vi.clearAllMocks()
  request.mockImplementation(async method=>method==='patch'?{ok:true}:{preview:true,imoveis:[property]})
})
describe('Painel administrativo',()=>{
  it('edits by original document ID and preserves gallery without reupload',async()=>{
    await setup()
    await screen.findByRole('button',{name:'Editar Apartamento atual'})
    await fireEvent.click(screen.getByRole('button',{name:'Editar Apartamento atual'}))
    await fireEvent.update(screen.getByLabelText('Nome do imóvel'),'Apartamento atualizado')
    await fireEvent.click(screen.getByRole('button',{name:'Salvar imóvel'}))
    await waitFor(()=>expect(request).toHaveBeenCalledWith('patch',expect.objectContaining({
      params:{id:'original-doc'},
      data:expect.objectContaining({nome:'Apartamento atualizado',foto:property.foto,fotos:[property.foto,...property.fotos]})
    })))
    expect(await screen.findByText('Imóvel salvo. O catálogo já está atualizado.')).toBeTruthy()
  })
  it('requires a cover before creating a property',async()=>{
    await setup()
    await screen.findByRole('button',{name:'Editar Apartamento atual'})
    await fireEvent.update(screen.getByLabelText('Nome do imóvel'),'Novo imóvel')
    await fireEvent.update(screen.getByLabelText('Área mínima (m²)'),'30')
    await fireEvent.update(screen.getByLabelText('Área máxima (m²)'),'40')
    await fireEvent.click(screen.getByRole('button',{name:'Salvar imóvel'}))
    expect(await screen.findByRole('alert')).toHaveProperty('textContent','Adicione pelo menos uma foto para a capa.')
    expect(request.mock.calls.filter(call=>call[0]==='post')).toHaveLength(0)
  })
})
