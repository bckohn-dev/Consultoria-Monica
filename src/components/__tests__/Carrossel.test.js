import { render } from '@testing-library/vue';
import { describe, it, expect } from 'vitest';
import { vi } from 'vitest';
import { nextTick } from 'vue';
import Carrossel from '../Carrossel.vue';

describe('Carrossel.vue', () => {
  it('deve renderizar corretamente', async () => {
    const { getByText } = render(Carrossel);
    await nextTick();
    expect(getByText).toBeTruthy();
  });
});
