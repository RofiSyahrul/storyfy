import svg from '@poppanator/sveltekit-svg';
import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';

const config: UserConfig = {
  plugins: [sveltekit(), svg({ includePaths: ['./src/lib/icons/'] })],
  test: {
    include: ['src/**/*.{test,spec}.{js,ts}'],
  },
};

export default config;
