import { render, screen, fireEvent, waitFor } from '@testing-library/vue'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createRouter, createMemoryHistory } from 'vue-router'
import axios from 'axios'
import Details from '../../views/ImovelDetalhes.vue'
vi.mock('axios')
vi.mock('../Header.vue', () => ({ default: { template: '<header />' } }))
vi.mock('../Footer.vue', () => ({ default: { template: '<footer />' } }))
const property = { id: 'teste', nome: 'Jardim São Paulo', preco: 400000, quartos: 2, areaMin: 40, areaMax: 50, fotos: ['/segunda.jpg'], foto: '/capa.jpg', marca: 'vibra', vagaGaragem: true }
beforeEach(() => vi.resetAllMocks())
async function setup() {
  const router = createRouter({ history: createMemoryHistory(), routes: [{ path: '/imovel/:id', component: Details }, { path: '/catalogo', component: { template: '<div />' } }] })
  await router.push('/imovel/teste')
  return render(Details, { global: { plugins: [router] } })
}
describe('Detalhes do imóvel', () => {
  it('exibe imóvel, navega entre fotos e prepara contato específico', async () => {
    axios.get.mockResolvedValue({ data: property })
    await setup()
    expect(await screen.findByRole('heading', { name: property.nome })).toBeTruthy()
    expect(screen.getByText('40 a 50 m²')).toBeTruthy()
    expect(screen.getByText('Com vaga')).toBeTruthy()
    await fireEvent.click(screen.getByRole('button', { name: 'Próxima foto' }))
    expect(screen.getByAltText('Jardim São Paulo — foto 2').getAttribute('src')).toBe('/segunda.jpg')
    await fireEvent.click(screen.getByRole('button', { name: 'Próxima foto' }))
    expect(screen.getByAltText('Jardim São Paulo — foto 1').getAttribute('src')).toBe('/capa.jpg')
    expect(decodeURIComponent(screen.getByRole('link', { name: /Tenho interesse/ }).getAttribute('href'))).toContain(property.nome)
  })
  it('permite tentar novamente após uma falha', async () => {
    axios.get.mockRejectedValueOnce(new Error('offline')).mockResolvedValueOnce({ data: property })
    await setup()
    await screen.findByRole('alert')
    await fireEvent.click(screen.getByRole('button', { name: 'Tentar novamente' }))
    await screen.findByRole('heading', { name: property.nome })
    expect(axios.get).toHaveBeenCalledTimes(2)
  })
})
