<template>
  <div class="local-storage-test">
    <a-card title="localStorage 测试" size="small">
      <div class="test-content">
        <a-button type="primary" @click="testLocalStorage" :loading="loading">
          测试获取 localStorage 数据
        </a-button>

        <a-divider />

        <div v-if="testResult" class="result-section">
          <h4>测试结果:</h4>
          <pre>{{ JSON.stringify(testResult, null, 2) }}</pre>
        </div>

        <div v-if="userInfo" class="user-info-section">
          <h4>用户信息:</h4>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">用户姓名:</span>
              <span class="value">{{ userInfo.userName || '未获取到' }}</span>
            </div>
            <div class="info-item">
              <span class="label">用户ID:</span>
              <span class="value">{{ userInfo.userId || '未获取到' }}</span>
            </div>
            <div class="info-item">
              <span class="label">学校ID:</span>
              <span class="value">{{ userInfo.schoolId || '未获取到' }}</span>
            </div>
            <div class="info-item">
              <span class="label">学校名称:</span>
              <span class="value">{{ userInfo.schoolName || '未获取到' }}</span>
            </div>
            <div class="info-item">
              <span class="label">年级:</span>
              <span class="value">{{ userInfo.grade || '未获取到' }}</span>
            </div>
            <div class="info-item">
              <span class="label">班级:</span>
              <span class="value">{{ userInfo.class || '未获取到' }}</span>
            </div>
            <div class="info-item">
              <span class="label">手机号:</span>
              <span class="value">{{ userInfo.phone || '未获取到' }}</span>
            </div>
            <div class="info-item">
              <span class="label">地区:</span>
              <span class="value">{{ userInfo.region || '未获取到' }}</span>
            </div>
          </div>
        </div>
      </div>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useVideoChatStore } from '@/store'
import { getUserAuthorityFromLocalStorage } from '@/utils/localStorageUtils'

const videoChatStore = useVideoChatStore()

const loading = ref(false)
const testResult = ref<any>(null)
const userInfo = ref<any>(null)

const testLocalStorage = async () => {
  loading.value = true
  console.log('🧪 开始测试 localStorage 功能...')

  try {
    // 测试工具函数
    console.log('📋 测试工具函数...')
    const authorityData = getUserAuthorityFromLocalStorage()
    testResult.value = authorityData

    // 测试 store 方法
    console.log('📋 测试 store 方法...')
    const userName = videoChatStore.getUserName()
    const userId = videoChatStore.getUserId()
    const schoolId = videoChatStore.getSchoolId()
    const schoolName = videoChatStore.getSchoolName()

    userInfo.value = {
      userName,
      userId,
      schoolId,
      schoolName,
      grade: videoChatStore.getGrade(),
      class: videoChatStore.getClass(),
      phone: videoChatStore.getPhone(),
      region: videoChatStore.getRegion(),
    }

    console.log('✅ 测试完成')
  } catch (error) {
    console.error('❌ 测试失败:', error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.local-storage-test {
  margin: 16px;
  max-width: 800px;
}

.test-content {
  padding: 16px 0;
}

.result-section {
  margin-top: 16px;
}

.result-section pre {
  background: #f5f5f5;
  padding: 12px;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 12px;
}

.user-info-section {
  margin-top: 16px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
  margin-top: 12px;
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

h4 {
  margin: 0 0 12px 0;
  color: #262626;
}
</style>
