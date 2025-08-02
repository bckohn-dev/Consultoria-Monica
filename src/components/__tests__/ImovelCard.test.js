import { render, fireEvent } from '@testing-library/vue';
import { describe, it, expect, vi } from 'vitest';
import ImovelCard from '../ImovelCard.vue';
import { createRouter, createMemoryHistory } from 'vue-router';

// Mock router
const router = createRouter({
  history: createMemoryHistory(),
  routes: [{ path: '/imovel/:id', component: { template: '<div>Detalhes</div>' } }],
});

const mockImovel = {
  id: 'apto-001',
  nome: 'Apartamento Central',
  preco: 450000,
  quartos: 2,
  area: 75,
  foto: 'https://example.com/img.jpg',
};

describe('ImovelCard.vue', () => {
  it('renderiza informações do imóvel corretamente', () => {
    const { getByText, getByAltText } = render(ImovelCard, {
      props: { imovel: mockImovel },
      global: { plugins: [router] },
    });

    expect(getByText('Apartamento Central')).toBeTruthy();
    expect(getByText(/Preço:.*450.000,00/)).toBeTruthy();
    expect(getByText(/Quartos: 2/)).toBeTruthy();
    expect(getByText(/75m²/)).toBeTruthy();
    expect(getByAltText('Apartamento Central')).toBeTruthy();
  });

  it('mostra imagem de fallback se houver erro na imagem', async () => {
    const { getByAltText } = render(ImovelCard, {
      props: { imovel: { ...mockImovel, foto: 'imagem-invalida.jpg' } },
      global: { plugins: [router] },
    });

    const img = getByAltText('Apartamento Central');
    // Simula erro
    await fireEvent.error(img);

    expect(img.src).toContain('/default-placeholder.jpg');
  });

  it('botão chama verDetalhes e navega para a rota correta', async () => {
    router.push = vi.fn();

    const { getByRole } = render(ImovelCard, {
      props: { imovel: mockImovel },
      global: { plugins: [router] },
    });

    const btn = getByRole('button', { name: /ver detalhes/i });
    await fireEvent.click(btn);

    expect(router.push).toHaveBeenCalledWith('/imovel/apto-001');
  });

  it('mostra "Carregando..." e desativa botão quando loading é true', () => {
    const { getByRole } = render(ImovelCard, {
      props: {
        imovel: mockImovel,
        loading: true,
      },
      global: {
        plugins: [router],
      },
    });

    const btn = getByRole('button');
    expect(btn).toBeTruthy();
    expect(btn.disabled).toBe(true);
    expect(btn.textContent).toMatch(/carregando/i);
  });
});
