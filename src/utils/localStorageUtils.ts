/**
 * localStorage 工具函数
 * 用于从当前窗口的 localStorage 中获取用户信息
 */

export interface UserAuthorityInfo {
  // 索引 0: 账号类型 (1: 个人账号, 2: 学校账号)
  accountType?: string
  // 索引 1: 未命名字段 (暂时忽略)
  unknown1?: string
  // 索引 2: 年级
  grade?: string
  // 索引 3: 未命名字段 (暂时忽略)
  unknown2?: string
  // 索引 4: 未命名字段 (暂时忽略)
  unknown3?: string
  // 索引 5: 用户ID
  userId?: string
  // 索引 6: 手机号
  phone?: string
  // 索引 7: 姓名
  userName?: string
  // 索引 8: 学号/身份标识
  studentId?: string
  // 索引 9: 身份证号
  idNumber?: string
  // 索引 10: 用户类型 (1: 学生, 2: 老师, 3: 大学生)
  userType?: string
  // 索引 11: 人员类型 (1: 学校人员, 2: 社会人员)
  personnelType?: string
  [key: string]: any
}

/**
 * 获取 wj_oss_authority 数组信息
 * 优先级：URL 参数 > localStorage
 * 根据图片显示，数组结构为：
 * ["1", "0e08ddd7-a140-4708-b3d8-c4c8fef145cc", "3", ...]
 */
export function getUserAuthorityFromLocalStorage(): UserAuthorityInfo | null {
  try {
    console.log('🔍 开始获取 wj_oss_authority 数据...')
    console.log('🌐 当前域名:', window.location.origin)
    console.log('🔍 是否在 iframe 中:', isInIframe())

    let authorityData: string | null = null

    // 1. 优先从 URL 参数获取数据
    console.log('🔄 优先尝试从 URL 参数获取数据...')
    authorityData = getDataFromUrlParams()
    if (authorityData) {
      console.log('✅ 从 URL 参数获取到数据:', authorityData)
    } else {
      console.log('❌ URL 参数获取失败，继续尝试其他方式...')
    }

    // 2. 如果 URL 参数没有数据，尝试从 localStorage 获取
    if (!authorityData) {
      console.log('🔄 URL 参数无数据，尝试从 localStorage 获取...')
      authorityData = localStorage.getItem('wj_oss_authority')
      if (authorityData) {
        console.log('✅ 从 localStorage 获取到数据:', authorityData)
      }
    }

    console.log('📦 最终获取到的数据:', authorityData)

    if (!authorityData) {
      console.log('❌ 未找到 wj_oss_authority 数据')
      return null
    }

    return parseAuthorityData(authorityData)
  } catch (error) {
    console.error('❌ 获取 wj_oss_authority 数据失败:', error)
    return null
  }
}

/**
 * 从 URL 参数获取数据
 */
function getDataFromUrlParams(): string | null {
  try {
    const urlParams = new URLSearchParams(window.location.search)
    const authorityData = urlParams.get('wj_oss_authority')
    if (authorityData) {
      console.log('✅ 从 URL 参数获取到数据:', authorityData)
      return decodeURIComponent(authorityData)
    }
  } catch (error) {
    console.error('❌ 从 URL 参数获取数据失败:', error)
  }
  return null
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
      // 索引 0: 账号类型 (1: 个人账号, 2: 学校账号)
      accountType: authorityArray[0] || undefined,
      // 索引 1: 未命名字段 (暂时忽略)
      unknown1: authorityArray[1] || undefined,
      // 索引 2: 年级
      grade: authorityArray[2] || undefined,
      // 索引 3: 未命名字段 (暂时忽略)
      unknown2: authorityArray[3] || undefined,
      // 索引 4: 未命名字段 (暂时忽略)
      unknown3: authorityArray[4] || undefined,
      // 索引 5: 用户ID
      userId: authorityArray[5] || undefined,
      // 索引 6: 手机号
      phone: authorityArray[6] || undefined,
      // 索引 7: 姓名
      userName: authorityArray[7] || undefined,
      // 索引 8: 学号/身份标识
      studentId: authorityArray[8] || undefined,
      // 索引 9: 身份证号
      idNumber: authorityArray[9] || undefined,
      // 索引 10: 用户类型 (1: 学生, 2: 老师, 3: 大学生)
      userType: authorityArray[10] || undefined,
      // 索引 11: 人员类型 (1: 学校人员, 2: 社会人员)
      personnelType: authorityArray[11] || undefined,
      // 保留原始数据
      rawData: authorityArray,
    }

    console.log('✅ 成功解析用户权限信息:')
    console.log('   🏷️ 账号类型 (索引0):', userInfo.accountType)
    console.log('   👤 用户姓名 (索引7):', userInfo.userName)
    console.log('   🆔 用户ID (索引5):', userInfo.userId)
    console.log('   🎓 学号/身份标识 (索引8):', userInfo.studentId)
    console.log('   📚 年级 (索引2):', userInfo.grade)
    console.log('   📱 手机号 (索引6):', userInfo.phone)
    console.log('   🆔 身份证号 (索引9):', userInfo.idNumber)
    console.log('   👥 用户类型 (索引10):', userInfo.userType)
    console.log('   🏢 人员类型 (索引11):', userInfo.personnelType)
    console.log('   📊 完整数据:', userInfo)

    return userInfo
  } catch (error) {
    console.error('❌ 解析 wj_oss_authority 数据失败:', error)
    return null
  }
}

/**
 * 获取账号类型（索引0）
 */
export function getAccountType(): string | null {
  const userInfo = getUserAuthorityFromLocalStorage()
  const accountType = userInfo?.accountType || null
  console.log('🔍 获取账号类型:', accountType)
  return accountType
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
 * 获取用户ID（索引5）
 */
export function getUserId(): string | null {
  const userInfo = getUserAuthorityFromLocalStorage()
  const userId = userInfo?.userId || null
  console.log('🔍 获取用户ID:', userId)
  return userId
}

/**
 * 获取学号/身份标识（索引8）
 */
export function getStudentId(): string | null {
  const userInfo = getUserAuthorityFromLocalStorage()
  const studentId = userInfo?.studentId || null
  console.log('🔍 获取学号/身份标识:', studentId)
  return studentId
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
 * 获取手机号（索引6）
 */
export function getPhone(): string | null {
  const userInfo = getUserAuthorityFromLocalStorage()
  const phone = userInfo?.phone || null
  console.log('🔍 获取手机号:', phone)
  return phone
}

/**
 * 获取身份证号（索引9）
 */
export function getIdNumber(): string | null {
  const userInfo = getUserAuthorityFromLocalStorage()
  const idNumber = userInfo?.idNumber || null
  console.log('🔍 获取身份证号:', idNumber)
  return idNumber
}

/**
 * 获取用户类型（索引10）
 */
export function getUserType(): string | null {
  const userInfo = getUserAuthorityFromLocalStorage()
  const userType = userInfo?.userType || null
  console.log('🔍 获取用户类型:', userType)
  return userType
}

/**
 * 获取人员类型（索引11）
 */
export function getPersonnelType(): string | null {
  const userInfo = getUserAuthorityFromLocalStorage()
  const personnelType = userInfo?.personnelType || null
  console.log('🔍 获取人员类型:', personnelType)
  return personnelType
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
