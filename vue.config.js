module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  publicPath: typeof process.env.VUE_PUBLIC_PATH !== 'undefined'
    ? process.env.VUE_PUBLIC_PATH
    : '/'
}
