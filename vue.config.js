module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  pwa: {
    workboxPluginMode: 'GenerateSW',
    workboxOptions: {
      skipWaiting: true,
      exclude: [
        'manifest.json',
        /^assets\/(avatars|skills|items)\//
      ],
      runtimeCaching: [
        {
          urlPattern: /^assets\/(avatars|skills|items)\//,
          handler: 'CacheFirst',
          options: {
            cacheableResponse: { statuses: [200] }
          }
        }
      ]
    },
    name: '明日方舟养成规划',
    themeColor: '#2196f3',
    msTileColor: '#2196f3',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',
    iconPaths: {
      favicon32: 'assets/icons/32x32.png',
      favicon16: 'assets/icons/16x16.png',
      appleTouchIcon: 'assets/icons/152x152.png',
      maskIcon: 'assets/icons/16x16.svg',
      msTileImage: 'assets/icons/144x144.png'
    },
    manifestOptions: {
      name: '明日方舟养成规划',
      short_name: '方舟养成',
      lang: 'zh',
      start_url: '/',
      background_color: '#2196f3',
      orientation: 'any',
      description: '明日方舟养成规划，干员养成一站式规划计算',
      categories: ['tools'],
      /*
      shortcuts: [
        {
          name: '主页',
          short_name: '主页',
          url: '/#/',
          icons: [
            {
              src: 'assets/icons/shortcut-home-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any',
            }
          ]
        }
      ],
      */
      icons: [
        {
          src: 'assets/icons/192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: 'assets/icons/512x512.png',
          sizes: '512x512',
          type: 'image/png',
        }
      ]
    }
  }
}
