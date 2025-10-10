<template>
  <div class="player-controls">
    <div
      :class="[
        'chat-btn',
        streamState === 'closed' && 'start-chat',
        streamState === 'open' && 'stop-chat',
      ]"
      @click="onStartChat"
    >
      <template v-if="streamState === 'closed'">
        <span>点击开始对话</span>
      </template>
      <template v-else-if="streamState === 'waiting'">
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
          <div class="keyboard-button" @click.stop="onSwitchToText">
            <img src="/src/assets/lucide--keyboard.svg" alt="键盘" class="keyboard-icon" />
          </div>

          <!-- 中间录音状态区域 -->
          <div class="recording-status" @click.stop>
            <AudioWave
              :audio-source-callback="audioSourceCallback"
              :stream-state="streamState as any"
              :wave-color="'#7873f6'"
              :num-bars="16"
            />
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

const props = defineProps<{
  streamState: string
  onStartChat: () => void
  audioSourceCallback: () => MediaStream
  waveColor: string
}>()

const emit = defineEmits(['switchToText'])

function onSwitchToText() {
  emit('switchToText')
}
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

  // PC端优化：减少底部按钮区域占用空间
  @media (min-width: 1025px) {
    min-height: 50px; // 进一步减少最小高度
    max-height: 70px; // 进一步减少最大高度
    margin: 4px auto; // 大幅减少上下边距
    padding: 0 20px;
  }

  @media (max-width: 1024px) and (min-width: 769px) {
    min-height: 85px;
    max-height: 110px;
    margin: 12px auto;
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

    // PC端优化：减少停止聊天按钮的尺寸
    @media (min-width: 1025px) {
      width: 380px;
      min-width: 280px;
      height: 35px; // 进一步减少高度
    }

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
      gap: 24px;
      width: 100%;
      height: 100%;
      padding: 12px 20px;
      justify-content: space-between;

      // PC端优化：减少容器内边距
      @media (min-width: 1025px) {
        gap: 16px; // 减少间距
        padding: 6px 16px; // 减少内边距
      }

      @media (max-width: 1024px) and (min-width: 769px) {
        gap: 20px;
        padding: 10px 18px;
      }

      @media (max-width: 768px) {
        gap: 18px;
        padding: 8px 16px;
      }

      @media (max-width: 480px) {
        gap: 16px;
        padding: 6px 14px;
      }

      @media (max-width: 360px) {
        gap: 14px;
        padding: 4px 12px;
      }

      // 左侧键盘按钮
      .keyboard-button {
        width: 48px;
        height: 48px;
        background: rgba(88, 87, 87, 0.5);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s ease;
        backdrop-filter: blur(8px);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);

        &:hover {
          background: rgba(103, 102, 106, 0.7);
          transform: scale(1.05);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        &:active {
          transform: scale(0.95);
        }

        .keyboard-icon {
          width: 24px;
          height: 24px;
          filter: brightness(0) saturate(100%) invert(100%) sepia(0%) saturate(0%) hue-rotate(0deg)
            brightness(100%) contrast(100%);
          transition: all 0.3s ease;
        }

        &:hover .keyboard-icon {
          transform: scale(1.1);
        }

        @media (max-width: 1024px) and (min-width: 769px) {
          width: 44px;
          height: 44px;

          .keyboard-icon {
            width: 22px;
            height: 22px;
          }
        }

        @media (max-width: 768px) {
          width: 40px;
          height: 40px;

          .keyboard-icon {
            width: 20px;
            height: 20px;
          }
        }

        @media (max-width: 480px) {
          width: 36px;
          height: 36px;

          .keyboard-icon {
            width: 18px;
            height: 18px;
          }
        }

        @media (max-width: 360px) {
          width: 32px;
          height: 32px;

          .keyboard-icon {
            width: 16px;
            height: 16px;
          }
        }
      }

      // 中间录音状态区域
      .recording-status {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 24px;
        min-height: 69px; // 86px * 0.8 ≈ 69px (减少1/5)
        background: #f8f9fa;
        border-radius: 34px; // 高度的一半，保持圆形
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        border: 1px solid #e9ecef;

        // PC端优化：减少录音状态区域高度
        @media (min-width: 1025px) {
          min-height: 28px; // 进一步减少高度
          border-radius: 14px; // 调整圆角
          padding: 0 12px; // 减少内边距
        }

        // 优化AudioWave组件的显示
        :deep(.gradio-webrtc-waveContainer) {
          min-height: 56px;
          max-height: 72px;
          display: flex;
          align-items: center;
          justify-content: center;

          // PC端优化：减少AudioWave容器高度
          @media (min-width: 1025px) {
            min-height: 20px; // 进一步减少最小高度
            max-height: 28px; // 进一步减少最大高度
          }
        }

        :deep(.gradio-webrtc-boxContainer) {
          height: 56px;
          --boxSize: 5px;
          --gutter: 6px;

          // PC端优化：减少AudioWave盒子高度
          @media (min-width: 1025px) {
            height: 20px; // 进一步减少高度
            --boxSize: 2px; // 减小盒子尺寸
            --gutter: 2px; // 减小间距
          }
        }

        :deep(.gradio-webrtc-box) {
          background: #7873f6 !important;
          border-radius: 3px !important;
          transition: all 0.1s ease !important;
        }

        :deep(.split-container) {
          width: 100px;

          .recording-text {
            font-size: 16px;
            font-weight: 600;
            color: #2c3e50;
            font-family:
              -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB',
              'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif;
            letter-spacing: 0.02em;
            white-space: nowrap;
            text-align: center;
          }
        }

        @media (max-width: 1024px) and (min-width: 769px) {
          padding: 0 20px;
          min-height: 63px; // 79px * 0.8 ≈ 63px (减少1/5)
          border-radius: 31px; // 高度的一半

          :deep(.gradio-webrtc-waveContainer) {
            min-height: 50px;
            max-height: 66px;
          }

          :deep(.gradio-webrtc-boxContainer) {
            height: 50px;
            --boxSize: 4px;
            --gutter: 5px;
          }

          :deep(.split-container) {
            width: 90px;

            .recording-text {
              font-size: 15px;
            }
          }
        }

        @media (max-width: 768px) {
          padding: 0 18px;
          min-height: 58px; // 72px * 0.8 ≈ 58px (减少1/5)
          border-radius: 29px; // 高度的一半

          :deep(.gradio-webrtc-waveContainer) {
            min-height: 46px;
            max-height: 62px;
          }

          :deep(.gradio-webrtc-boxContainer) {
            height: 46px;
            --boxSize: 4px;
            --gutter: 5px;
          }

          :deep(.split-container) {
            width: 80px;

            .recording-text {
              font-size: 14px;
            }
          }
        }

        @media (max-width: 480px) {
          padding: 0 16px;
          min-height: 52px; // 65px * 0.8 ≈ 52px (减少1/5)
          border-radius: 26px; // 高度的一半

          :deep(.gradio-webrtc-waveContainer) {
            min-height: 42px;
            max-height: 58px;
          }

          :deep(.gradio-webrtc-boxContainer) {
            height: 42px;
            --boxSize: 3px;
            --gutter: 4px;
          }

          :deep(.split-container) {
            width: 70px;

            .recording-text {
              font-size: 13px;
            }
          }
        }

        @media (max-width: 360px) {
          padding: 0 14px;
          min-height: 46px; // 58px * 0.8 ≈ 46px (减少1/5)
          border-radius: 23px; // 高度的一半

          :deep(.gradio-webrtc-waveContainer) {
            min-height: 38px;
            max-height: 54px;
          }

          :deep(.gradio-webrtc-boxContainer) {
            height: 38px;
            --boxSize: 3px;
            --gutter: 4px;
          }

          :deep(.split-container) {
            width: 60px;

            .recording-text {
              font-size: 12px;
            }
          }
        }
      }

      // 右侧停止按钮
      .stop-button {
        width: 48px;
        height: 48px;
        background: rgba(120, 115, 246, 0.8);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s ease;
        backdrop-filter: blur(8px);
        box-shadow: 0 2px 8px rgba(120, 115, 246, 0.3);

        &:hover {
          background: rgba(120, 115, 246, 1);
          transform: scale(1.05);
          box-shadow: 0 4px 12px rgba(120, 115, 246, 0.4);
        }

        &:active {
          transform: scale(0.95);
        }

        .stop-icon {
          width: 18px;
          height: 18px;
          background: #ffffff;
          border-radius: 2px;
          transition: all 0.3s ease;
        }

        &:hover .stop-icon {
          transform: scale(1.1);
        }

        @media (max-width: 1024px) and (min-width: 769px) {
          width: 44px;
          height: 44px;

          .stop-icon {
            width: 16px;
            height: 16px;
          }
        }

        @media (max-width: 768px) {
          width: 40px;
          height: 40px;

          .stop-icon {
            width: 14px;
            height: 14px;
          }
        }

        @media (max-width: 480px) {
          width: 36px;
          height: 36px;

          .stop-icon {
            width: 12px;
            height: 12px;
          }
        }

        @media (max-width: 360px) {
          width: 32px;
          height: 32px;

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
