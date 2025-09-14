<script setup lang="ts">
import { useVideoChatStore } from '@/store'
import { useVisionStore } from '@/store/vision'
import { VideoCameraOutlined } from '@ant-design/icons-vue'
import { onMounted } from 'vue'

const emits = defineEmits(['click'])
const videoChatState = useVideoChatStore()
const visionState = useVisionStore()
const accessClick = async () => {
  videoChatState.accessDevice()
}
onMounted(() => {
  // accessClick(); //自动获取权限
})

const text = '点击允许访问摄像头和麦克风'
</script>

<template>
  <div class="access-wrap" @click="accessClick">
    <span class="icon-wrap">
      <VideoCameraOutlined />
    </span>
    {{ text }}
  </div>
</template>
<style lang="less" scoped>
.access-wrap {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(5px);
  color: #333;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.2);
    transform: scale(1.02);
  }

  @media (max-width: 768px) {
    font-size: 14px;
  }

  @media (max-width: 480px) {
    font-size: 13px;
  }
}

.icon-wrap {
  width: 30px;
  font-size: 40px;
  margin-bottom: 16px;
  color: #7873f6;

  @media (max-width: 768px) {
    font-size: 36px;
    margin-bottom: 14px;
  }

  @media (max-width: 480px) {
    font-size: 32px;
    margin-bottom: 12px;
  }
}
</style>
