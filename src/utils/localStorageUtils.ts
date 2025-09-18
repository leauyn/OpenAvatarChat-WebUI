/**
 * localStorage 工具函数
 * 用于从当前窗口的 localStorage 中获取用户信息
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
 * 从 localStorage 获取 wj_oss_authority 数组信息
 * 根据图片显示，数组结构为：
 * ["1", "2782e8d3-5f82-4443-9855-6f31dff9766a", "6", "3", null, ...]
 */
export function getUserAuthorityFromLocalStorage(): UserAuthorityInfo | null {
  try {
    console.log('🔍 开始从 localStorage 获取 wj_oss_authority 数据...')

    // 从当前域名的 localStorage 获取
    const authorityData = localStorage.getItem('wj_oss_authority')

    console.log('📦 原始 localStorage 数据:', authorityData)

    if (!authorityData) {
      console.log('❌ 未找到 wj_oss_authority 数据')
      return null
    }

    return parseAuthorityData(authorityData)
  } catch (error) {
    console.error('❌ 获取 localStorage 数据失败:', error)
    return null
  }
}

/**
 * 解析 wj_oss_authority 数组数据
 */
function parseAuthorityData(authorityData: string | null): UserAuthorityInfo | null {
  if (!authorityData) {
    console.log('❌ 权限数据为空')
    return null
  }

  try {
    console.log('🔄 开始解析 JSON 数据...')
    const authorityArray = JSON.parse(authorityData)

    console.log('📋 解析后的数组:', authorityArray)
    console.log('📏 数组长度:', authorityArray.length)

    if (!Array.isArray(authorityArray)) {
      console.warn('❌ wj_oss_authority 不是数组格式')
      return null
    }

    // 根据图片中的数组结构解析数据
    // ["1", "2782e8d3-5f82-4443-9855-6f31dff9766a", "6", "3", null, ...]
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
 * 获取用户姓名（索引7）
 */
export function getUserName(): string | null {
  const userInfo = getUserAuthorityFromLocalStorage()
  const userName = userInfo?.userName || null
  console.log('🔍 获取用户姓名:', userName)
  return userName
}

/**
 * 获取用户ID（索引1）
 */
export function getUserId(): string | null {
  const userInfo = getUserAuthorityFromLocalStorage()
  const userId = userInfo?.userId || null
  console.log('🔍 获取用户ID:', userId)
  return userId
}

/**
 * 获取学校ID（索引5）
 */
export function getSchoolId(): string | null {
  const userInfo = getUserAuthorityFromLocalStorage()
  const schoolId = userInfo?.schoolId || null
  console.log('🔍 获取学校ID:', schoolId)
  return schoolId
}

/**
 * 获取学校名称（索引8）
 */
export function getSchoolName(): string | null {
  const userInfo = getUserAuthorityFromLocalStorage()
  const schoolName = userInfo?.schoolName || null
  console.log('🔍 获取学校名称:', schoolName)
  return schoolName
}

/**
 * 获取年级（索引2）
 */
export function getGrade(): string | null {
  const userInfo = getUserAuthorityFromLocalStorage()
  const grade = userInfo?.grade || null
  console.log('🔍 获取年级:', grade)
  return grade
}

/**
 * 获取班级（索引3）
 */
export function getClass(): string | null {
  const userInfo = getUserAuthorityFromLocalStorage()
  const classInfo = userInfo?.class || null
  console.log('🔍 获取班级:', classInfo)
  return classInfo
}

/**
 * 获取手机号（索引6）
 */
export function getPhone(): string | null {
  const userInfo = getUserAuthorityFromLocalStorage()
  const phone = userInfo?.phone || null
  console.log('🔍 获取手机号:', phone)
  return phone
}

/**
 * 获取地区（索引10）
 */
export function getRegion(): string | null {
  const userInfo = getUserAuthorityFromLocalStorage()
  const region = userInfo?.region || null
  console.log('🔍 获取地区:', region)
  return region
}

/**
 * 检查是否在iframe中运行
 */
export function isInIframe(): boolean {
  try {
    return window.self !== window.top
  } catch (e) {
    return true
  }
}
