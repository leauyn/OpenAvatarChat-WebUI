<template>
  <div class="action-group">
    <div v-if="hasCamera" class="action-wrapper">
      <div v-click-outside="() => (cameraListShow = false)" class="action" @click="handleCameraOff">
        <Iconfont :icon="cameraOff ? CameraOff : CameraOn" />
        <div
          v-if="streamState === 'closed'"
          class="corner"
          @click.stop.prevent="() => (cameraListShow = !cameraListShow)"
        >
          <div class="corner-inner" />
        </div>
        <div
          v-show="cameraListShow && streamState === 'closed'"
          class="selectors"
          :class="{ left: isLandscape }"
        >
          <div
            v-for="device in availableVideoDevices"
            :key="device.deviceId"
            class="selector"
            @click.stop="
              () => {
                handleDeviceChange(device.deviceId)
                cameraListShow = false
              }
            "
          >
            {{ device.label }}
            <div
              v-if="selectedVideoDevice && device.deviceId === selectedVideoDevice.deviceId"
              class="active-icon"
            >
              <CheckIcon />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="hasMic" class="action-wrapper">
      <div v-click-outside="() => (micListShow = false)" class="action" @click="handleMicMuted">
        <Iconfont :icon="micMuted ? MicOff : MicOn" />
        <div
          v-if="streamState === 'closed'"
          class="corner"
          @click.stop.prevent="() => (micListShow = !micListShow)"
        >
          <div class="corner-inner" />
        </div>
        <div
          v-show="micListShow && streamState === 'closed'"
          class="selectors"
          :class="{ left: isLandscape }"
        >
          <div
            v-for="device in availableAudioDevices"
            :key="device.deviceId"
            class="selector"
            @click.stop="
              (e) => {
                handleDeviceChange(device.deviceId)
                micListShow = false
              }
            "
          >
            {{ device.label }}
            <div
              v-if="selectedAudioDevice && device.deviceId === selectedAudioDevice.deviceId"
              class="active-icon"
            >
              <CheckIcon />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="action-wrapper">
      <div class="action" @click="handleVolumeMute">
        <Iconfont :icon="volumeMuted ? VolumeOff : VolumeOn" />
      </div>
    </div>
    <div v-if="wrapperRect.width > 300" class="action-wrapper">
      <div class="action" @click="handleSubtitleToggle">
        <Iconfont :icon="showChatRecords ? SubtitleOn : SubtitleOff" />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useVideoChatStore } from '@/store'
import { useVisionStore } from '@/store/vision'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import Iconfont, {
  CameraOff,
  CameraOn,
  CheckIcon,
  MicOff,
  MicOn,
  SubtitleOff,
  SubtitleOn,
  VolumeOff,
  VolumeOn,
} from './Iconfont'
const videoChatStore = useVideoChatStore()
const visionStore = useVisionStore()
const {
  hasCamera,
  hasMic,
  cameraOff,
  micMuted,
  volumeMuted,
  showChatRecords,
  streamState,

  selectedAudioDevice,
  selectedVideoDevice,
  availableAudioDevices,
  availableVideoDevices,
} = storeToRefs(videoChatStore)
const {
  handleCameraOff,
  handleMicMuted,
  handleVolumeMute,
  handleDeviceChange,
  handleSubtitleToggle,
} = videoChatStore

const { wrapperRect, isLandscape } = storeToRefs(visionStore)
const micListShow = ref(false)
const cameraListShow = ref(false)
</script>

<style lang="less" scoped>
.action-group {
  display: flex;
  align-items: center;
  gap: 8px;
  border-radius: 16px;
  background: rgba(0, 0, 0, 0.6);
  padding: 8px 12px;
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);

  .action-wrapper {
    position: relative;
  }

  .action {
    cursor: pointer;
    width: 48px;
    height: 48px;
    border-radius: 12px;
    font-size: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    color: #fff;
    transition: all 0.2s ease;
    background: rgba(255, 255, 255, 0.05);

    &:hover {
      background: rgba(255, 255, 255, 0.15);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }

    &:active {
      transform: translateY(0);
    }

    .corner {
      position: absolute;
      right: 2px;
      bottom: 2px;
      padding: 2px;

      .corner-inner {
        width: 6px;
        height: 6px;
        border-top: 2px transparent solid;
        border-left: 2px transparent solid;
        border-bottom: 2px #fff solid;
        border-right: 2px #fff solid;
      }
    }

    .selectors {
      position: absolute;
      top: 0;
      left: calc(100% + 8px);
      margin-top: 0;
      max-height: 200px;
      min-width: 200px;

      &.left {
        left: auto;
        right: calc(100% + 8px);
        transform: none;
      }

      border-radius: 12px;
      width: max-content;
      overflow: hidden;
      overflow-y: auto;
      background: rgba(0, 0, 0, 0.8);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
      z-index: 1000;

      .selector {
        max-width: 250px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        position: relative;
        cursor: pointer;
        height: 48px;
        line-height: 48px;
        color: #fff;
        font-size: 14px;
        padding: 0 16px;
        transition: background-color 0.2s ease;

        &:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .active-icon {
          position: absolute;
          right: 12px;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          top: 50%;
          transform: translateY(-50%);
        }
      }
    }
  }

  // 响应式设计
  @media (max-width: 768px) {
    gap: 6px;
    padding: 6px 10px;

    .action {
      width: 44px;
      height: 44px;
      font-size: 18px;
    }
  }

  @media (max-width: 480px) {
    gap: 4px;
    padding: 4px 8px;

    .action {
      width: 40px;
      height: 40px;
      font-size: 16px;
    }
  }
}
</style>
