import { render } from '@testing-library/vue';
import { describe, it, expect } from 'vitest';
import Footer from '../Footer.vue';

describe('Footer.vue', () => {
  it('renderiza o texto de direitos autorais', () => {
    const { getByText } = render(Footer);
    expect(getByText(/Todos os direitos reservados/i)).toBeTruthy();
  });

  it('renderiza os links sociais com os nomes corretos', () => {
    const { getByText } = render(Footer);
    expect(getByText('TikTok')).toBeTruthy();
    expect(getByText('Instagram')).toBeTruthy();
    expect(getByText('Kwai')).toBeTruthy();
  });

  it('os links sociais apontam para as URLs corretas', () => {
    const { getByText } = render(Footer);

    expect(getByText('TikTok').closest('a')?.getAttribute('href')).toContain('tiktok.com');
    expect(getByText('Instagram').closest('a')?.getAttribute('href')).toContain('instagram.com');
    expect(getByText('Kwai').closest('a')?.getAttribute('href')).toContain('kwai-video.com');
  });

  it('renderiza o número do Creci', () => {
    const { getByText } = render(Footer);
    expect(getByText(/CreciSP 266907/i)).toBeTruthy();
  });

  it('renderiza os ícones (Lucide SVGs)', () => {
    const { container } = render(Footer);
    const svgIcons = container.querySelectorAll('svg');
    expect(svgIcons.length).toBeGreaterThanOrEqual(3);
  });
});
