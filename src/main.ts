import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.less'
import App from './App.vue'
import i18n from './langs'
import vClickOutside from 'click-outside-vue3'

// 强制清除缓存的函数
const clearCache = () => {
  // 清除localStorage中的缓存
  const keysToRemove = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && (key.includes('vite') || key.includes('cache') || key.includes('version'))) {
      keysToRemove.push(key)
    }
  }
  keysToRemove.forEach((key) => localStorage.removeItem(key))

  // 清除sessionStorage
  sessionStorage.clear()

  // 添加版本号到localStorage，用于检测更新
  localStorage.setItem('app_version', Date.now().toString())

  console.log('🔄 缓存已清除，版本号:', localStorage.getItem('app_version'))
}

// 检查是否需要清除缓存
const currentVersion = localStorage.getItem('app_version')
const lastVersion = localStorage.getItem('last_app_version')
if (!currentVersion || (lastVersion && currentVersion !== lastVersion)) {
  clearCache()
  localStorage.setItem('last_app_version', currentVersion || Date.now().toString())
}

const app = createApp(App)
const Pinia = createPinia()
app.use(Pinia)
app.use(i18n)
app.use(vClickOutside)
app.mount('#app')
