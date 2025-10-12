<script setup lang="ts">
import Iconfont, { Send, Keyboard } from '@/components/Iconfont'
import { insertStringAt } from '@/utils/utils'
import { useTemplateRef } from 'vue'

const props = withDefaults(
  defineProps<{
    replying: boolean
    micEnabled?: boolean
  }>(),
  {
    micEnabled: false,
  }
)
const emit = defineEmits(['send', 'stop', 'interrupt', 'switchToVoice'])

let inputHeight = 24
let rowsDivRef = useTemplateRef<HTMLDivElement>('rowsDivRef')
let chatInputRef = useTemplateRef<HTMLInputElement>('chatInputRef')
let inputValue = ''
function on_chat_input_keydown(event: KeyboardEvent) {
  if (event.key === 'Enter') {
    if (event.altKey) {
      if (chatInputRef.value) {
        chatInputRef.value.value = insertStringAt(
          chatInputRef.value.value,
          '\n',
          chatInputRef.value.selectionStart || 0
        )
        chatInputRef.value.dispatchEvent(new InputEvent('input'))
      }
    } else {
      event.preventDefault()
      on_send()
    }
  }
}
async function on_send() {
  if (chatInputRef.value) {
    emit('send', chatInputRef.value.value)
    chatInputRef.value.value = ''
  }
}
function on_chat_input(event: Event) {
  if (rowsDivRef.value) {
    rowsDivRef.value.textContent = (event.target as any).value.replace(/\n$/, '\n\n')
    inputHeight = rowsDivRef.value.offsetHeight
  }
}

function onStop() {
  emit('stop')
}
function onInterrupt() {
  emit('interrupt')
}

function onSwitchToVoice() {
  emit('switchToVoice')
}
</script>

<template>
  <div class="chat-input-container">
    <div class="chat-input-main">
      <!-- 左侧麦克风图标 -->
      <div class="mic-button" @click="onSwitchToVoice">
        <img src="/src/assets/lucide--mic.svg" alt="麦克风" class="mic-icon" />
      </div>

      <div class="chat-input-inner">
        <div class="chat-input-wrapper">
          <textarea
            class="chat-input"
            ref="chatInputRef"
            @keydown="on_chat_input_keydown"
            @input="on_chat_input"
            :style="`height:${inputHeight}px`"
            placeholder="输入消息..."
          />
          <div class="rowsDiv" ref="rowsDivRef">{{ inputValue }}</div>
        </div>
      </div>

      <!-- 右侧发送/中断按钮 -->
      <template v-if="replying">
        <button class="interrupt-btn" @click="onInterrupt"></button>
      </template>
      <template v-else>
        <button class="send-btn" @click="on_send">
          <img src="/src/assets/lucide--send.svg" alt="发送" class="send-icon" />
        </button>
      </template>
    </div>
  </div>

  <!-- 暂时注释掉AI生成提示，避免对video-container造成挤压 -->
  <!-- <div class="ai-generate-hint">内容由 AI 生成</div> -->
</template>

<style scoped lang="less">
.chat-input-container {
  flex: 0 0 auto;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100px;
  max-height: 100px;
  width: 500px;
  min-width: 400px;
  margin: 16px auto;
  padding: 0 16px;

  // PC端优化：与player-controls保持一致的高度
  @media (min-width: 1025px) {
    min-height: 50px;
    max-height: 70px;
    margin: 4px auto;
    padding: 0 20px;
  }

  @media (max-width: 1024px) and (min-width: 769px) {
    min-height: 95px;
    max-height: 95px;
    width: 480px;
    min-width: 380px;
    margin: 14px auto;
    padding: 0 14px;
  }

  @media (max-width: 768px) {
    min-height: 90px;
    max-height: 90px;
    width: 460px;
    min-width: 360px;
    margin: 12px auto;
    padding: 0 12px;
  }

  @media (max-width: 480px) {
    min-height: 85px;
    max-height: 85px;
    width: 440px;
    min-width: 340px;
    margin: 10px auto;
    padding: 0 10px;
  }

  @media (max-width: 360px) {
    min-height: 80px;
    max-height: 80px;
    width: 420px;
    min-width: 320px;
    margin: 8px auto;
    padding: 0 8px;
  }

  .chat-input-main {
    display: flex;
    align-items: center;
    gap: 24px;
    width: 100%;
    height: 100%;
    padding: 12px 20px;
    justify-content: space-between;

    // PC端优化：减少内边距以匹配容器高度
    @media (min-width: 1025px) {
      gap: 16px;
      padding: 6px 16px;
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
  }

  .mic-button {
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

    // PC端优化：减少麦克风按钮尺寸以匹配容器高度
    @media (min-width: 1025px) {
      width: 36px;
      height: 36px;

      .mic-icon {
        width: 18px;
        height: 18px;
      }
    }

    &:hover {
      background: rgba(103, 102, 106, 0.7);
      transform: scale(1.05);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }

    &:active {
      transform: scale(0.95);
    }

    .mic-icon {
      width: 24px;
      height: 24px;
      filter: brightness(0) saturate(100%) invert(100%) sepia(0%) saturate(0%) hue-rotate(0deg)
        brightness(100%) contrast(100%);
      transition: all 0.3s ease;
    }

    &:hover .mic-icon {
      transform: scale(1.1);
    }

    @media (max-width: 1024px) and (min-width: 769px) {
      width: 44px;
      height: 44px;

      .mic-icon {
        width: 22px;
        height: 22px;
      }
    }

    @media (max-width: 768px) {
      width: 40px;
      height: 40px;

      .mic-icon {
        width: 20px;
        height: 20px;
      }
    }

    @media (max-width: 480px) {
      width: 36px;
      height: 36px;

      .mic-icon {
        width: 18px;
        height: 18px;
      }
    }

    @media (max-width: 360px) {
      width: 32px;
      height: 32px;

      .mic-icon {
        width: 16px;
        height: 16px;
      }
    }
  }

  .chat-input-inner {
    padding: 0 24px;
    background: #f8f9fa;
    min-height: 69px;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #e9ecef;
    border-radius: 34px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;

    // PC端优化：减少输入框高度以匹配容器
    @media (min-width: 1025px) {
      min-height: 48px;
      border-radius: 14px;
      padding: 0 12px;
    }

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(
        135deg,
        rgba(120, 115, 246, 0.02) 0%,
        rgba(120, 115, 246, 0.01) 100%
      );
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    &:focus-within {
      border-color: #7873f6;
      box-shadow:
        0 4px 16px -4px rgba(120, 115, 246, 0.15),
        0 8px 32px -8px rgba(120, 115, 246, 0.25),
        0 2px 8px 0 rgba(120, 115, 246, 0.1),
        inset 0 1px 0 rgba(255, 255, 255, 0.9);
      transform: translateY(-1px);

      &::before {
        opacity: 1;
      }
    }

    &:hover:not(:focus-within) {
      border-color: #c7d2fe;
      box-shadow:
        0 4px 12px -4px rgba(54, 54, 73, 0.08),
        0 6px 24px -6px rgba(51, 51, 71, 0.15),
        0 2px 6px 0 rgba(44, 44, 54, 0.06);
      transform: translateY(-0.5px);
    }

    @media (max-width: 1024px) and (min-width: 769px) {
      min-height: 63px;
      border-radius: 31px;
      padding: 0 20px;
    }

    @media (max-width: 768px) {
      min-height: 58px;
      border-radius: 29px;
      padding: 0 18px;
    }

    @media (max-width: 480px) {
      min-height: 52px;
      border-radius: 26px;
      padding: 0 16px;
    }

    @media (max-width: 360px) {
      min-height: 46px;
      border-radius: 23px;
      padding: 0 14px;
    }

    .chat-input-wrapper {
      flex: 1;
      position: relative;
      display: flex;
      align-items: center;

      .chat-input {
        width: 100%;
        border: none;
        outline: none;
        color: #1a1a2e;
        font-size: 14px;
        font-weight: 500;
        font-family:
          -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB',
          'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif;
        resize: none;
        padding: 0;
        margin: 0;
        line-height: 1.4;
        max-height: 48px;
        min-height: 20px;
        background: transparent;
        letter-spacing: 0.01em;

        &::placeholder {
          color: #8b8ba7;
          font-weight: 400;
          opacity: 0.8;
        }

        @media (max-width: 1024px) and (min-width: 769px) {
          font-size: 13px;
          line-height: 1.4;
          max-height: 44px;
        }

        @media (max-width: 768px) {
          font-size: 14px;
          line-height: 1.4;
          max-height: 40px;
        }

        @media (max-width: 480px) {
          font-size: 14px;
          line-height: 1.4;
          max-height: 36px;
        }

        @media (max-width: 360px) {
          font-size: 13px;
          line-height: 1.4;
          max-height: 32px;
        }
      }

      .rowsDiv {
        position: absolute;
        left: 0;
        right: 0;
        z-index: -1;
        visibility: hidden;
        font-size: 13px;
        font-weight: 400;
        font-family:
          -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB',
          'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif;
        line-height: 1.5;
        white-space: pre-wrap;
        word-wrap: break-word;
      }
    }
  }

  .send-btn,
  .interrupt-btn {
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

    // PC端优化：减少按钮尺寸以匹配容器高度
    @media (min-width: 1025px) {
      width: 36px;
      height: 36px;

      .send-icon {
        width: 18px;
        height: 18px;
      }
    }

    &:hover {
      background: rgba(120, 115, 246, 1);
      transform: scale(1.05);
      box-shadow: 0 4px 12px rgba(120, 115, 246, 0.4);
    }

    &:active {
      transform: scale(0.95);
    }

    .send-icon {
      width: 24px;
      height: 24px;
      filter: brightness(0) invert(1);
      transition: all 0.3s ease;
    }

    &:hover .send-icon {
      transform: scale(1.1);
    }

    @media (max-width: 1024px) and (min-width: 769px) {
      width: 44px;
      height: 44px;

      .send-icon {
        width: 22px;
        height: 22px;
      }
    }

    @media (max-width: 768px) {
      width: 40px;
      height: 40px;

      .send-icon {
        width: 20px;
        height: 20px;
      }
    }

    @media (max-width: 480px) {
      width: 36px;
      height: 36px;

      .send-icon {
        width: 18px;
        height: 18px;
      }
    }

    @media (max-width: 360px) {
      width: 32px;
      height: 32px;

      .send-icon {
        width: 16px;
        height: 16px;
      }
    }
  }

  .interrupt-btn {
    &::after {
      content: ' ';
      width: 12px;
      height: 12px;
      border-radius: 2px;
      background: #fafafa;
      transition: all 0.3s ease;
    }

    &:hover &::after {
      transform: scale(1.1);
    }
  }

  // 麦克风开启时的UI样式
  .mic-enabled-ui {
    cursor: pointer;
    height: 44px;
    min-width: 200px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-radius: 24px;
    background: linear-gradient(135deg, #f8f9ff 0%, #f0f2ff 100%);
    border: 1.5px solid #e1e5f2;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    flex-shrink: 0;
    position: relative;
    overflow: hidden;
    box-shadow:
      0 2px 8px -2px rgba(54, 54, 73, 0.06),
      0 4px 20px -4px rgba(51, 51, 71, 0.12),
      0 1px 3px 0 rgba(44, 44, 54, 0.04),
      inset 0 1px 0 rgba(255, 255, 255, 0.8);
    padding: 0 16px;
    gap: 12px;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(
        135deg,
        rgba(120, 115, 246, 0.05) 0%,
        rgba(120, 115, 246, 0.02) 100%
      );
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    &:hover {
      transform: translateY(-1px);
      box-shadow:
        0 4px 16px -4px rgba(120, 115, 246, 0.15),
        0 8px 32px -8px rgba(120, 115, 246, 0.25),
        0 2px 8px 0 rgba(120, 115, 246, 0.1),
        inset 0 1px 0 rgba(255, 255, 255, 0.9);
      border-color: #c7d2fe;

      &::before {
        opacity: 1;
      }
    }

    &:active {
      transform: translateY(0);
      box-shadow:
        0 2px 8px -2px rgba(54, 54, 73, 0.08),
        0 4px 16px -4px rgba(51, 51, 71, 0.15),
        0 1px 3px 0 rgba(44, 44, 54, 0.06);
    }

    .mic-ui-content {
      display: flex;
      align-items: center;
      gap: 12px;
      flex: 1;

      .keyboard-icon {
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #7873f6;
      }

      .mic-text {
        font-size: 14px;
        font-weight: 500;
        color: #1a1a2e;
        font-family:
          -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB',
          'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif;
        letter-spacing: 0.01em;
      }

      .wave-indicator {
        display: flex;
        align-items: center;
        gap: 2px;
        margin-left: auto;

        .wave-bar {
          width: 3px;
          height: 12px;
          background: linear-gradient(135deg, #7873f6 0%, #615ced 100%);
          border-radius: 2px;
          animation: waveAnimation 1.5s ease-in-out infinite;

          &:nth-child(1) {
            animation-delay: 0s;
          }
          &:nth-child(2) {
            animation-delay: 0.1s;
          }
          &:nth-child(3) {
            animation-delay: 0.2s;
          }
          &:nth-child(4) {
            animation-delay: 0.3s;
          }
          &:nth-child(5) {
            animation-delay: 0.4s;
          }
          &:nth-child(6) {
            animation-delay: 0.5s;
          }
          &:nth-child(7) {
            animation-delay: 0.6s;
          }
        }
      }
    }

    .stop-button {
      width: 32px;
      height: 32px;
      background: linear-gradient(135deg, #7873f6 0%, #615ced 100%);
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow:
        0 2px 8px rgba(120, 115, 246, 0.2),
        0 1px 3px rgba(0, 0, 0, 0.1);

      .stop-icon {
        width: 12px;
        height: 12px;
        background: #fafafa;
        border-radius: 2px;
      }

      &:hover {
        transform: scale(1.05);
        box-shadow:
          0 4px 12px rgba(120, 115, 246, 0.3),
          0 2px 4px rgba(0, 0, 0, 0.1);
      }
    }

    @keyframes waveAnimation {
      0%,
      100% {
        height: 8px;
        opacity: 0.6;
      }
      50% {
        height: 16px;
        opacity: 1;
      }
    }

    @media (max-width: 1024px) and (min-width: 769px) {
      height: 40px;
      min-width: 180px;
      border-radius: 22px;
      padding: 0 14px;
      gap: 10px;

      .mic-ui-content {
        gap: 10px;

        .keyboard-icon {
          width: 18px;
          height: 18px;
        }

        .mic-text {
          font-size: 13px;
        }

        .wave-indicator .wave-bar {
          width: 2.5px;
          height: 10px;
        }
      }

      .stop-button {
        width: 28px;
        height: 28px;
        border-radius: 14px;

        .stop-icon {
          width: 10px;
          height: 10px;
        }
      }
    }

    @media (max-width: 768px) {
      height: 36px;
      min-width: 160px;
      border-radius: 20px;
      padding: 0 12px;
      gap: 8px;

      .mic-ui-content {
        gap: 8px;

        .keyboard-icon {
          width: 16px;
          height: 16px;
        }

        .mic-text {
          font-size: 12px;
        }

        .wave-indicator .wave-bar {
          width: 2px;
          height: 8px;
        }
      }

      .stop-button {
        width: 26px;
        height: 26px;
        border-radius: 13px;

        .stop-icon {
          width: 9px;
          height: 9px;
        }
      }
    }

    @media (max-width: 480px) {
      height: 32px;
      min-width: 140px;
      border-radius: 18px;
      padding: 0 10px;
      gap: 6px;

      .mic-ui-content {
        gap: 6px;

        .keyboard-icon {
          width: 14px;
          height: 14px;
        }

        .mic-text {
          font-size: 11px;
        }

        .wave-indicator .wave-bar {
          width: 1.5px;
          height: 6px;
        }
      }

      .stop-button {
        width: 24px;
        height: 24px;
        border-radius: 12px;

        .stop-icon {
          width: 8px;
          height: 8px;
        }
      }
    }

    @media (max-width: 360px) {
      height: 28px;
      min-width: 120px;
      border-radius: 16px;
      padding: 0 8px;
      gap: 4px;

      .mic-ui-content {
        gap: 4px;

        .keyboard-icon {
          width: 12px;
          height: 12px;
        }

        .mic-text {
          font-size: 10px;
        }

        .wave-indicator .wave-bar {
          width: 1px;
          height: 4px;
        }
      }

      .stop-button {
        width: 22px;
        height: 22px;
        border-radius: 11px;

        .stop-icon {
          width: 7px;
          height: 7px;
        }
      }
    }
  }

  .ai-generate-hint {
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    margin-top: 8px;
    font-size: 10px;
    font-weight: 400;
    font-family:
      -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB',
      'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif;
    color: #9ca3af;
    text-align: center;
    opacity: 0.7;
    line-height: 1.2;
    letter-spacing: 0.01em;
    white-space: nowrap;
    pointer-events: none;

    &::before {
      content: '';
      position: absolute;
      left: 50%;
      top: -4px;
      transform: translateX(-50%);
      width: 20px;
      height: 1px;
      background: linear-gradient(90deg, transparent 0%, #e5e7eb 50%, transparent 100%);
    }

    @media (max-width: 1024px) and (min-width: 769px) {
      font-size: 9px;
      margin-top: 6px;
    }

    @media (max-width: 768px) {
      font-size: 9px;
      margin-top: 6px;
    }

    @media (max-width: 480px) {
      font-size: 8px;
      margin-top: 4px;
    }

    @media (max-width: 360px) {
      font-size: 8px;
      margin-top: 4px;
    }
  }
}
</style>
