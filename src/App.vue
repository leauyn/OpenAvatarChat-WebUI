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
})

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
  background-size: 100% 100%;
  background-repeat: no-repeat;
  position: relative;
  *::-webkit-scrollbar {
    display: none;
  }
}
</style>
