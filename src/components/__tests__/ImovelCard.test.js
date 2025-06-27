import { render } from '@testing-library/vue';
import { describe, it, expect } from 'vitest';
import ImovelCard from '../ImovelCard.vue';

describe('ImovelCard.vue', () => {
  it('deve renderizar nome do imóvel', () => {
    const mockImovel = {
      id: 'apto-centro-01',
      nome: 'Apartamento Teste',
      preco: 300000,
      quartos: 2,
      area: 70,
      foto: '',
    };

    const { getByText } = render(ImovelCard, {
      props: { imovel: mockImovel }
    });

    expect(getByText('Apartamento Teste')).toBeTruthy();
    expect(getByText('Preço: R$ 300.000,00')).toBeTruthy();
    expect(getByText('Quartos: 2')).toBeTruthy();
    expect(getByText('70m²')).toBeTruthy();
  });
});
