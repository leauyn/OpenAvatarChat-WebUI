<script setup lang="ts">
import { useVideoChatStore } from '@/store'
import { useVisionStore } from '@/store/vision'
import { permissionManager } from '@/utils/permissionManager'
import { VideoCameraOutlined } from '@ant-design/icons-vue'
import { computed, onMounted, ref } from 'vue'

const emits = defineEmits(['click'])
const videoChatState = useVideoChatStore()
const visionState = useVisionStore()

// 权限状态
const permissionChecked = ref(false)
const needsPermission = ref(true)

// 计算是否应该显示权限提示
const shouldShowPermission = computed(() => {
  return permissionChecked.value && needsPermission.value
})

const accessClick = async () => {
  try {
    console.log('🔄 用户点击授权按钮，开始请求权限...')
    await videoChatState.accessDevice()

    // 权限获取成功后，更新状态
    needsPermission.value = false
    console.log('✅ 权限获取成功')
  } catch (error) {
    console.error('❌ 权限获取失败:', error)
  }
}

onMounted(async () => {
  try {
    console.log('🔍 WebcamPermission组件挂载，检查权限状态...')

    // 检查权限状态
    const result = await videoChatState.checkPermissions()

    permissionChecked.value = true
    needsPermission.value = result.needsPrompt

    console.log('📊 权限检查结果:', {
      camera: result.camera,
      microphone: result.microphone,
      needsPrompt: result.needsPrompt,
    })

    // 如果权限已授权，自动获取设备
    if (!result.needsPrompt) {
      console.log('✅ 权限已授权，自动获取设备...')
      await videoChatState.accessDevice()
    }
  } catch (error) {
    console.error('❌ 权限检查失败:', error)
    permissionChecked.value = true
    needsPermission.value = true
  }
})

const text = '点击允许访问摄像头和麦克风'
</script>

<template>
  <div v-if="shouldShowPermission" class="access-wrap" @click="accessClick">
    <span class="icon-wrap">
      <VideoCameraOutlined />
    </span>
    {{ text }}
  </div>
  <div v-else-if="!permissionChecked" class="loading-wrap">
    <span class="loading-text">正在检查权限...</span>
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

.loading-wrap {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(5px);
  color: #333;
  font-size: 16px;
  font-weight: 500;

  @media (max-width: 768px) {
    font-size: 14px;
  }

  @media (max-width: 480px) {
    font-size: 13px;
  }
}

.loading-text {
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
}
</style>
