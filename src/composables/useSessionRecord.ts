/**
 * 简单的会话记录管理 Composable
 * 只负责记录用户和数字人的文本消息到 localStorage
 */
import { ref, readonly } from 'vue'

// 配置：是否启用会话记录
const ENABLE_SESSION_RECORD = true

export interface ChatMessage {
  id: string
  role: 'human' | 'avatar'
  content: string
  timestamp: string
}

export interface SessionRecord {
  sessionId: string
  userId: string
  startTime: string
  endTime?: string
  messages: ChatMessage[]
}

export function useSessionRecord() {
  // 当前会话记录
  const currentSession = ref<SessionRecord | null>(null)

  // 是否正在记录会话
  const isRecording = ref(false)

  /**
   * 开始新的会话记录
   */
  function startSession(sessionId: string, userId: string) {
    if (!ENABLE_SESSION_RECORD) return

    if (isRecording.value) {
      console.warn('会话已在记录中，请先结束当前会话')
      return
    }

    currentSession.value = {
      sessionId,
      userId,
      startTime: new Date().toISOString(),
      messages: [],
    }

    isRecording.value = true
    console.log('🎬 开始记录会话:', sessionId)
  }

  /**
   * 结束当前会话记录
   */
  function endSession() {
    if (!ENABLE_SESSION_RECORD) return

    if (!currentSession.value || !isRecording.value) {
      console.warn('没有正在进行的会话记录')
      return
    }

    currentSession.value.endTime = new Date().toISOString()

    // 保存到本地存储
    saveSessionToLocal(currentSession.value)

    console.log('🏁 结束会话记录:', {
      sessionId: currentSession.value.sessionId,
      messageCount: currentSession.value.messages.length,
    })

    // 重置当前会话
    currentSession.value = null
    isRecording.value = false
  }

  /**
   * 添加消息到当前会话
   */
  function addMessage(role: 'human' | 'avatar', content: string) {
    if (!ENABLE_SESSION_RECORD) return

    if (!currentSession.value || !isRecording.value) {
      console.warn('没有正在进行的会话记录，无法添加消息')
      return
    }

    const chatMessage: ChatMessage = {
      id: generateMessageId(),
      role,
      content,
      timestamp: new Date().toISOString(),
    }

    currentSession.value.messages.push(chatMessage)

    console.log('📝 添加消息到会话:', {
      role: chatMessage.role,
      content: chatMessage.content.substring(0, 50) + '...',
      totalMessages: currentSession.value.messages.length,
    })
  }

  /**
   * 生成消息ID
   */
  function generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * 保存会话到本地存储
   */
  function saveSessionToLocal(session: SessionRecord) {
    try {
      const key = `session_record_${session.sessionId}`
      localStorage.setItem(key, JSON.stringify(session))
      console.log('💾 会话记录已保存到本地存储')
    } catch (error) {
      console.error('保存会话记录到本地存储失败:', error)
    }
  }

  return {
    // 状态
    currentSession: readonly(currentSession),
    isRecording: readonly(isRecording),

    // 方法
    startSession,
    endSession,
    addMessage,
  }
}
