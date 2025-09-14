<template>
  <div class="action-group">
    <div
      v-if="hasCamera"
      v-click-outside="() => (cameraListShow = false)"
      class="action"
      @click="handleCameraOff"
    >
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
    <div
      v-if="hasMic"
      v-click-outside="() => (micListShow = false)"
      class="action"
      @click="handleMicMuted"
    >
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

    <div class="action" @click="handleVolumeMute">
      <Iconfont :icon="volumeMuted ? VolumeOff : VolumeOn" />
    </div>
    <div v-if="wrapperRect.width > 300" class="action" @click="handleSubtitleToggle">
      <Iconfont :icon="showChatRecords ? SubtitleOn : SubtitleOff" />
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
  border-radius: 20px;
  background: rgba(88, 87, 87, 0.5);
  padding: 8px;
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;

  .action {
    cursor: pointer;
    width: 70px !important;
    height: 70px !important;
    border-radius: 16px !important;
    font-size: 34px !important;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    color: #fff;
    transition: background-color 0.2s ease;
    flex-shrink: 0;

    &:hover {
      background: #67666a;
    }

    .corner {
      position: absolute;
      right: 0px;
      bottom: 0px;
      padding: 3px;

      .corner-inner {
        width: 6px;
        height: 6px;
        border-top: 3px transparent solid;
        border-left: 3px transparent solid;
        border-bottom: 3px #fff solid;
        border-right: 3px #fff solid;
      }
    }

    .selectors {
      position: absolute;
      top: 0;
      left: calc(100%);
      margin-left: 3px;
      max-height: 150px;
      min-width: 200px;

      &.left {
        left: 0;
        margin-left: -3px;
        transform: translateX(-100%);
      }

      border-radius: 12px;
      width: max-content;
      overflow: hidden;
      overflow-y: auto;
      background: rgba(90, 90, 90, 0.5);
      backdrop-filter: blur(8px);
      z-index: 1000;

      .selector {
        max-width: 250px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        position: relative;
        cursor: pointer;
        height: 42px;
        line-height: 42px;
        color: #fff;
        font-size: 14px;
        padding-left: 15px;
        padding-right: 50px;
        transition: background-color 0.2s ease;

        &:hover {
          background: #67666a;
        }

        .active-icon {
          position: absolute;
          right: 10px;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          top: 0;
        }
      }
    }
  }

  // 移动端固定尺寸 - 无需响应式
  .selectors {
    .selector {
      height: 70px;
      line-height: 70px;
      font-size: 18px;
      padding-left: 22px;
      padding-right: 70px;

      .active-icon {
        width: 60px;
        height: 60px;
        right: 18px;
      }
    }
  }

  // 移动端强制样式 - 确保在所有移动设备上生效
  @media screen and (max-width: 1024px) {
    .action {
      width: 70px !important;
      height: 70px !important;
      font-size: 34px !important;
      border-radius: 16px !important;
    }
  }

  // 移动设备特定样式
  @media screen and (max-device-width: 1024px) {
    .action {
      width: 70px !important;
      height: 70px !important;
      font-size: 34px !important;
      border-radius: 16px !important;
    }
  }
}
</style>
