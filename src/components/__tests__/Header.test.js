import { render, fireEvent, screen } from '@testing-library/vue'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import Header from '../Header.vue'
import { createRouter, createMemoryHistory } from 'vue-router'

beforeEach(() => {
  HTMLDialogElement.prototype.showModal = function () { this.setAttribute('open', '') }
  HTMLDialogElement.prototype.close = function () { this.removeAttribute('open'); this.dispatchEvent(new Event('close')) }
  document.body.style.overflow = ''
})
function setup() {
  const router = createRouter({ history: createMemoryHistory(), routes: ['/', '/catalogo', '/sobre'].map(path => ({ path, component: { template: '<div />' } })) })
  return render(Header, { global: { plugins: [router] } })
}
describe('Header', () => {
  it('exibe marca e navegação', () => {
    setup()
    expect(screen.getByAltText('Logo MC')).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Catálogo' }).getAttribute('href')).toBe('/catalogo')
  })
  it('anuncia o estado do menu móvel', async () => {
    setup()
    const toggle = screen.getByRole('button', { name: /menu de navegação/i })
    expect(toggle.getAttribute('aria-expanded')).toBe('false')
    await fireEvent.click(toggle)
    expect(toggle.getAttribute('aria-expanded')).toBe('true')
    await fireEvent.click(screen.getByRole('link', { name: 'Catálogo' }))
    expect(toggle.getAttribute('aria-expanded')).toBe('false')
  })
  it('abre contato com canais diretos e devolve o foco ao fechar', async () => {
    setup()
    const trigger = screen.getByRole('button', { name: /contato/i })
    await fireEvent.click(trigger)
    expect(screen.getByRole('dialog').open).toBe(true)
    expect(document.body.style.overflow).toBe('hidden')
    expect(screen.getByRole('link', { name: /WhatsApp/i }).getAttribute('href')).toBe('https://wa.me/5511945413470')
    expect(screen.getByRole('link', { name: /Email/i }).getAttribute('href')).toContain('mailto:')
    await fireEvent.click(screen.getByRole('button', { name: 'Fechar contato' }))
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(document.body.style.overflow).toBe('')
    expect(document.activeElement).toBe(trigger)
  })
  it('restaura a rolagem ao desmontar com o contato aberto', async () => {
    const { unmount } = setup()
    document.body.style.overflow = 'auto'
    await fireEvent.click(screen.getByRole('button', { name: /contato/i }))
    unmount()
    expect(document.body.style.overflow).toBe('auto')
  })
})

it('fecha menu com Escape e devolve foco ao botão', async () => {
  setup()
  const toggle = screen.getByRole('button', { name: 'Abrir menu de navegação' })
  await fireEvent.click(toggle)
  expect(toggle.getAttribute('aria-label')).toBe('Fechar menu de navegação')
  const link = screen.getByRole('link', { name: 'Catálogo' })
  link.focus()
  await fireEvent.keyDown(link, { key: 'Escape' })
  expect(toggle.getAttribute('aria-expanded')).toBe('false')
  expect(document.activeElement).toBe(toggle)
})
