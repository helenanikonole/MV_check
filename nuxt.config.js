export default {
  mode: 'spa',
  router: {
    base: '/MV_check/'
  },
  head: {
    title: 'Facial Recognition Test',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: "Facial Recognition Test is an open source project which helps you to verify if the way or solution you use to disrupt Facial Recognition algorithms works. Your reference photo is comparing with the stream from your camera.Facial Recognition algorithms uses AI to determine your identity through pictures or videos of your face. To date they are used massively, violating all privacy standards, not only online but also offline - through the ubiquitous surveillance cameras. Artists and activists have developed many projects of special makeup, hairstyles and jewelry to make a face unrecognizable for Facial Recognition algorithms, but we can never be sure if any particular solution works. Facial Recognition Test solves this problem."
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
  styleResources: {
    scss: ['assets/scss/base/main.scss']
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
  generate: {
    dir: 'docs'
  }
}
