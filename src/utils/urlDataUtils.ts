/**
 * URL 数据工具函数
 * 用于从 URL 参数中获取用户信息
 */

export interface UserAuthorityInfo {
  userId?: string
  userName?: string
  schoolId?: string
  schoolName?: string
  userType?: string
  grade?: string
  class?: string
  phone?: string
  region?: string
  [key: string]: any
}

/**
 * 从 URL 参数获取 wj_oss_authority 数据
 */
export function getUserAuthorityFromUrl(): UserAuthorityInfo | null {
  try {
    console.log('🔍 开始从 URL 参数获取 wj_oss_authority 数据...')
    console.log('🌐 当前 URL:', window.location.href)

    const urlParams = new URLSearchParams(window.location.search)
    const authorityData = urlParams.get('wj_oss_authority')

    console.log('📦 URL 参数中的 wj_oss_authority:', authorityData)

    if (!authorityData) {
      console.log('❌ URL 参数中未找到 wj_oss_authority 数据')
      return null
    }

    return parseAuthorityData(authorityData)
  } catch (error) {
    console.error('❌ 从 URL 参数获取数据失败:', error)
    return null
  }
}

/**
 * 解析 wj_oss_authority 数组数据
 */
function parseAuthorityData(authorityData: string): UserAuthorityInfo | null {
  try {
    console.log('🔄 开始解析 URL 参数中的 JSON 数据...')
    const authorityArray = JSON.parse(decodeURIComponent(authorityData))

    console.log('📋 解析后的数组:', authorityArray)
    console.log('📏 数组长度:', authorityArray.length)

    if (!Array.isArray(authorityArray)) {
      console.warn('❌ wj_oss_authority 不是数组格式')
      return null
    }

    // 根据数组结构解析数据
    const userInfo: UserAuthorityInfo = {
      // 索引 0: 用户类型
      userType: authorityArray[0] || undefined,
      // 索引 1: 用户ID
      userId: authorityArray[1] || undefined,
      // 索引 2: 年级
      grade: authorityArray[2] || undefined,
      // 索引 3: 班级
      class: authorityArray[3] || undefined,
      // 索引 4: 未知字段
      unknown1: authorityArray[4] || undefined,
      // 索引 5: 学校ID
      schoolId: authorityArray[5] || undefined,
      // 索引 6: 手机号
      phone: authorityArray[6] || undefined,
      // 索引 7: 用户姓名
      userName: authorityArray[7] || undefined,
      // 索引 8: 学校名称/类型
      schoolName: authorityArray[8] || undefined,
      // 索引 9: 未知字段
      unknown2: authorityArray[9] || undefined,
      // 索引 10: 地区
      region: authorityArray[10] || undefined,
      // 索引 11: 其他信息
      other: authorityArray[11] || undefined,
      // 保留原始数据
      rawData: authorityArray,
    }

    console.log('✅ 成功解析用户权限信息:')
    console.log('   👤 用户姓名 (索引7):', userInfo.userName)
    console.log('   🆔 用户ID (索引1):', userInfo.userId)
    console.log('   🏫 学校ID (索引5):', userInfo.schoolId)
    console.log('   🏢 学校名称 (索引8):', userInfo.schoolName)
    console.log('   📚 年级 (索引2):', userInfo.grade)
    console.log('   🎒 班级 (索引3):', userInfo.class)
    console.log('   📱 手机号 (索引6):', userInfo.phone)
    console.log('   🌍 地区 (索引10):', userInfo.region)
    console.log('   📊 完整数据:', userInfo)

    return userInfo
  } catch (error) {
    console.error('❌ 解析 wj_oss_authority 数据失败:', error)
    return null
  }
}

/**
 * 生成包含用户数据的 URL
 */
export function generateUrlWithUserData(baseUrl: string, userData: any[]): string {
  try {
    const encodedData = encodeURIComponent(JSON.stringify(userData))
    const separator = baseUrl.includes('?') ? '&' : '?'
    return `${baseUrl}${separator}wj_oss_authority=${encodedData}`
  } catch (error) {
    console.error('❌ 生成 URL 失败:', error)
    return baseUrl
  }
}
