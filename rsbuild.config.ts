import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

// Docs: https://rsbuild.rs/config/
export default defineConfig({
  plugins: [pluginReact()],
  html: {
    title: 'PolliNature - Restauro da Natureza em Coimbra',
    favicon: './public/favicon.png',
  },
  output: {
    assetPrefix: process.env.NODE_ENV === 'production' ? '/PolliNature/' : '/',
  },
});
