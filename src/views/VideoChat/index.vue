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
          <div class="left-action">
            <LeftOutlined class="left-icon" />
          </div>
          <div v-if="!showDigitalHumanIntro && streamState !== 'waiting'" class="right-actions">
            <ActionGroup :isStartupMode="streamState !== 'open'" />
            <div
              v-click-outside="() => (settingsMenuVisible = false)"
              class="setting-action"
              @click="toggleSettingsMenu"
            >
              <SettingOutlined class="setting-icon" />
              <!-- 设置菜单 -->
              <div v-show="settingsMenuVisible" class="settings-menu">
                <div class="settings-menu-item" @click="toggleVideoStream">
                  <VideoCameraOutlined class="menu-icon" />
                  <span class="menu-text">视频流</span>
                  <div
                    class="toggle-switch"
                    :class="{ active: videoStreamEnabled }"
                    @click.stop="toggleVideoStream"
                  >
                    <div class="toggle-slider"></div>
                  </div>
                </div>
                <div class="settings-menu-item" @click="toggleKnowledgeBase">
                  <SoundOutlined class="menu-icon" />
                  <span class="menu-text">知识库</span>
                  <div
                    class="toggle-switch"
                    :class="{ active: knowledgeBaseEnabled }"
                    @click.stop="toggleKnowledgeBase"
                  >
                    <div class="toggle-slider"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
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

        <!-- 数字人服务介绍和角色选择区域 -->
        <div v-if="showDigitalHumanIntro" class="digital-human-sections">
          <!-- 顶部导航栏 -->
          <div class="digital-human-header">
            <div class="header-left">
              <div class="back-button">
                <LeftOutlined class="back-icon" />
              </div>
              <span class="header-title">数字人服务介绍</span>
            </div>
          </div>

          <!-- 主要内容区域 -->
          <div class="digital-human-content">
            <DigitalHumanIntro />
            <DigitalHumanRoleSelection />
          </div>
        </div>
      </div>

      <!-- 底部组件固定容器，确保高度稳定 -->
      <div class="bottom-components-container">
        <template v-if="streamState === 'open'">
          <!-- 当会话开启时，根据micMuted状态决定显示哪个组件 -->
          <template v-if="micMuted">
            <ChatInput
              :replying="replying"
              :micEnabled="hasMic && !micMuted"
              @interrupt="onInterrupt"
              @send="onSend"
              @stop="videoChatState.startWebRTC"
              @switchToVoice="onSwitchToVoice"
            />
          </template>
          <template v-else>
            <ChatBtn
              @start-chat="onStartChat"
              :audio-source-callback="audioSourceCallback"
              :streamState="streamState as string"
              wave-color="#7873F6"
              @switchToText="onSwitchToText"
            />
          </template>
        </template>
        <template v-else-if="webcamAccessed || showDigitalHumanIntro">
          <!-- 当会话未开启时，显示开始聊天按钮 -->
          <ChatBtn
            @start-chat="onStartChat"
            :audio-source-callback="audioSourceCallback"
            :streamState="streamState as string"
            wave-color="#7873F6"
            @switchToText="onSwitchToText"
          />
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ActionGroup from '@/components/ActionGroup.vue'
import ChatBtn from '@/components/ChatBtn.vue'
import ChatInput from '@/components/ChatInput.vue'
import ChatRecords from '@/components/ChatRecords.vue'
import DigitalHumanIntro from '@/components/DigitalHumanIntro.vue'
import DigitalHumanRoleSelection from '@/components/DigitalHumanRoleSelection.vue'
import { useVideoChatStore } from '@/store'
import { useVisionStore } from '@/store/vision'
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref, useTemplateRef } from 'vue'
import { Spin } from 'ant-design-vue'
import {
  LeftOutlined,
  SettingOutlined,
  VideoCameraOutlined,
  AudioOutlined,
  SoundOutlined,
} from '@ant-design/icons-vue'
const visionState = useVisionStore()
const videoChatState = useVideoChatStore()
const wrapRef = ref<HTMLDivElement>()

const localVideoContainerRef = ref<HTMLDivElement>()
const remoteVideoContainerRef = ref<HTMLDivElement>()
const localVideoRef = ref<HTMLVideoElement>()
const remoteVideoRef = ref<HTMLVideoElement>()
const remoteAspectRatio = ref('9 / 16')

// 设置菜单相关状态
const settingsMenuVisible = ref(false)
const videoStreamEnabled = ref(true)
const knowledgeBaseEnabled = ref(true)
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

  // 如果会话未开始，确保显示数字人介绍组件
  if (streamState.value === 'closed') {
    videoChatState.showDigitalHumanIntro = true
  }
})
const {
  hasCamera,
  hasMic,
  micMuted,
  cameraOff,
  webcamAccessed,
  showDigitalHumanIntro,
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
  // 隐藏数字人介绍组件
  videoChatState.showDigitalHumanIntro = false
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

        // 更新会话记录中的消息
        if (videoChatState.sessionRecordManager) {
          videoChatState.sessionRecordManager.addMessage(data.role || 'human', item.message)
        }
      } else {
        videoChatState.chatRecords = [
          ...videoChatState.chatRecords,
          {
            id: data.id,
            role: data.role || 'human', // TODO: 默认值测试后续删除
            message: data.message,
          },
        ]

        // 添加新消息到会话记录
        if (videoChatState.sessionRecordManager) {
          videoChatState.sessionRecordManager.addMessage(data.role || 'human', data.message)
        }
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

function onSwitchToVoice() {
  // 切换到语音模式：如果当前是静音状态，则取消静音
  if (videoChatState.micMuted) {
    videoChatState.handleMicMuted()
  }
}

function onSwitchToText() {
  // 切换到文本模式：如果当前不是静音状态，则开启静音
  if (!videoChatState.micMuted) {
    videoChatState.handleMicMuted()
  }
}

// 设置菜单相关方法
function toggleSettingsMenu() {
  settingsMenuVisible.value = !settingsMenuVisible.value
}

function toggleVideoStream() {
  videoStreamEnabled.value = !videoStreamEnabled.value
  // TODO: 实现视频流开关逻辑
  console.log('视频流状态:', videoStreamEnabled.value ? '开启' : '关闭')
}

function toggleKnowledgeBase() {
  knowledgeBaseEnabled.value = !knowledgeBaseEnabled.value
  // TODO: 实现知识库开关逻辑
  console.log('知识库状态:', knowledgeBaseEnabled.value ? '开启' : '关闭')
}
</script>
<style lang="less" scoped>
@import './index.less';
</style>
