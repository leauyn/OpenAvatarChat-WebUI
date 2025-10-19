<script setup lang="ts">
import WebcamPermission from '@/components/WebcamPermission.vue'
import { antdLocale, locale } from '@/langs'
import VideoChat from '@/views/VideoChat/index.vue'
import { ConfigProvider } from 'ant-design-vue'
import { useVideoChatStore } from './store'
import { onMounted } from 'vue'

const videoChatState = useVideoChatStore()
videoChatState.init()

// 检测是否在 iframe 中运行
onMounted(() => {
  const isInIframe = window.self !== window.top
  if (isInIframe) {
    document.body.classList.add('iframe-mode')
    console.log('🔍 检测到在 iframe 中运行，应用 iframe 模式样式')
  }

  // 初始化 VConsole（仅在移动端或开发环境）
  initVConsole()
})

// 初始化 VConsole 函数
function initVConsole() {
  // 检测是否为移动设备
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )

  // 在移动端或开发环境初始化 VConsole
  if (isMobile || import.meta.env.DEV) {
    // 动态加载 VConsole
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/vconsole/dist/vconsole.min.js'
    script.onload = () => {
      // @ts-ignore
      if (window.VConsole) {
        // @ts-ignore
        const vConsole = new window.VConsole()
        console.log('🔧 VConsole 已初始化，支持移动端调试')
      }
    }
    script.onerror = () => {
      console.warn('⚠️ VConsole 加载失败，将使用原生 console')
    }
    document.head.appendChild(script)
  }
}

// import dayjs from 'dayjs';
// import 'dayjs/locale/zh-cn';
// dayjs.locale('zh-cn');
</script>
<template>
  <ConfigProvider :locale="antdLocale[locale]">
    <div class="wrap">
      <WebcamPermission v-if="!videoChatState.webcamAccessed" />
      <VideoChat />
    </div>
  </ConfigProvider>
</template>
<style lang="less" scoped>
.wrap {
  background-image: url(@/assets/background.png);
  height: 100vh;
  width: 100vw;
  background-size: cover; // 改为cover确保背景正确填充
  background-position: center center; // 居中显示背景
  background-repeat: no-repeat;
  position: relative;
  *::-webkit-scrollbar {
    display: none;
  }

  // PC端优化：确保背景在PC端也能正确显示
  @media (min-width: 1025px) {
    background-size: cover;
    background-position: center center;
  }
}
</style>
