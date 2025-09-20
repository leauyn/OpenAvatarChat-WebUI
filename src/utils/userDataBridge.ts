/**
 * 用户数据桥接工具
 * 用于将前端获取的用户信息传递给后端
 */

import { getUserAuthorityFromUrl, UserAuthorityInfo } from './urlDataUtils'

export interface UserDataForBackend {
  userId?: string
  userName?: string
  schoolId?: string
  schoolName?: string
  userType?: string
  grade?: string
  class?: string
  phone?: string
  region?: string
}

/**
 * 获取用户数据并格式化为后端需要的格式
 */
export function getUserDataForBackend(): UserDataForBackend | null {
  try {
    console.log('🔗 开始获取用户数据用于后端...')

    const authorityInfo = getUserAuthorityFromUrl()
    if (!authorityInfo) {
      console.log('❌ 无法获取用户权限信息')
      return null
    }

    const userData: UserDataForBackend = {
      userId: authorityInfo.userId,
      userName: authorityInfo.userName,
      schoolId: authorityInfo.schoolId,
      schoolName: authorityInfo.schoolName,
      userType: authorityInfo.userType,
      grade: authorityInfo.grade,
      class: authorityInfo.class,
      phone: authorityInfo.phone,
      region: authorityInfo.region,
    }

    console.log('✅ 成功获取用户数据用于后端:', userData)
    return userData
  } catch (error) {
    console.error('❌ 获取用户数据失败:', error)
    return null
  }
}

/**
 * 将用户数据添加到URL参数中
 */
export function addUserDataToUrl(baseUrl: string): string {
  try {
    const userData = getUserDataForBackend()
    if (!userData || !userData.userId) {
      console.log('⚠️ 没有用户数据，返回原始URL')
      return baseUrl
    }

    const url = new URL(baseUrl)

    // 添加用户ID作为主要参数
    url.searchParams.set('user_id', userData.userId)

    // 添加其他用户信息
    if (userData.userName) {
      url.searchParams.set('user_name', userData.userName)
    }
    if (userData.schoolId) {
      url.searchParams.set('school_id', userData.schoolId)
    }
    if (userData.schoolName) {
      url.searchParams.set('school_name', userData.schoolName)
    }
    if (userData.grade) {
      url.searchParams.set('grade', userData.grade)
    }
    if (userData.class) {
      url.searchParams.set('class', userData.class)
    }

    console.log('✅ 成功添加用户数据到URL:', url.toString())
    return url.toString()
  } catch (error) {
    console.error('❌ 添加用户数据到URL失败:', error)
    return baseUrl
  }
}

/**
 * 从当前URL获取用户ID
 */
export function getUserIdFromUrl(): string | null {
  try {
    const urlParams = new URLSearchParams(window.location.search)
    return urlParams.get('user_id')
  } catch (error) {
    console.error('❌ 从URL获取用户ID失败:', error)
    return null
  }
}

/**
 * 从当前URL获取所有用户数据
 */
export function getUserDataFromUrl(): UserDataForBackend | null {
  try {
    const urlParams = new URLSearchParams(window.location.search)

    const userData: UserDataForBackend = {
      userId: urlParams.get('user_id') || undefined,
      userName: urlParams.get('user_name') || undefined,
      schoolId: urlParams.get('school_id') || undefined,
      schoolName: urlParams.get('school_name') || undefined,
      grade: urlParams.get('grade') || undefined,
      class: urlParams.get('class') || undefined,
    }

    // 如果没有用户ID，返回null
    if (!userData.userId) {
      return null
    }

    console.log('✅ 从URL获取用户数据:', userData)
    return userData
  } catch (error) {
    console.error('❌ 从URL获取用户数据失败:', error)
    return null
  }
}
