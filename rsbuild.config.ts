import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

// Docs: https://rsbuild.rs/config/
export default defineConfig({
  plugins: [pluginReact()],
  html: {
    title: 'PolliNature - Restauro da Natureza em Coimbra',
    favicon: './public/favicon.png',
    tags:
      process.env.NODE_ENV === 'production'
        ? [
            {
              tag: 'script',
              attrs: {
                'data-goatcounter': 'https://pollinature.goatcounter.com/count',
                async: true,
                src: '//gc.zgo.at/count.js',
              },
            },
          ]
        : undefined,
  },
  output: {
    assetPrefix: process.env.NODE_ENV === 'production' ? '/PolliNature/' : '/',
  },
});
