<template>
  <div class="user-info-display">
    <a-card title="用户信息" size="small" v-if="userAuthority">
      <div class="user-info-content">
        <div class="info-item">
          <span class="label">用户姓名:</span>
          <span class="value">{{ userAuthority.userName || '未知' }}</span>
        </div>
        <div class="info-item">
          <span class="label">用户ID:</span>
          <span class="value">{{ userAuthority.userId || '未知' }}</span>
        </div>
        <div class="info-item">
          <span class="label">学校名称:</span>
          <span class="value">{{ userAuthority.schoolName || '未知' }}</span>
        </div>
        <div class="info-item">
          <span class="label">学校ID:</span>
          <span class="value">{{ userAuthority.schoolId || '未知' }}</span>
        </div>
        <div class="info-item">
          <span class="label">年级:</span>
          <span class="value">{{ userAuthority.grade || '未知' }}</span>
        </div>
        <div class="info-item">
          <span class="label">班级:</span>
          <span class="value">{{ userAuthority.class || '未知' }}</span>
        </div>
        <div class="info-item">
          <span class="label">手机号:</span>
          <span class="value">{{ userAuthority.phone || '未知' }}</span>
        </div>
        <div class="info-item">
          <span class="label">地区:</span>
          <span class="value">{{ userAuthority.region || '未知' }}</span>
        </div>
      </div>
    </a-card>

    <a-alert v-else message="未获取到用户信息" type="warning" show-icon :closable="false" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useVideoChatStore } from '@/store'

const videoChatStore = useVideoChatStore()

// 获取用户权限信息
const userAuthority = computed(() => videoChatStore.userAuthority)

// 获取特定信息的方法
const getUserName = () => videoChatStore.getUserName()
const getUserId = () => videoChatStore.getUserId()
const getSchoolId = () => videoChatStore.getSchoolId()
const getSchoolName = () => videoChatStore.getSchoolName()

// 暴露方法给父组件
defineExpose({
  getUserName,
  getUserId,
  getSchoolId,
  getSchoolName,
})
</script>

<style scoped>
.user-info-display {
  margin: 16px 0;
}

.user-info-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

.info-item {
  display: flex;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.info-item:last-child {
  border-bottom: none;
}

.label {
  font-weight: 600;
  color: #666;
  min-width: 80px;
  margin-right: 8px;
}

.value {
  color: #333;
  word-break: break-all;
}

:deep(.ant-card-head-title) {
  font-size: 16px;
  font-weight: 600;
}

:deep(.ant-card-body) {
  padding: 16px;
}
</style>
