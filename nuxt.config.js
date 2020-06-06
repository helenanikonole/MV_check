export default {
  mode: 'spa',
  head: {
    title: 'DEFAULT TITLE',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: 'Проект'
      },
      {
        name: 'msapplication-TileColor',
        content: '#2b2b2b'
      },
      {
        name: 'theme-color',
        content: '#2b2b2b'
      },
    ],
  },
  loading: { color: '#fff' },
  plugins: [
    '~plugins/global-components',
    { 
      src: '@/plugins/client-only',
      mode: 'client'
    },
  ],
  buildModules: [
    '@nuxtjs/eslint-module'
  ],
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    '@nuxtjs/style-resources'
  ],
  transition: {
    mode: 'out-in'
  },
  build: {
    extend(config, ctx) {}
  },
  server: {
    port: 8080,
    host: '0.0.0.0'
  },
  srcDir: 'src',
  buildDir: 'build',
  styleResources: {
    scss: ['assets/scss/base/main.scss']
  },
}
