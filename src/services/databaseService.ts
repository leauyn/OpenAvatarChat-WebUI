/**
 * 数据库服务
 */

import {
  UserResultInfo,
  DatabaseResponse,
  GetUserResultInfoRequest,
} from '@/interface/databaseTypes'

const API_BASE_URL = 'https://www.zhgk-mind.com/api/dwsurvey/anon/response'

/**
 * 获取用户结果信息
 */
export async function getUserResultInfo(
  userId: string
): Promise<DatabaseResponse<UserResultInfo[]>> {
  try {
    console.log('🌐 开始请求后端接口获取用户结果信息...')
    console.log('📋 请求参数 - userId:', userId)

    const requestData: GetUserResultInfoRequest = {
      userId,
    }

    console.log('📤 发送请求到:', `${API_BASE_URL}/getUserResultInfo.do`)
    console.log('📦 请求数据:', JSON.stringify(requestData, null, 2))

    const response = await fetch(`${API_BASE_URL}/getUserResultInfo.do`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    })

    console.log('📡 响应状态:', response.status, response.statusText)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result: DatabaseResponse<UserResultInfo[]> = await response.json()

    console.log('📥 响应数据:')
    console.log('   📊 结果代码:', result.resultCode)
    console.log('   💬 结果消息:', result.resultMsg)
    console.log('   📋 数据条数:', result.data?.length || 0)

    if (result.data && result.data.length > 0) {
      console.log('   📝 详细数据:')
      result.data.forEach((item, index) => {
        console.log(`     ${index + 1}. ${item.name} (${item.code}) - ${item.resulte}`)
        console.log(`        用户ID: ${item.userId}`)
        console.log(`        值: ${item.value.substring(0, 100)}...`)
      })
    }

    return result
  } catch (error) {
    console.error('❌ 请求用户结果信息失败:', error)
    throw error
  }
}
