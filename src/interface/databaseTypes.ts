/**
 * 数据库相关类型定义
 */

export interface UserResultInfo {
  id: string
  name: string
  code: string
  type: string
  resulte: string
  userId: string
  surveyId: string | null
  value: string
}

export interface DatabaseResponse<T> {
  resultCode: number
  resultMsg: string
  data: T
}

export interface GetUserResultInfoRequest {
  userId: string
}
