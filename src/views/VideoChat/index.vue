<template>
  <div class="page-container" ref="wrapRef">
    <div class="content-container">
      <div
        class="video-container"
        :style="{
          aspectRatio: remoteAspectRatio,
        }"
      >
        <!-- 顶部操作栏 -->
        <div v-if="webcamAccessed" class="top-actions">
          <ActionGroup />
        </div>

        <div
          :class="`local-video-container ${streamState === 'open' ? 'scaled' : ''}`"
          v-show="hasCamera && !cameraOff && streamState === 'open'"
          ref="localVideoContainerRef"
        >
          <video
            class="local-video"
            ref="localVideoRef"
            autoplay
            muted
            playsinline
            :style="{
              visibility: cameraOff ? 'hidden' : 'visible',
              display: !hasCamera || cameraOff ? 'none' : 'block',
            }"
          />
        </div>

        <!-- 连接过程中的loading状态 -->
        <div v-if="streamState === 'waiting'" class="connection-loading-container">
          <div class="loading-content">
            <div class="loading-spinner">
              <Spin size="large" />
            </div>
            <div class="loading-text">正在连接...</div>
          </div>
        </div>
        <div class="remote-video-container" ref="remoteVideoContainerRef">
          <video
            v-if="!avatarType"
            class="remote-video"
            v-show="streamState === 'open'"
            @playing="onplayingRemoteVideo"
            ref="remoteVideoRef"
            autoplay
            playsinline
            :muted="volumeMuted"
          />
        </div>

        <div v-if="shouldShowChatRecords" class="chat-records-container">
          <ChatRecords ref="chatRecordsInstanceRef" :chatRecords="chatRecords" />
        </div>
      </div>

      <template v-if="(!hasMic || micMuted) && streamState === 'open'" class="chat-input-wrapper">
        <ChatInput
          :replying="replying"
          @interrupt="onInterrupt"
          @send="onSend"
          @stop="videoChatState.startWebRTC"
        />
      </template>
      <template v-else-if="webcamAccessed">
        <ChatBtn
          @start-chat="onStartChat"
          :audio-source-callback="audioSourceCallback"
          :streamState="streamState as string"
          wave-color="#7873F6"
        />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import ActionGroup from '@/components/ActionGroup.vue'
import ChatBtn from '@/components/ChatBtn.vue'
import ChatInput from '@/components/ChatInput.vue'
import ChatRecords from '@/components/ChatRecords.vue'
import { useVideoChatStore } from '@/store'
import { useVisionStore } from '@/store/vision'
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref, useTemplateRef } from 'vue'
import { Spin } from 'ant-design-vue'
const visionState = useVisionStore()
const videoChatState = useVideoChatStore()
const wrapRef = ref<HTMLDivElement>()

const localVideoContainerRef = ref<HTMLDivElement>()
const remoteVideoContainerRef = ref<HTMLDivElement>()
const localVideoRef = ref<HTMLVideoElement>()
const remoteVideoRef = ref<HTMLVideoElement>()
const remoteAspectRatio = ref('9 / 16')
const onplayingRemoteVideo = () => {
  if (remoteVideoRef.value) {
    remoteAspectRatio.value = `${remoteVideoRef.value.videoWidth} / ${remoteVideoRef.value.videoHeight}`
  }
}

const audioSourceCallback = () => {
  return videoChatState.localStream
}

onMounted(() => {
  const wrapperRef = wrapRef.value
  visionState.wrapperRef = wrapperRef
  wrapperRef!.getBoundingClientRect()
  wrapperRect.value.width = wrapperRef!.clientWidth
  wrapperRect.value.height = wrapperRef!.clientHeight
  visionState.isLandscape = wrapperRect.value.width > wrapperRect.value.height
  console.log(wrapperRect)

  visionState.remoteVideoContainerRef = remoteVideoContainerRef.value
  visionState.localVideoContainerRef = localVideoContainerRef.value
  visionState.localVideoRef = localVideoRef.value
  visionState.remoteVideoRef = remoteVideoRef.value
  visionState.wrapperRef = wrapRef.value
})
const {
  hasCamera,
  hasMic,
  micMuted,
  cameraOff,
  webcamAccessed,
  streamState,
  avatarType,
  volumeMuted,
  replying,
  showChatRecords,
  chatRecords,
} = storeToRefs(videoChatState)
const { wrapperRect, isLandscape } = storeToRefs(visionState)

// 计算是否应该显示聊天记录
const shouldShowChatRecords = computed(() => {
  // 如果有聊天记录，则显示
  if (chatRecords.value && chatRecords.value.length > 0) {
    return true
  }
  // 如果会话正在进行中，也显示（即使没有聊天记录）
  if (streamState.value === 'open') {
    return true
  }
  // 其他情况不显示（初始启动页面）
  return false
})

function onStartChat() {
  videoChatState.startWebRTC().then(() => {
    initChatDataChannel()
  })
}

function initChatDataChannel() {
  if (!videoChatState.chatDataChannel) return
  videoChatState.chatDataChannel.addEventListener('message', (event) => {
    const data = JSON.parse(event.data)
    if (data.type === 'chat') {
      const index = videoChatState.chatRecords.findIndex((item) => {
        return item.id === data.id
      })
      if (index !== -1) {
        const item = videoChatState.chatRecords[index]
        item.message += data.message
        videoChatState.chatRecords.splice(index, 1, item)
        videoChatState.chatRecords = [...videoChatState.chatRecords]
      } else {
        videoChatState.chatRecords = [
          ...videoChatState.chatRecords,
          {
            id: data.id,
            role: data.role || 'human', // TODO: 默认值测试后续删除
            message: data.message,
          },
        ]
      }
    } else if (data.type === 'avatar_end') {
      videoChatState.replying = false
    }
  })
}

function onInterrupt() {
  if (videoChatState.chatDataChannel) {
    videoChatState.chatDataChannel.send(JSON.stringify({ type: 'stop_chat' }))
  }
}

const chatRecordsInstanceRef = useTemplateRef<any>('chatRecordsInstanceRef')
function onSend(message: string) {
  if (!message) return
  if (!videoChatState.chatDataChannel) return
  videoChatState.chatDataChannel.send(JSON.stringify({ type: 'chat', data: message }))
  videoChatState.replying = true
  chatRecordsInstanceRef.value?.scrollToBottom()
}
</script>
<style lang="less" scoped>
@import './index.less';
</style>
