<template>
  <div class="player-controls">
    <div
      :class="[
        'chat-btn',
        streamState === StreamState.closed && 'start-chat',
        streamState === StreamState.open && 'stop-chat',
      ]"
      @click="onStartChat"
    >
      <template v-if="streamState === StreamState.closed">
        <span>点击开始对话</span>
      </template>
      <template v-else-if="streamState === StreamState.waiting">
        <div class="waiting-icon-text">
          <!-- <div class="icon" title="spinner">
            <Spin wrapper-class-name="spin-icon" />
          </div> -->
          <span>等待中...</span>
        </div>
      </template>
      <template v-else>
        <!-- 新的停止聊天UI界面 - 三个独立组件 -->
        <div class="stop-chat-container">
          <!-- 左侧键盘按钮 -->
          <div class="keyboard-button">
            <img src="/src/assets/lucide--keyboard.svg" alt="键盘" class="keyboard-icon" />
          </div>

          <!-- 中间录音状态区域 -->
          <div class="recording-status">
            <div class="audio-wave-container">
              <AudioWave
                :audio-source-callback="audioSourceCallback"
                :stream-state="streamState"
                :wave-color="'#7873f6'"
                :num-bars="12"
              />
            </div>
          </div>

          <!-- 右侧停止按钮 -->
          <div class="stop-button">
            <div class="stop-icon"></div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Spin } from 'ant-design-vue'
import { StreamState } from '@/interface/voiceChat'
import AudioWave from '@/components/AudioWave.vue'
import Iconfont, { Keyboard } from '@/components/Iconfont'

const props = defineProps({
  streamState: {
    type: String,
    default: StreamState.closed,
  },
  onStartChat: {
    type: Function,
    required: true,
  },
  audioSourceCallback: {
    type: Function,
    required: true,
  },
  waveColor: {
    type: String,
    required: true,
  },
})

const emit = defineEmits([])
</script>

<style scoped lang="less"></style>

<style scoped lang="less">
.player-controls {
  flex: 0 0 auto;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100px;
  max-height: 140px;
  margin: 16px auto;
  padding: 0 16px;

  @media (max-width: 1024px) and (min-width: 769px) {
    min-height: 95px;
    max-height: 130px;
    margin: 14px auto;
    padding: 0 14px;
  }

  @media (max-width: 768px) {
    min-height: 90px;
    max-height: 120px;
    margin: 12px auto;
    padding: 0 12px;
  }

  @media (max-width: 480px) {
    min-height: 85px;
    max-height: 110px;
    margin: 10px auto;
    padding: 0 10px;
  }

  @media (max-width: 360px) {
    min-height: 80px;
    max-height: 100px;
    margin: 8px auto;
    padding: 0 8px;
  }

  .chat-btn {
    height: 64px;
    width: 296px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 999px;
    opacity: 1;
    background: linear-gradient(180deg, #7873f6 0%, #524de1 100%);
    transition: all 0.3s;
    z-index: 2;
    cursor: pointer;

    @media (max-width: 1024px) and (min-width: 769px) {
      height: 60px;
      width: 280px;
    }

    @media (max-width: 768px) {
      height: 56px;
      width: 260px;
    }

    @media (max-width: 480px) {
      height: 52px;
      width: 240px;
    }

    @media (max-width: 360px) {
      height: 48px;
      width: 220px;
    }
  }

  .start-chat {
    font-size: 16px;
    font-weight: 500;
    text-align: center;
    color: #ffffff;

    @media (max-width: 1024px) and (min-width: 769px) {
      font-size: 15px;
    }

    @media (max-width: 768px) {
      font-size: 14px;
    }

    @media (max-width: 480px) {
      font-size: 13px;
    }

    @media (max-width: 360px) {
      font-size: 12px;
    }
  }

  .waiting-icon-text {
    width: 80px;
    align-items: center;
    font-size: 16px;
    font-weight: 500;
    color: #ffffff;
    margin: 0 var(--spacing-sm);
    display: flex;
    justify-content: space-evenly;
    gap: var(--size-1);

    @media (max-width: 1024px) and (min-width: 769px) {
      font-size: 15px;
      width: 75px;
    }

    @media (max-width: 768px) {
      font-size: 14px;
      width: 70px;
    }

    @media (max-width: 480px) {
      font-size: 13px;
      width: 65px;
    }

    @media (max-width: 360px) {
      font-size: 12px;
      width: 60px;
    }

    .icon {
      width: 25px;
      height: 25px;
      fill: #ffffff;
      stroke: #ffffff;
      color: #ffffff;

      @media (max-width: 1024px) and (min-width: 769px) {
        width: 23px;
        height: 23px;
      }

      @media (max-width: 768px) {
        width: 21px;
        height: 21px;
      }

      @media (max-width: 480px) {
        width: 19px;
        height: 19px;
      }

      @media (max-width: 360px) {
        width: 17px;
        height: 17px;
      }
    }
    .spin-icon {
      color: #fff;
    }
    :global(.ant-spin-dot-item) {
      background-color: #fff !important;
    }
  }

  .stop-chat {
    width: 500px;
    min-width: 400px;
    height: 60px;
    background: transparent;
    border-radius: 0;
    padding: 0;

    @media (max-width: 1024px) and (min-width: 769px) {
      width: 480px;
      min-width: 380px;
      height: 56px;
    }

    @media (max-width: 768px) {
      width: 460px;
      min-width: 360px;
      height: 52px;
    }

    @media (max-width: 480px) {
      width: 440px;
      min-width: 340px;
      height: 48px;
    }

    @media (max-width: 360px) {
      width: 420px;
      min-width: 320px;
      height: 44px;
    }

    .stop-chat-inner {
      display: none; // 隐藏原来的停止按钮
    }

    // 新的停止聊天容器样式
    .stop-chat-container {
      display: flex;
      align-items: center;
      gap: 20px;
      width: 100%;
      height: 100%;
      padding: 8px;

      // 左侧键盘按钮
      .keyboard-button {
        width: 64px;
        height: 64px;
        background: linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        border: 1px solid rgba(0, 0, 0, 0.08);
        box-shadow:
          0 8px 24px rgba(0, 0, 0, 0.12),
          0 4px 12px rgba(0, 0, 0, 0.08),
          inset 0 1px 0 rgba(255, 255, 255, 0.8);
        position: relative;
        overflow: hidden;

        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            145deg,
            rgba(255, 255, 255, 0.2) 0%,
            rgba(255, 255, 255, 0.05) 100%
          );
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        &:hover {
          background: linear-gradient(145deg, #f8f9fa 0%, #e9ecef 100%);
          transform: translateY(-2px) scale(1.05);
          box-shadow:
            0 12px 32px rgba(0, 0, 0, 0.18),
            0 6px 16px rgba(0, 0, 0, 0.12),
            inset 0 1px 0 rgba(255, 255, 255, 0.9);
          border-color: rgba(0, 0, 0, 0.12);

          &::before {
            opacity: 1;
          }
        }

        &:active {
          transform: translateY(-1px) scale(1.02);
          box-shadow:
            0 6px 20px rgba(0, 0, 0, 0.15),
            0 3px 8px rgba(0, 0, 0, 0.1);
        }

        .keyboard-icon {
          width: 24px;
          height: 24px;
          filter: brightness(0) saturate(100%) invert(27%) sepia(8%) saturate(1000%)
            hue-rotate(169deg) brightness(95%) contrast(89%);
          transition: all 0.3s ease;
        }

        &:hover .keyboard-icon {
          filter: brightness(0) saturate(100%) invert(15%) sepia(5%) saturate(1200%)
            hue-rotate(169deg) brightness(90%) contrast(95%);
          transform: scale(1.1);
        }

        @media (max-width: 1024px) and (min-width: 769px) {
          width: 60px;
          height: 60px;

          .keyboard-icon {
            width: 22px;
            height: 22px;
          }
        }

        @media (max-width: 768px) {
          width: 56px;
          height: 56px;

          .keyboard-icon {
            width: 20px;
            height: 20px;
          }
        }

        @media (max-width: 480px) {
          width: 52px;
          height: 52px;

          .keyboard-icon {
            width: 18px;
            height: 18px;
          }
        }

        @media (max-width: 360px) {
          width: 48px;
          height: 48px;

          .keyboard-icon {
            width: 16px;
            height: 16px;
          }
        }
      }

      // 中间录音状态区域
      .recording-status {
        flex: 1;
        height: 64px;
        background: linear-gradient(145deg, #ffffff 0%, #fafbfc 100%);
        border: 1px solid rgba(0, 0, 0, 0.08);
        border-radius: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 28px;
        box-shadow:
          0 8px 32px rgba(0, 0, 0, 0.12),
          0 4px 16px rgba(0, 0, 0, 0.08),
          inset 0 1px 0 rgba(255, 255, 255, 0.8);
        position: relative;
        overflow: hidden;
        backdrop-filter: blur(10px);

        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            145deg,
            rgba(120, 115, 246, 0.02) 0%,
            rgba(120, 115, 246, 0.01) 100%
          );
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        &:hover {
          box-shadow:
            0 12px 40px rgba(0, 0, 0, 0.15),
            0 6px 20px rgba(0, 0, 0, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.9);

          &::before {
            opacity: 1;
          }
        }

        @media (max-width: 1024px) and (min-width: 769px) {
          height: 60px;
          border-radius: 30px;
          padding: 0 24px;
        }

        @media (max-width: 768px) {
          height: 56px;
          border-radius: 28px;
          padding: 0 20px;
        }

        @media (max-width: 480px) {
          height: 52px;
          border-radius: 26px;
          padding: 0 18px;
        }

        @media (max-width: 360px) {
          height: 48px;
          border-radius: 24px;
          padding: 0 16px;
        }

        .recording-text {
          font-size: 16px;
          font-weight: 600;
          color: #2c3e50;
          font-family:
            -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB',
            'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif;
          letter-spacing: 0.02em;
          white-space: nowrap;

          @media (max-width: 1024px) and (min-width: 769px) {
            font-size: 15px;
          }

          @media (max-width: 768px) {
            font-size: 14px;
          }

          @media (max-width: 480px) {
            font-size: 13px;
          }

          @media (max-width: 360px) {
            font-size: 12px;
          }
        }

        .audio-wave-container {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;

          :deep(.gradio-webrtc-waveContainer) {
            min-height: 48px;
            max-height: 56px;
            filter: drop-shadow(0 2px 8px rgba(120, 115, 246, 0.2));
          }

          :deep(.gradio-webrtc-box) {
            background: linear-gradient(135deg, #7873f6 0%, #615ced 100%) !important;
            border-radius: 6px !important;
            box-shadow: 0 2px 4px rgba(120, 115, 246, 0.3) !important;
            transition: all 0.1s ease !important;
          }

          @media (max-width: 1024px) and (min-width: 769px) {
            :deep(.gradio-webrtc-waveContainer) {
              min-height: 44px;
              max-height: 52px;
            }
          }

          @media (max-width: 768px) {
            :deep(.gradio-webrtc-waveContainer) {
              min-height: 40px;
              max-height: 48px;
            }
          }

          @media (max-width: 480px) {
            :deep(.gradio-webrtc-waveContainer) {
              min-height: 36px;
              max-height: 44px;
            }
          }

          @media (max-width: 360px) {
            :deep(.gradio-webrtc-waveContainer) {
              min-height: 32px;
              max-height: 40px;
            }
          }
        }
      }

      // 右侧停止按钮
      .stop-button {
        width: 64px;
        height: 64px;
        background: linear-gradient(145deg, #7873f6 0%, #615ced 50%, #524de1 100%);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow:
          0 8px 24px rgba(120, 115, 246, 0.4),
          0 4px 12px rgba(120, 115, 246, 0.3),
          inset 0 1px 0 rgba(255, 255, 255, 0.2);
        border: 1px solid rgba(255, 255, 255, 0.15);
        position: relative;
        overflow: hidden;

        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            145deg,
            rgba(255, 255, 255, 0.3) 0%,
            rgba(255, 255, 255, 0.1) 100%
          );
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        &:hover {
          background: linear-gradient(145deg, #615ced 0%, #524de1 50%, #4338ca 100%);
          transform: translateY(-2px) scale(1.05);
          box-shadow:
            0 12px 32px rgba(120, 115, 246, 0.5),
            0 6px 16px rgba(120, 115, 246, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.3);

          &::before {
            opacity: 1;
          }
        }

        &:active {
          transform: translateY(-1px) scale(1.02);
          box-shadow:
            0 6px 20px rgba(120, 115, 246, 0.4),
            0 3px 8px rgba(120, 115, 246, 0.3);
        }

        .stop-icon {
          width: 18px;
          height: 18px;
          background: linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%);
          border-radius: 4px;
          box-shadow:
            0 2px 6px rgba(0, 0, 0, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.8);
          transition: all 0.3s ease;
          position: relative;
          z-index: 1;
        }

        &:hover .stop-icon {
          transform: scale(1.1);
          box-shadow:
            0 3px 8px rgba(0, 0, 0, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.9);
        }

        @media (max-width: 1024px) and (min-width: 769px) {
          width: 60px;
          height: 60px;

          .stop-icon {
            width: 16px;
            height: 16px;
          }
        }

        @media (max-width: 768px) {
          width: 56px;
          height: 56px;

          .stop-icon {
            width: 14px;
            height: 14px;
          }
        }

        @media (max-width: 480px) {
          width: 52px;
          height: 52px;

          .stop-icon {
            width: 12px;
            height: 12px;
          }
        }

        @media (max-width: 360px) {
          width: 48px;
          height: 48px;

          .stop-icon {
            width: 10px;
            height: 10px;
          }
        }
      }
    }
  }

  .input-audio-wave {
    position: absolute;
  }
}
</style>
