var webpack = require('webpack');

module.exports = {
  configureWebpack: {
    plugins: [
    ]
  },
  pwa: {
    name: 'i smail',
    themeColor: '#FFC107',
    msTileColor: '#000000',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',
 
    // configure the workbox plugin
    workboxPluginMode: 'GenerateSW',
    workboxOptions: {
      importWorkboxFrom: 'local',
      include: [/\.html$/, /\.js$/, /\.css$/, /\.png$/, /\.jpeg$/, /\.jpg$/, /\.gif$/],
      exclude: [/\.json$/, /\.map$/],
    }
  }
}
