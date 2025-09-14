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
    width: 70px;
    height: 70px;
    border-radius: 16px;
    font-size: 34px;
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

  // 平板设备响应式设计
  @media screen and (max-width: 1024px) and (min-width: 769px) {
    padding: 6px;
    gap: 6px;

    .action {
      width: 60px;
      height: 60px;
      font-size: 28px;
      border-radius: 14px;
    }

    .selectors {
      .selector {
        height: 50px;
        line-height: 50px;
        font-size: 16px;
        padding-left: 18px;
        padding-right: 60px;

        .active-icon {
          width: 50px;
          height: 50px;
          right: 15px;
        }
      }
    }
  }

  // 移动设备响应式设计
  @media screen and (max-width: 768px) {
    padding: 6px;
    gap: 6px;
    border-radius: 16px;

    .action {
      width: 50px;
      height: 50px;
      font-size: 24px;
      border-radius: 12px;
    }

    .selectors {
      .selector {
        height: 50px;
        line-height: 50px;
        font-size: 16px;
        padding-left: 18px;
        padding-right: 60px;

        .active-icon {
          width: 50px;
          height: 50px;
          right: 15px;
        }
      }
    }
  }

  // 小屏移动设备响应式设计
  @media screen and (max-width: 480px) {
    padding: 4px;
    gap: 4px;
    border-radius: 12px;

    .action {
      width: 44px;
      height: 44px;
      font-size: 20px;
      border-radius: 10px;
    }

    .selectors {
      .selector {
        height: 44px;
        line-height: 44px;
        font-size: 14px;
        padding-left: 16px;
        padding-right: 50px;

        .active-icon {
          width: 44px;
          height: 44px;
          right: 12px;
        }
      }
    }
  }

  // 超小屏设备
  @media screen and (max-width: 360px) {
    padding: 3px;
    gap: 3px;
    border-radius: 10px;

    .action {
      width: 40px;
      height: 40px;
      font-size: 18px;
      border-radius: 8px;
    }

    .selectors {
      .selector {
        height: 40px;
        line-height: 40px;
        font-size: 12px;
        padding-left: 14px;
        padding-right: 45px;

        .active-icon {
          width: 40px;
          height: 40px;
          right: 10px;
        }
      }
    }
  }
}
</style>
