// src/components/__tests__/Catalogo.test.js
import { render, fireEvent, screen, waitFor } from '@testing-library/vue'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import Catalogo from '../Catalogo.vue'
import axios from 'axios'

// Stub minimal do ImovelCard
vi.mock('../ImovelCard.vue', () => ({
  default: {
    props: ['imovel'],
    template: `<div data-testid="card">{{ imovel.nome }}</div>`
  }
}))

vi.mock('axios')

function deferred() {
  let resolve, reject
  const promise = new Promise((res, rej) => {
    resolve = res
    reject = rej
  })
  return { promise, resolve, reject }
}

describe('Catalogo.vue', () => {
  const fakeImoveis = [
    { id: '1', nome: 'Apto A' },
    { id: '2', nome: 'Casa B' }
  ]

  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('exibe loading e depois lista de imóveis', async () => {
    const d = deferred()
    axios.get.mockReturnValueOnce(d.promise)

    render(Catalogo)

    // Loading deve aparecer
    expect(await screen.findByText('Carregando...')).toBeTruthy()

    // Agora resolve a promise do axios
    d.resolve({ data: fakeImoveis })

    // E espera que o loading suma e os cards apareçam
    await waitFor(() => {
      expect(screen.queryByText('Carregando...')).toBeNull()
      const cards = screen.getAllByTestId('card')
      // length via propriedade .length
      expect(cards.length).toBe(2)
      expect(cards[0].textContent).toBe('Apto A')
      expect(cards[1].textContent).toBe('Casa B')
    })
  })

  it('exibe mensagem de erro quando a API falha', async () => {
    axios.get.mockRejectedValueOnce(new Error('fail'))

    render(Catalogo)

    await waitFor(() => {
      expect(screen.getByText('Erro ao buscar imóveis. Tente novamente.')).toBeTruthy()
    })
  })

  it('exibe "Nenhum imóvel encontrado." quando a lista vem vazia', async () => {
    axios.get.mockResolvedValueOnce({ data: [] })

    render(Catalogo)

    await waitFor(() => {
      expect(screen.getByText('Nenhum imóvel encontrado.')).toBeTruthy()
    })
  })

  it('refaz a busca ao mudar filtro de quartos e limpa filtros no reset', async () => {
    // 1ª resposta: 1 imóvel
    axios.get.mockResolvedValueOnce({ data: [fakeImoveis[0]] })
    render(Catalogo)
    await waitFor(() => {
      const cards = screen.getAllByTestId('card')
      expect(cards.length).toBe(1)
      expect(cards[0].textContent).toBe('Apto A')
    })

    // 2ª resposta: nenhum imóvel
    axios.get.mockResolvedValueOnce({ data: [] })
    const selects = screen.getAllByRole('combobox')
    await fireEvent.update(selects[0], '2')
    await waitFor(() => {
      expect(screen.getByText('Nenhum imóvel encontrado.')).toBeTruthy()
    })

    // 3ª resposta: volta 2 imóveis
    axios.get.mockResolvedValueOnce({ data: fakeImoveis })
    const btnReset = screen.getByRole('button', { name: /limpar filtros/i })
    await fireEvent.click(btnReset)
    await waitFor(() => {
      const cards = screen.getAllByTestId('card')
      expect(cards.length).toBe(2)
    })

    // select voltou para vazio
    expect(selects[0].value).toBe('')
  })
})
