import { render, fireEvent } from '@testing-library/vue';
import { describe, it, expect } from 'vitest';
import Header from '../Header.vue';
import { createRouter, createMemoryHistory } from 'vue-router';

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/', component: { template: '<div>Home</div>' } },
    { path: '/catalogo', component: { template: '<div>Catálogo</div>' } },
    { path: '/sobre', component: { template: '<div>Sobre</div>' } },
  ],
});

describe('Header.vue', () => {
  it('renderiza logo e texto principal', async () => {
    const { getByText, getByAltText } = render(Header, {
      global: { plugins: [router] },
    });

    expect(getByText(/MÔNICA/i)).toBeTruthy();
    expect(getByText(/Consultoria/i)).toBeTruthy();
    expect(getByAltText('Logo MC')).toBeTruthy();
  });

  it('renderiza os links do menu', async () => {
    const { getAllByText } = render(Header, {
      global: { plugins: [router] },
    });

    expect(getAllByText('Home')[0]).toBeTruthy();
    expect(getAllByText('Catálogo')[0]).toBeTruthy();
    expect(getAllByText('Sobre')[0]).toBeTruthy();
    expect(getAllByText('Contato')[0]).toBeTruthy();
  });

  it('abre e fecha o modal de contato ao clicar no botão', async () => {
    const { getAllByText, getByRole, queryByText } = render(Header, {
      global: { plugins: [router] },
    });

    const contatoBtn = getAllByText('Contato')[0];
    await fireEvent.click(contatoBtn);

    expect(getAllByText(/Email:/i)[0]).toBeTruthy();
    expect(getAllByText(/WhatsApp:/i)[0]).toBeTruthy();

    const fecharBtn = getByRole('button', { name: /fechar/i });
    await fireEvent.click(fecharBtn);

    expect(queryByText(/Email:/i)).toBeNull();
  });

  it('abre o menu mobile ao clicar no botão hamburguer', async () => {
    const { getByRole, getAllByText } = render(Header, {
      global: { plugins: [router] },
    });

    const toggleButton = getByRole('button', { name: /menu de navegação/i });
    await fireEvent.click(toggleButton);

    expect(getAllByText('Home')[0]).toBeTruthy();
    expect(getAllByText('Catálogo')[0]).toBeTruthy();
  });
});
