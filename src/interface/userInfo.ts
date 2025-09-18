/**
 * 用户信息接口定义
 */

export interface UserAuthorityInfo {
  /** 用户ID (索引1) */
  userId?: string
  /** 用户姓名 (索引7) */
  userName?: string
  /** 学校ID (索引5) */
  schoolId?: string
  /** 学校名称/类型 (索引8) */
  schoolName?: string
  /** 用户类型 (索引0) */
  userType?: string
  /** 年级 (索引2) */
  grade?: string
  /** 班级 (索引3) */
  class?: string
  /** 手机号 (索引6) */
  phone?: string
  /** 地区 (索引10) */
  region?: string
  /** 其他信息 (索引11) */
  other?: string
  /** 原始数组数据 */
  rawData?: any[]
}

export interface UserInfo {
  /** 用户权限信息 */
  authority: UserAuthorityInfo | null
  /** 是否在iframe中运行 */
  isInIframe: boolean
  /** 父窗口域名 */
  parentOrigin?: string
}

export interface LocalStorageMessage {
  type: 'request_localStorage' | 'localStorage_response' | 'user_info_updated'
  key?: string
  value?: any
  userInfo?: UserAuthorityInfo
}
