import { render,screen,fireEvent,waitFor } from '@testing-library/vue'
import { describe,it,expect,vi,beforeEach,afterEach } from 'vitest'
import { createRouter,createMemoryHistory } from 'vue-router'
const request=vi.hoisted(()=>vi.fn())
vi.mock('../../services/adminApi',()=>({adminAuth:{currentUser:{email:'owner@example.com'}},adminRequest:request,prepareImage:vi.fn()}))
vi.mock('firebase/auth',()=>({signOut:vi.fn()}))
import Admin from '../../views/AdminPage.vue'
import { OWNER_ENTRY_PATH, OWNER_PANEL_PATH } from '../../config/adminRoutes.js'
const property={docId:'original-doc',id:'public-id',nome:'Apartamento atual',preco:100,areaMin:30,areaMax:40,quartos:2,foto:'https://example.com/cover.jpg',fotos:['https://example.com/second.jpg'],marca:'vibra',descricao:'Descrição',destaque:false}
async function setup(){
  const router=createRouter({history:createMemoryHistory(),routes:[{path:OWNER_PANEL_PATH,component:Admin},{path:'/catalogo',component:{template:'<div />'}},{path:OWNER_ENTRY_PATH,component:{template:'<div />'}}]})
  await router.push(OWNER_PANEL_PATH)
  return render(Admin,{global:{plugins:[router]}})
}
beforeEach(()=>{
  vi.clearAllMocks()
  request.mockImplementation(async method=>method==='patch'?{ok:true}:{preview:true,imoveis:[property]})
})
afterEach(()=>vi.restoreAllMocks())

describe('Painel administrativo',()=>{
  it('hides upload when the test environment has no Storage enabled',async()=>{
    request.mockResolvedValue({preview:true,uploadsEnabled:false,imoveis:[property]})
    await setup()
    expect(await screen.findByText(/O envio de novas fotos está indisponível/)).toBeTruthy()
    expect(screen.queryByLabelText('Adicionar fotos')).toBeNull()
    expect(screen.getByAltText('Capa padrão do catálogo')).toBeTruthy()
  })
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
  it('creates with the preset cover when no photos are uploaded',async()=>{
    await setup()
    await screen.findByRole('button',{name:'Editar Apartamento atual'})
    await fireEvent.update(screen.getByLabelText('Nome do imóvel'),'Novo imóvel')
    await fireEvent.update(screen.getByLabelText('Área mínima (m²)'),'30')
    await fireEvent.update(screen.getByLabelText('Área máxima (m²)'),'40')
    await fireEvent.click(screen.getByRole('button',{name:'Salvar imóvel'}))
    await waitFor(()=>expect(request).toHaveBeenCalledWith('post',expect.objectContaining({data:expect.objectContaining({foto:'/default-placeholder.jpg',fotos:[]})})))
    expect(await screen.findByText('Imóvel salvo. O catálogo já está atualizado.')).toBeTruthy()
  })
})


describe('Admin editing safeguards',()=>{
  it('keeps unsaved changes when discard is refused',async()=>{
    vi.spyOn(window,'confirm').mockReturnValue(false)
    await setup()
    await fireEvent.click(await screen.findByRole('button',{name:'Editar Apartamento atual'}))
    await fireEvent.update(screen.getByLabelText('Nome do imóvel'),'Alteração não salva')
    await fireEvent.click(screen.getByRole('button',{name:'Novo imóvel'}))
    expect(screen.getByLabelText('Nome do imóvel').value).toBe('Alteração não salva')
    expect(window.confirm).toHaveBeenCalledOnce()
    expect(request.mock.calls.some(([method])=>method==='post'||method==='patch')).toBe(false)
  })
  it('does not delete when the owner cancels confirmation',async()=>{
    vi.spyOn(window,'confirm').mockReturnValue(false)
    await setup()
    await fireEvent.click(await screen.findByRole('button',{name:'Excluir Apartamento atual'}))
    expect(request.mock.calls.some(([method])=>method==='delete')).toBe(false)
  })
  it('deletes by document ID only after confirmation',async()=>{
    vi.spyOn(window,'confirm').mockReturnValue(true)
    await setup()
    await fireEvent.click(await screen.findByRole('button',{name:'Excluir Apartamento atual'}))
    await waitFor(()=>expect(request).toHaveBeenCalledWith('delete',{params:{id:'original-doc'}}))
    expect(await screen.findByText(/Imóvel retirado do catálogo/)).toBeTruthy()
  })
  it('keeps edits and exposes a save failure instead of success',async()=>{
    await setup()
    await fireEvent.click(await screen.findByRole('button',{name:'Editar Apartamento atual'}))
    await fireEvent.update(screen.getByLabelText('Nome do imóvel'),'Preservar edição')
    request.mockRejectedValueOnce(new Error('Falha de teste ao salvar'))
    await fireEvent.click(screen.getByRole('button',{name:'Salvar imóvel'}))
    expect((await screen.findByRole('alert')).textContent).toContain('Falha de teste ao salvar')
    expect(screen.getByLabelText('Nome do imóvel').value).toBe('Preservar edição')
    expect(screen.queryByText('Imóvel salvo. O catálogo já está atualizado.')).toBeNull()
  })
  it('changes cover order without uploading or losing existing photos',async()=>{
    await setup()
    await fireEvent.click(await screen.findByRole('button',{name:'Editar Apartamento atual'}))
    await fireEvent.click(screen.getByRole('button',{name:'Usar foto 2 como capa'}))
    await fireEvent.click(screen.getByRole('button',{name:'Salvar imóvel'}))
    await waitFor(()=>expect(request).toHaveBeenCalledWith('patch',expect.objectContaining({data:expect.objectContaining({foto:property.fotos[0],fotos:[property.fotos[0],property.foto]})})))
  })
})
