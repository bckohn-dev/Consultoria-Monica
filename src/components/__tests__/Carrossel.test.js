import { render,screen } from '@testing-library/vue'
import { describe,it,expect,vi,beforeEach } from 'vitest'
import { createRouter,createMemoryHistory } from 'vue-router'
const get=vi.hoisted(()=>vi.fn())
vi.mock('../../services/api',()=>({api:{get}}))
vi.mock('swiper/vue',()=>({Swiper:{template:'<div><slot /></div>'},SwiperSlide:{template:'<div><slot /></div>'}}))
import Carrossel from '../Carrossel.vue'
function setup(){
 const router=createRouter({history:createMemoryHistory(),routes:[{path:'/',component:{template:'<div />'}},{path:'/catalogo',component:{template:'<div />'}},{path:'/imovel/:id',component:{template:'<div />'}}]})
 return render(Carrossel,{global:{plugins:[router]}})
}
beforeEach(()=>vi.clearAllMocks())
describe('Carrossel',()=>{
 it('links a real highlighted property to its detail route',async()=>{
  get.mockResolvedValue({data:[{id:'apto-teste',nome:'Apartamento teste',foto:'https://firebasestorage.googleapis.com/a.jpg'}]})
  setup()
  expect((await screen.findByRole('link',{name:'Ver detalhes de Apartamento teste'})).getAttribute('href')).toBe('/imovel/apto-teste')
 })
 it('uses catalog as fallback instead of a fake property route',async()=>{
  get.mockResolvedValue({data:[]});setup()
  expect((await screen.findByRole('link',{name:'Ver detalhes de Destaque'})).getAttribute('href')).toBe('/catalogo')
 })
})
