import { defineConfig } from 'dumi';
const isDeploy = process.env.SITE_DEPLOY === 'TRUE';

export default defineConfig({
  title: '@chenshuai2144/jsx-to-json',
  favicon:
    'https://user-images.githubusercontent.com/9554297/83762004-a0761b00-a6a9-11ea-83b4-9c8ff721d4b8.png',
  logo: 'https://user-images.githubusercontent.com/9554297/83762004-a0761b00-a6a9-11ea-83b4-9c8ff721d4b8.png',
  outputPath: 'docs-dist',
  mode: 'site',
  ssr: isDeploy ? {} : undefined,
  webpack5: {},
  publicPath: '/jsx-to-json/',
  base: '/jsx-to-json/',
  exportStatic: {},
  chainWebpack: (config) => {
    // ...other chains
    config.module // fixes https://github.com/graphql/graphql-js/issues/1272
      .rule('mjs$')
      .test(/\.mjs$/)
      .include.add(/node_modules/)
      .end()
      .type('javascript/auto');
  },
});
