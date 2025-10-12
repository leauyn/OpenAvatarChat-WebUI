<template>
  <!-- 摄像头按钮 -->
  <div
    v-if="hasCamera"
    v-click-outside="() => (cameraListShow = false)"
    class="action-button"
    :class="{ 'startup-mode': isStartupMode }"
    @click="handleCameraOff"
  >
    <Iconfont
      :icon="cameraOff ? CameraOff : CameraOn"
      :fontSize="iconFontSize"
      class="action-icon"
    />
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

  <!-- 麦克风按钮 -->
  <div
    v-if="hasMic"
    v-click-outside="() => (micListShow = false)"
    class="action-button"
    :class="{ 'startup-mode': isStartupMode }"
    @click="handleMicMuted"
  >
    <Iconfont :icon="micMuted ? MicOff : MicOn" :fontSize="iconFontSize" class="action-icon" />
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

  <!-- 音量按钮 -->
  <div class="action-button" :class="{ 'startup-mode': isStartupMode }" @click="handleVolumeMute">
    <Iconfont
      :icon="volumeMuted ? VolumeOff : VolumeOn"
      :fontSize="iconFontSize"
      class="action-icon"
    />
  </div>
</template>
<script setup lang="ts">
import { useVideoChatStore } from '@/store'
import { useVisionStore } from '@/store/vision'
import { storeToRefs } from 'pinia'
import { ref, computed } from 'vue'
import Iconfont, {
  CameraOff,
  CameraOn,
  CheckIcon,
  MicOff,
  MicOn,
  VolumeOff,
  VolumeOn,
} from './Iconfont'

// 定义 props
interface Props {
  isStartupMode?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isStartupMode: false,
})
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

// 响应式字体大小计算 - 与 LeftOutlined 和 SettingOutlined 完全一致
const iconFontSize = computed(() => {
  const width = wrapperRect.value.width
  let size = 32 // 默认与 LeftOutlined 的 font-size 一致

  if (width <= 360) size = 18
  else if (width <= 480) size = 20
  else if (width <= 768) size = 24
  else if (width <= 1024) size = 28

  console.log('Icon font size:', size, 'Screen width:', width)
  return size
})
</script>

<style lang="less" scoped>
.action-button {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;

  .action-icon {
    color: rgba(255, 255, 255, 0.9);
    background: rgba(255, 255, 255, 0.15);
    border-radius: 50%;
    padding: 8px;
    backdrop-filter: blur(12px);
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 48px;
    min-height: 48px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    &:hover {
      background: rgba(255, 255, 255, 0.25);
      color: #fff;
      transform: scale(1.05);
      border-color: rgba(255, 255, 255, 0.3);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    // 确保图标大小正确
    :deep(.icon) {
      font-size: inherit !important;
    }

    // PC端优化：与setting-icon保持一致
    @media (min-width: 1025px) {
      padding: 6px;
      min-width: 40px;
      min-height: 40px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    @media screen and (max-width: 1024px) and (min-width: 769px) {
      padding: 6px;
      min-width: 44px;
      min-height: 44px;
      border: 1px solid rgba(255, 255, 255, 0.18);
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
    }

    @media screen and (max-width: 768px) {
      padding: 6px;
      min-width: 40px;
      min-height: 40px;
      border: 1px solid rgba(255, 255, 255, 0.16);
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
    }

    @media screen and (max-width: 480px) {
      padding: 4px;
      min-width: 36px;
      min-height: 36px;
      border: 1px solid rgba(255, 255, 255, 0.14);
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
    }

    @media screen and (max-width: 360px) {
      padding: 4px;
      min-width: 32px;
      min-height: 32px;
      border: 1px solid rgba(255, 255, 255, 0.12);
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
    }
  }

  // 启动模式样式 - 适合白色背景，与 LeftOutlined 和 SettingOutlined 保持一致
  &.startup-mode .action-icon {
    color: #fff;
    background: rgba(88, 87, 87, 0.5);
    border: none;
    box-shadow: none;
    backdrop-filter: blur(8px);
    font-size: 32px; // 默认与 LeftOutlined 的 font-size 一致

    &:hover {
      background: rgba(103, 102, 106, 0.7);
      color: #fff;
      transform: scale(1.05);
    }

    // 对于填充类型的图标，调整填充颜色和透明度
    :deep(svg path[fill]) {
      fill: currentColor;
      fill-opacity: 1;
    }

    // 对于描边类型的图标，调整描边粗细
    :deep(svg path[stroke]) {
      stroke: currentColor;
      stroke-width: 1.5;
    }

    // 启动模式响应式样式 - 与 LeftOutlined 和 SettingOutlined 完全一致
    @media screen and (max-width: 1024px) and (min-width: 769px) {
      font-size: 28px;
      padding: 6px;
      min-width: 44px;
      min-height: 44px;
    }

    @media screen and (max-width: 768px) {
      font-size: 24px;
      padding: 6px;
      min-width: 40px;
      min-height: 40px;
    }

    @media screen and (max-width: 480px) {
      font-size: 20px;
      padding: 4px;
      min-width: 36px;
      min-height: 36px;
    }

    @media screen and (max-width: 360px) {
      font-size: 18px;
      padding: 4px;
      min-width: 32px;
      min-height: 32px;
    }
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
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
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
      color: rgba(255, 255, 255, 0.9);
      font-size: 14px;
      padding-left: 15px;
      padding-right: 50px;
      transition: all 0.2s ease;

      &:hover {
        background: rgba(255, 255, 255, 0.15);
        color: #fff;
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

  // 平板设备响应式设计
  @media screen and (max-width: 1024px) and (min-width: 769px) {
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
