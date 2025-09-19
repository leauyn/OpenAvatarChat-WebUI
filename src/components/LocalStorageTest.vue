<template>
  <div class="local-storage-test">
    <a-card title="localStorage 测试" size="small">
      <div class="test-content">
        <a-button type="primary" @click="testLocalStorage" :loading="loading">
          测试获取 localStorage 数据
        </a-button>

        <a-button
          type="default"
          @click="testDatabase"
          :loading="databaseLoading"
          style="margin-left: 8px"
        >
          测试数据库查询
        </a-button>

        <a-button type="dashed" @click="clearData" style="margin-left: 8px">清除数据</a-button>

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

        <div v-if="databaseResult" class="database-section">
          <h4>数据库查询结果:</h4>
          <div class="database-info">
            <div class="info-item">
              <span class="label">查询状态:</span>
              <span
                class="value"
                :class="{
                  success: databaseResult.resultCode === 200,
                  error: databaseResult.resultCode !== 200,
                }"
              >
                {{ databaseResult.resultCode === 200 ? '成功' : '失败' }}
              </span>
            </div>
            <div class="info-item">
              <span class="label">记录数量:</span>
              <span class="value">{{ databaseResult.data?.length || 0 }}</span>
            </div>
            <div v-if="databaseResult.resultCode !== 200" class="info-item">
              <span class="label">错误信息:</span>
              <span class="value error">{{ databaseResult.resultMsg }}</span>
            </div>
          </div>

          <div v-if="databaseResult.data && databaseResult.data.length > 0" class="database-table">
            <h5>详细数据:</h5>
            <a-table
              :dataSource="databaseResult.data"
              :columns="databaseColumns"
              :pagination="{ pageSize: 5 }"
              size="small"
            >
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'value'">
                  <a-tooltip :title="record.value" placement="topLeft">
                    <span class="value-cell">{{ record.value }}</span>
                  </a-tooltip>
                </template>
              </template>
            </a-table>
          </div>
        </div>
      </div>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useVideoChatStore } from '@/store'
import { getUserAuthorityFromLocalStorage } from '@/utils/localStorageUtils'
import { UserResultInfo, DatabaseResponse } from '@/interface/databaseTypes'

const videoChatStore = useVideoChatStore()

const loading = ref(false)
const databaseLoading = ref(false)
const testResult = ref<any>(null)
const userInfo = ref<any>(null)
const databaseResult = ref<DatabaseResponse<UserResultInfo[]> | null>(null)

// 数据库表格列定义
const databaseColumns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: 60,
  },
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
    width: 120,
  },
  {
    title: '代码',
    dataIndex: 'code',
    key: 'code',
    width: 60,
  },
  {
    title: '类型',
    dataIndex: 'type',
    key: 'type',
    width: 60,
  },
  {
    title: '结果',
    dataIndex: 'resulte',
    key: 'resulte',
    width: 80,
  },
  {
    title: '用户ID',
    dataIndex: 'userId',
    key: 'userId',
    width: 200,
  },
  {
    title: '值',
    dataIndex: 'value',
    key: 'value',
    ellipsis: true,
  },
]

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

const testDatabase = async () => {
  databaseLoading.value = true
  console.log('🧪 开始测试数据库查询功能...')

  try {
    // 使用 store 中的方法查询数据库
    await videoChatStore.fetchCurrentUserResultInfo()

    // 获取查询结果
    databaseResult.value = {
      resultCode: videoChatStore.userResultInfoError ? 500 : 200,
      resultMsg: videoChatStore.userResultInfoError ? '查询失败' : '执行成功',
      data: videoChatStore.userResultInfo,
    }

    console.log('✅ 数据库测试完成')
  } catch (error) {
    console.error('❌ 数据库测试失败:', error)
    databaseResult.value = {
      resultCode: 500,
      resultMsg: error instanceof Error ? error.message : '未知错误',
      data: [],
    }
  } finally {
    databaseLoading.value = false
  }
}

const clearData = () => {
  console.log('🗑️ 清除所有测试数据')
  testResult.value = null
  userInfo.value = null
  databaseResult.value = null
  videoChatStore.clearUserResultInfo()
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

h5 {
  margin: 16px 0 8px 0;
  color: #262626;
  font-size: 14px;
}

.database-section {
  margin-top: 16px;
}

.database-info {
  margin-bottom: 16px;
}

.database-table {
  margin-top: 16px;
}

.value-cell {
  display: inline-block;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.success {
  color: #52c41a;
  font-weight: 600;
}

.error {
  color: #ff4d4f;
  font-weight: 600;
}
</style>
