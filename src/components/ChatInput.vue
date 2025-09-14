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

    <div class="ai-generate-hint">内容内 AI生成</div>
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
  min-height: 80px;
  max-height: 120px;
  width: 90%;
  max-width: 400px;
  margin: 16px auto;
  padding: 0 16px;

  @media (max-width: 1024px) and (min-width: 769px) {
    min-height: 75px;
    max-height: 110px;
    width: 92%;
    max-width: 380px;
    margin: 14px auto;
    padding: 0 14px;
  }

  @media (max-width: 768px) {
    min-height: 70px;
    max-height: 100px;
    width: 95%;
    max-width: 360px;
    margin: 12px auto;
    padding: 0 12px;
  }

  @media (max-width: 480px) {
    min-height: 65px;
    max-height: 90px;
    width: 98%;
    max-width: 340px;
    margin: 10px auto;
    padding: 0 10px;
  }

  @media (max-width: 360px) {
    min-height: 60px;
    max-height: 80px;
    width: 100%;
    max-width: 320px;
    margin: 8px auto;
    padding: 0 8px;
  }

  .chat-input-inner {
    padding: 0 12px;
    background-color: #fff;
    height: 44px;
    width: 100%;
    display: flex;
    align-items: center;
    border: 1px solid #e8eaf2;
    border-radius: 22px;
    box-shadow:
      0 4px 12px -4px rgba(54, 54, 73, 0.04),
      0 4px 16px 0 rgba(51, 51, 71, 0.08),
      0 0 1px 0 rgba(44, 44, 54, 0.02);

    @media (max-width: 768px) {
      height: 40px;
      border-radius: 20px;
      padding: 0 10px;
    }

    @media (max-width: 480px) {
      height: 36px;
      border-radius: 18px;
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
        color: #26244c;
        font-size: 14px;
        font-weight: 400;
        resize: none;
        padding: 0;
        margin: 6px 0;
        line-height: 20px;
        max-height: 32px;
        min-height: 20px;

        @media (max-width: 768px) {
          font-size: 13px;
          line-height: 18px;
          margin: 4px 0;
        }

        @media (max-width: 480px) {
          font-size: 12px;
          line-height: 16px;
          margin: 3px 0;
        }
      }

      .rowsDiv {
        position: absolute;
        left: 0;
        right: 0;
        z-index: -1;
        visibility: hidden;
        font-size: 16px;
        font-weight: 400;
        line-height: 24px;
        white-space: pre-wrap;
        word-wrap: break-word;
      }
    }

    .send-btn,
    .interrupt-btn {
      border: none;
      flex: 0 0 auto;
      background: #615ced;
      border-radius: 18px;
      height: 28px;
      width: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: 8px;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        background: #524de1;
        transform: scale(1.05);
      }

      @media (max-width: 768px) {
        height: 24px;
        width: 24px;
        border-radius: 12px;
        margin-left: 6px;
      }

      @media (max-width: 480px) {
        height: 20px;
        width: 20px;
        border-radius: 10px;
        margin-left: 4px;
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
    margin-right: 8px;
    height: 28px;
    width: 28px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 14px;
    opacity: 1;
    background: linear-gradient(180deg, #7873f6 0%, #524de1 100%);
    transition: all 0.2s ease;

    &:hover {
      transform: scale(1.05);
    }

    &::after {
      content: ' ';
      width: 10px;
      height: 10px;
      border-radius: 2px;
      background: #fafafa;
    }

    @media (max-width: 768px) {
      height: 24px;
      width: 24px;
      border-radius: 12px;
      margin-right: 6px;
    }

    @media (max-width: 480px) {
      height: 20px;
      width: 20px;
      border-radius: 10px;
      margin-right: 4px;
    }
  }

  .ai-generate-hint {
    margin-top: 4px;
    font-size: 11px;
    color: #8e8ea0;
    text-align: center;
    opacity: 0.7;

    @media (max-width: 768px) {
      font-size: 10px;
      margin-top: 3px;
    }

    @media (max-width: 480px) {
      font-size: 9px;
      margin-top: 2px;
    }
  }
}
</style>
