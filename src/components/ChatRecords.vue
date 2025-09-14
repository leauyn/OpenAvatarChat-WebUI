<script setup lang="ts">
import { nextTick, useTemplateRef, watch } from 'vue'
import ChatMessage from '@/components/ChatMessage.vue'

const props = defineProps<{
  chatRecords: any[]
}>()

let containerRef = useTemplateRef<HTMLElement>('containerRef')

watch(
  () => props.chatRecords,
  (val) => {
    if (props.chatRecords) {
      nextTick().then(() => {
        scrollToBottom()
      })
    }
  }
)
function scrollToBottom() {
  // console.log("🚀 ~ scrollToBottom ~ scrollToBottom:")
  if (containerRef.value) {
    containerRef.value.scrollTop = containerRef.value.scrollHeight
  }
}

defineExpose({
  scrollToBottom,
})
</script>

<template>
  <div class="chat-records" ref="containerRef">
    <div class="chat-records-inner">
      <template v-for="(item, i) in chatRecords" :key="item.id">
        <div :class="`chat-message ${item.role}`">
          <ChatMessage :message="item.message" :role="item.role"></ChatMessage>
        </div>
      </template>
    </div>
  </div>
</template>

<style lang="less">
.chat-records {
  width: 100%;
  height: 100%;
  overflow-y: auto;

  &::-webkit-scrollbar {
    display: none;
  }
}

.chat-records-inner {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: end;
  width: 100%;
  // height: 100%;
  height: auto;
  min-height: 100%;
  padding: 8px 0;

  .chat-message {
    margin-bottom: 12px;
    max-width: 80%;

    &.human {
      align-self: flex-end;
    }

    &.avatar {
      align-self: flex-start;
    }

    &:last-child {
      margin-bottom: 0;
    }
  }

  // 平板设备响应式设计
  @media screen and (max-width: 1024px) and (min-width: 769px) {
    padding: 10px 0;

    .chat-message {
      margin-bottom: 14px;
      max-width: 85%;
    }
  }

  // 移动设备响应式设计
  @media screen and (max-width: 768px) {
    padding: 8px 0;

    .chat-message {
      margin-bottom: 10px;
      max-width: 90%;
    }
  }

  // 小屏移动设备响应式设计
  @media screen and (max-width: 480px) {
    padding: 6px 0;

    .chat-message {
      margin-bottom: 8px;
      max-width: 95%;
    }
  }

  // 超小屏设备
  @media screen and (max-width: 360px) {
    padding: 4px 0;

    .chat-message {
      margin-bottom: 6px;
      max-width: 98%;
    }
  }
}
</style>
