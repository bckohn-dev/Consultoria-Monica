import { render } from '@testing-library/vue';
import { describe, it, expect } from 'vitest';
import { vi } from 'vitest';
import { nextTick } from 'vue';
import Footer from '../Footer.vue';

describe('Footer.vue', () => {
  it('deve renderizar corretamente', async () => {
    const { getByText } = render(Footer);
    await nextTick();
    expect(getByText).toBeTruthy();
  });
});
