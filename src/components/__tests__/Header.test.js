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
      global: {
        plugins: [router],
      },
    });

    // Verifica se a marca está visível
    expect(getByText(/MÔNICA/i)).toBeTruthy();
    expect(getByText(/Consultoria/i)).toBeTruthy();

    // Verifica se o logo foi renderizado
    expect(getByAltText('Logo MC')).toBeTruthy();
  });

  it('renderiza os links do menu', async () => {
    const { getByText } = render(Header, {
      global: { plugins: [router] },
    });

    expect(getByText('Home')).toBeTruthy();
    expect(getByText('Catálogo')).toBeTruthy();
    expect(getByText('Sobre')).toBeTruthy();
    expect(getByText('Contato')).toBeTruthy();
  });

  it('abre e fecha o modal de contato ao clicar no botão', async () => {
    const { getByText, queryByText } = render(Header, {
      global: { plugins: [router] },
    });

    const contatoBtn = getByText('Contato');
    await fireEvent.click(contatoBtn);

    // Espera que o modal apareça
    expect(getByText(/Email:/i)).toBeTruthy();
    expect(getByText(/Telefone:/i)).toBeTruthy();

    // Fecha o modal
    await fireEvent.click(getByText('Fechar'));

    // Após fechar, os elementos devem desaparecer
    expect(queryByText(/Email:/i)).toBeNull();
  });
});
