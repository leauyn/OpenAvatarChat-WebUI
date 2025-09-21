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
            <Iconfont :icon="Keyboard" :fontSize="20" :color="'#666'" />
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
      gap: 16px;
      width: 100%;
      height: 100%;

      // 左侧键盘按钮
      .keyboard-button {
        width: 60px;
        height: 60px;
        background: #f8f9fa;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s ease;
        border: 2px solid #e9ecef;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

        &:hover {
          background: #e9ecef;
          transform: scale(1.05);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
        }

        @media (max-width: 1024px) and (min-width: 769px) {
          width: 56px;
          height: 56px;
        }

        @media (max-width: 768px) {
          width: 52px;
          height: 52px;
        }

        @media (max-width: 480px) {
          width: 48px;
          height: 48px;
        }

        @media (max-width: 360px) {
          width: 44px;
          height: 44px;
        }
      }

      // 中间录音状态区域
      .recording-status {
        flex: 1;
        height: 60px;
        background: #ffffff;
        border: 2px solid #e9ecef;
        border-radius: 30px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 24px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);

        @media (max-width: 1024px) and (min-width: 769px) {
          height: 56px;
          border-radius: 28px;
          padding: 0 20px;
        }

        @media (max-width: 768px) {
          height: 52px;
          border-radius: 26px;
          padding: 0 18px;
        }

        @media (max-width: 480px) {
          height: 48px;
          border-radius: 24px;
          padding: 0 16px;
        }

        @media (max-width: 360px) {
          height: 44px;
          border-radius: 22px;
          padding: 0 14px;
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
          margin-left: 16px;

          :deep(.gradio-webrtc-waveContainer) {
            min-height: 40px;
            max-height: 50px;
          }

          @media (max-width: 1024px) and (min-width: 769px) {
            margin-left: 14px;

            :deep(.gradio-webrtc-waveContainer) {
              min-height: 36px;
              max-height: 46px;
            }
          }

          @media (max-width: 768px) {
            margin-left: 12px;

            :deep(.gradio-webrtc-waveContainer) {
              min-height: 32px;
              max-height: 42px;
            }
          }

          @media (max-width: 480px) {
            margin-left: 10px;

            :deep(.gradio-webrtc-waveContainer) {
              min-height: 28px;
              max-height: 38px;
            }
          }

          @media (max-width: 360px) {
            margin-left: 8px;

            :deep(.gradio-webrtc-waveContainer) {
              min-height: 24px;
              max-height: 34px;
            }
          }
        }
      }

      // 右侧停止按钮
      .stop-button {
        width: 60px;
        height: 60px;
        background: linear-gradient(135deg, #7873f6 0%, #615ced 100%);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 4px 16px rgba(120, 115, 246, 0.3);
        border: 2px solid rgba(255, 255, 255, 0.2);

        &:hover {
          transform: scale(1.05);
          box-shadow: 0 6px 20px rgba(120, 115, 246, 0.4);
        }

        &:active {
          transform: scale(0.98);
        }

        @media (max-width: 1024px) and (min-width: 769px) {
          width: 56px;
          height: 56px;
        }

        @media (max-width: 768px) {
          width: 52px;
          height: 52px;
        }

        @media (max-width: 480px) {
          width: 48px;
          height: 48px;
        }

        @media (max-width: 360px) {
          width: 44px;
          height: 44px;
        }

        .stop-icon {
          width: 16px;
          height: 16px;
          background: #ffffff;
          border-radius: 3px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

          @media (max-width: 1024px) and (min-width: 769px) {
            width: 14px;
            height: 14px;
          }

          @media (max-width: 768px) {
            width: 12px;
            height: 12px;
          }

          @media (max-width: 480px) {
            width: 10px;
            height: 10px;
          }

          @media (max-width: 360px) {
            width: 8px;
            height: 8px;
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
