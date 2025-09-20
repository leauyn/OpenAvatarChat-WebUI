<script setup lang="ts">
import Iconfont, { Send } from '@/components/Iconfont'
import { insertStringAt } from '@/utils/utils'
import { useTemplateRef } from 'vue'

const props = withDefaults(
  defineProps<{
    replying: boolean
  }>(),
  {}
)
const emit = defineEmits(['send', 'stop', 'interrupt'])

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
</script>

<template>
  <div class="chat-input-container">
    <div class="chat-input-main">
      <div class="stop-chat-btn" @click="onStop"></div>

      <div class="chat-input-inner">
        <div class="chat-input-wrapper">
          <textarea
            class="chat-input"
            ref="chatInputRef"
            @keydown="on_chat_input_keydown"
            @input="on_chat_input"
            :style="`height:${inputHeight}px`"
          />
          <div class="rowsDiv" ref="rowsDivRef">{{ inputValue }}</div>
        </div>
        <template v-if="replying">
          <button class="interrupt-btn" @click="onInterrupt"></button>
        </template>
        <template v-else>
          <button class="send-btn" @click="on_send">
            <Iconfont :icon="Send" :color="'#fff'"></Iconfont>
          </button>
        </template>
      </div>
    </div>

    <div class="ai-generate-hint">内容由 AI 生成</div>
  </div>
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
  max-height: 140px;
  width: 90%;
  max-width: 500px;
  margin: 16px auto;
  padding: 0 16px;

  @media (max-width: 1024px) and (min-width: 769px) {
    min-height: 95px;
    max-height: 130px;
    width: 92%;
    max-width: 480px;
    margin: 14px auto;
    padding: 0 14px;
  }

  @media (max-width: 768px) {
    min-height: 90px;
    max-height: 120px;
    width: 95%;
    max-width: 460px;
    margin: 12px auto;
    padding: 0 12px;
  }

  @media (max-width: 480px) {
    min-height: 85px;
    max-height: 110px;
    width: 98%;
    max-width: 440px;
    margin: 10px auto;
    padding: 0 10px;
  }

  @media (max-width: 360px) {
    min-height: 80px;
    max-height: 100px;
    width: 100%;
    max-width: 420px;
    margin: 8px auto;
    padding: 0 8px;
  }

  .chat-input-main {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;

    @media (max-width: 768px) {
      gap: 10px;
    }

    @media (max-width: 480px) {
      gap: 8px;
    }
  }

  .chat-input-inner {
    padding: 0 16px;
    background: linear-gradient(135deg, #ffffff 0%, #fafbff 100%);
    height: 44px;
    flex: 1;
    display: flex;
    align-items: center;
    border: 1.5px solid #e1e5f2;
    border-radius: 24px;
    box-shadow:
      0 2px 8px -2px rgba(54, 54, 73, 0.06),
      0 4px 20px -4px rgba(51, 51, 71, 0.12),
      0 1px 3px 0 rgba(44, 44, 54, 0.04),
      inset 0 1px 0 rgba(255, 255, 255, 0.8);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
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
      height: 40px;
      border-radius: 22px;
      padding: 0 14px;
    }

    @media (max-width: 768px) {
      height: 36px;
      border-radius: 20px;
      padding: 0 12px;
    }

    @media (max-width: 480px) {
      height: 32px;
      border-radius: 18px;
      padding: 0 10px;
    }

    @media (max-width: 360px) {
      height: 28px;
      border-radius: 16px;
      padding: 0 8px;
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
        margin: 6px 0;
        line-height: 1.6;
        max-height: 32px;
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
          line-height: 1.5;
          margin: 5px 0;
        }

        @media (max-width: 768px) {
          font-size: 14px;
          line-height: 1.5;
          margin: 4px 0;
        }

        @media (max-width: 480px) {
          font-size: 14px;
          line-height: 1.5;
          margin: 3px 0;
        }

        @media (max-width: 360px) {
          font-size: 13px;
          line-height: 1.4;
          margin: 3px 0;
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

    .send-btn,
    .interrupt-btn {
      border: none;
      flex: 0 0 auto;
      background: linear-gradient(135deg, #7873f6 0%, #615ced 100%);
      border-radius: 20px;
      height: 32px;
      width: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: 10px;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
      box-shadow:
        0 2px 8px rgba(120, 115, 246, 0.2),
        0 1px 3px rgba(0, 0, 0, 0.1);

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(
          135deg,
          rgba(255, 255, 255, 0.2) 0%,
          rgba(255, 255, 255, 0.1) 100%
        );
        opacity: 0;
        transition: opacity 0.3s ease;
      }

      &:hover {
        background: linear-gradient(135deg, #615ced 0%, #524de1 100%);
        transform: translateY(-2px) scale(1.05);
        box-shadow:
          0 6px 20px rgba(120, 115, 246, 0.4),
          0 3px 8px rgba(0, 0, 0, 0.15);

        &::before {
          opacity: 1;
        }
      }

      &:active {
        transform: translateY(-1px) scale(1.02);
        box-shadow:
          0 4px 12px rgba(120, 115, 246, 0.3),
          0 2px 4px rgba(0, 0, 0, 0.1);
      }

      @media (max-width: 1024px) and (min-width: 769px) {
        height: 28px;
        width: 28px;
        border-radius: 16px;
        margin-left: 8px;
      }

      @media (max-width: 768px) {
        height: 26px;
        width: 26px;
        border-radius: 14px;
        margin-left: 8px;
      }

      @media (max-width: 480px) {
        height: 24px;
        width: 24px;
        border-radius: 12px;
        margin-left: 6px;
      }

      @media (max-width: 360px) {
        height: 22px;
        width: 22px;
        border-radius: 11px;
        margin-left: 6px;
      }
    }

    .interrupt-btn {
      &::after {
        content: ' ';
        width: 12px;
        height: 12px;
        border-radius: 2px;
        background: #fafafa;
      }
    }
  }

  .stop-chat-btn {
    cursor: pointer;
    height: 44px;
    width: 44px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 24px;
    opacity: 1;
    background: linear-gradient(135deg, #7873f6 0%, #615ced 50%, #524de1 100%);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    flex-shrink: 0;
    position: relative;
    overflow: hidden;
    box-shadow:
      0 4px 16px rgba(120, 115, 246, 0.25),
      0 2px 8px rgba(0, 0, 0, 0.1);

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(
        135deg,
        rgba(255, 255, 255, 0.25) 0%,
        rgba(255, 255, 255, 0.1) 100%
      );
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    &:hover {
      transform: translateY(-2px) scale(1.05);
      box-shadow:
        0 8px 24px rgba(120, 115, 246, 0.4),
        0 4px 12px rgba(0, 0, 0, 0.15);

      &::before {
        opacity: 1;
      }
    }

    &:active {
      transform: translateY(-1px) scale(1.02);
      box-shadow:
        0 6px 16px rgba(120, 115, 246, 0.3),
        0 3px 8px rgba(0, 0, 0, 0.1);
    }

    &::after {
      content: ' ';
      width: 16px;
      height: 16px;
      border-radius: 3px;
      background: #fafafa;
    }

    @media (max-width: 1024px) and (min-width: 769px) {
      height: 40px;
      width: 40px;
      border-radius: 22px;

      &::after {
        width: 14px;
        height: 14px;
        border-radius: 3px;
      }
    }

    @media (max-width: 768px) {
      height: 36px;
      width: 36px;
      border-radius: 20px;

      &::after {
        width: 12px;
        height: 12px;
        border-radius: 2.5px;
      }
    }

    @media (max-width: 480px) {
      height: 32px;
      width: 32px;
      border-radius: 18px;

      &::after {
        width: 10px;
        height: 10px;
        border-radius: 2px;
      }
    }

    @media (max-width: 360px) {
      height: 28px;
      width: 28px;
      border-radius: 16px;

      &::after {
        width: 8px;
        height: 8px;
        border-radius: 1.5px;
      }
    }
  }

  .ai-generate-hint {
    margin-top: 8px;
    font-size: 12px;
    font-weight: 500;
    font-family:
      -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB',
      'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif;
    color: #6b7280;
    text-align: center;
    opacity: 0.8;
    line-height: 1.5;
    letter-spacing: 0.01em;
    position: relative;

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
      font-size: 11px;
      margin-top: 7px;
    }

    @media (max-width: 768px) {
      font-size: 11px;
      margin-top: 6px;
    }

    @media (max-width: 480px) {
      font-size: 10px;
      margin-top: 5px;
    }

    @media (max-width: 360px) {
      font-size: 10px;
      margin-top: 4px;
    }
  }
}
</style>
