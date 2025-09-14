<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    message: string
    role: string
    style?: string
  }>(),
  {}
)
</script>

<template>
  <div :class="['answer-message-container', role]" :style="style">
    <div class="answer-message-text">
      {{ message }}
    </div>
  </div>
</template>

<style scoped lang="less">
.answer-message-container {
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  color: #26244c;
  font-size: 14px;
  line-height: 1.4;
  word-wrap: break-word;
  word-break: break-word;

  &.human {
    background: #dddddd99;
    // margin-left: 20px;
    margin-right: 0;
  }

  &.avatar {
    background: #9189fa;
    color: #ffffff;
    // margin-right: 20px;
  }

  // 平板设备响应式设计
  @media screen and (max-width: 1024px) and (min-width: 769px) {
    padding: 8px 14px;
    font-size: 15px;
    border-radius: 14px;
  }

  // 移动设备响应式设计
  @media screen and (max-width: 768px) {
    padding: 8px 12px;
    font-size: 16px;
    line-height: 1.5;
    border-radius: 12px;
  }

  // 小屏移动设备响应式设计
  @media screen and (max-width: 480px) {
    padding: 10px 14px;
    font-size: 16px;
    line-height: 1.6;
    border-radius: 10px;
  }

  // 超小屏设备
  @media screen and (max-width: 360px) {
    padding: 8px 12px;
    font-size: 15px;
    line-height: 1.5;
    border-radius: 8px;
  }
}
</style>
