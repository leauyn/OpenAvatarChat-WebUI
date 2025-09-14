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
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  color: #26244c;
  font-size: 13px;
  font-weight: 400;
  line-height: 1.5;
  word-wrap: break-word;
  word-break: break-word;
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB',
    'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif;

  &.human {
    background: rgba(221, 221, 221, 0.8);
    margin-right: 0;
  }

  &.avatar {
    background: #7873f6;
    color: #ffffff;
  }

  // 平板设备响应式设计
  @media screen and (max-width: 1024px) and (min-width: 769px) {
    padding: 10px 14px;
    font-size: 13px;
    border-radius: 14px;
  }

  // 移动设备响应式设计
  @media screen and (max-width: 768px) {
    padding: 8px 10px;
    font-size: 13px;
    line-height: 1.4;
    border-radius: 10px;
  }

  // 小屏移动设备响应式设计
  @media screen and (max-width: 480px) {
    padding: 8px 10px;
    font-size: 12px;
    line-height: 1.4;
    border-radius: 8px;
  }

  // 超小屏设备
  @media screen and (max-width: 360px) {
    padding: 6px 8px;
    font-size: 11px;
    line-height: 1.3;
    border-radius: 6px;
  }
}
</style>
