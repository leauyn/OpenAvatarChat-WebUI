/**
 * 用户信息接口定义
 */

export interface UserAuthorityInfo {
  /** 账号类型 (索引0) - 1: 个人账号, 2: 学校账号 */
  accountType?: string
  /** 未命名字段 (索引1) - 暂时忽略 */
  unknown1?: string
  /** 年级 (索引2) */
  grade?: string
  /** 未命名字段 (索引3) - 暂时忽略 */
  unknown2?: string
  /** 未命名字段 (索引4) - 暂时忽略 */
  unknown3?: string
  /** 用户ID (索引5) */
  userId?: string
  /** 手机号 (索引6) */
  phone?: string
  /** 姓名 (索引7) */
  userName?: string
  /** 学号/身份标识 (索引8) */
  studentId?: string
  /** 身份证号 (索引9) */
  idNumber?: string
  /** 用户类型 (索引10) - 1: 学生, 2: 老师, 3: 大学生 */
  userType?: string
  /** 人员类型 (索引11) - 1: 学校人员, 2: 社会人员 */
  personnelType?: string
  /** 原始数组数据 */
  rawData?: any[]
  /** 允许其他未知属性 */
  [key: string]: any
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
