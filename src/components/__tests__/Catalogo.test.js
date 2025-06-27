import { render } from '@testing-library/vue';
import { describe, it, expect } from 'vitest';
import { vi } from 'vitest';
import { nextTick } from 'vue';
import Catalogo from '../Catalogo.vue';

describe('Catalogo.vue', () => {
  it('deve renderizar corretamente', async () => {
    const { getByText } = render(Catalogo);
    await nextTick();
    expect(getByText).toBeTruthy();
  });
});
