/* eslint-disable no-console */

import { register } from 'register-service-worker'

if (process.env.NODE_ENV === 'production') {
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready () {
      console.log('[ServiceWorker] 就绪')
    },
    registered () {
      console.log('[ServiceWorker] 注册完成')
      window.mdui.snackbar({
        message: '正在缓存数据供离线使用'
      })
    },
    cached () {
      console.log('[ServiceWorker] 缓存完成')
      window.mdui.snackbar({
        message: '数据缓存完成，已经可以离线使用'
      })
    },
    updatefound () {
      console.log('[ServiceWorker] 下载新内容')
      delete window.localStorage.init
      window.mdui.snackbar({
        message: '检查到新内容，正在下载更新'
      })
    },
    updated () {
      console.log('[ServiceWorker] 新内容下载完成')
      delete window.localStorage.init
      window.mdui.snackbar({
        message: '新内容已更新完毕，请刷新页面启用',
        buttonText: '刷新',
        closeOnOutsideClick: false,
        timeout: 0,
        onButtonClick: function() {
          window.location.reload()
        },
      })
    },
    offline () {
      console.log('[ServiceWorker] 已离线')
      window.mdui.snackbar({
        message: '已进入离线模式'
      })
    },
    error (error) {
      console.error('[ServiceWorker] 发生错误：', error)
      window.mdui.snackbar({
        message: '发生错误，请将console中的错误信息报告给开发者'
      })
    }
  })
}