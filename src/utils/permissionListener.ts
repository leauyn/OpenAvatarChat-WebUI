/**
 * 权限状态监听器
 * 用于监听权限变化并自动恢复权限状态
 */

import { permissionManager } from './permissionManager'

export interface PermissionChangeEvent {
  type: 'camera' | 'microphone' | 'both'
  granted: boolean
  timestamp: number
}

export type PermissionChangeCallback = (event: PermissionChangeEvent) => void

/**
 * 权限监听器类
 */
export class PermissionListener {
  private static instance: PermissionListener
  private listeners: PermissionChangeCallback[] = []
  private isListening = false
  private checkInterval: number | null = null
  private lastPermissionState: { camera: boolean; microphone: boolean } | null = null

  private constructor() {
    this.startListening()
  }

  public static getInstance(): PermissionListener {
    if (!PermissionListener.instance) {
      PermissionListener.instance = new PermissionListener()
    }
    return PermissionListener.instance
  }

  /**
   * 添加权限变化监听器
   */
  public addListener(callback: PermissionChangeCallback): void {
    this.listeners.push(callback)
    console.log('📡 添加权限监听器，当前监听器数量:', this.listeners.length)
  }

  /**
   * 移除权限变化监听器
   */
  public removeListener(callback: PermissionChangeCallback): void {
    const index = this.listeners.indexOf(callback)
    if (index > -1) {
      this.listeners.splice(index, 1)
      console.log('📡 移除权限监听器，当前监听器数量:', this.listeners.length)
    }
  }

  /**
   * 开始监听权限变化
   */
  private startListening(): void {
    if (this.isListening) return

    console.log('🔍 开始监听权限变化...')
    this.isListening = true

    // 立即检查一次权限状态
    this.checkPermissions()

    // 定期检查权限状态（每5秒检查一次）
    this.checkInterval = window.setInterval(() => {
      this.checkPermissions()
    }, 5000)

    // 监听页面可见性变化
    document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this))

    // 监听窗口焦点变化
    window.addEventListener('focus', this.handleWindowFocus.bind(this))
  }

  /**
   * 停止监听权限变化
   */
  public stopListening(): void {
    if (!this.isListening) return

    console.log('🛑 停止监听权限变化...')
    this.isListening = false

    if (this.checkInterval) {
      clearInterval(this.checkInterval)
      this.checkInterval = null
    }

    document.removeEventListener('visibilitychange', this.handleVisibilityChange.bind(this))
    window.removeEventListener('focus', this.handleWindowFocus.bind(this))
  }

  /**
   * 检查权限状态
   */
  private async checkPermissions(): Promise<void> {
    try {
      const result = await permissionManager.checkCurrentPermissions()
      const currentState = {
        camera: result.camera,
        microphone: result.microphone,
      }

      // 如果是第一次检查，只记录状态
      if (!this.lastPermissionState) {
        this.lastPermissionState = currentState
        return
      }

      // 检查权限是否发生变化
      const cameraChanged = this.lastPermissionState.camera !== currentState.camera
      const microphoneChanged = this.lastPermissionState.microphone !== currentState.microphone

      if (cameraChanged || microphoneChanged) {
        console.log('🔄 检测到权限变化:', {
          previous: this.lastPermissionState,
          current: currentState,
          cameraChanged,
          microphoneChanged,
        })

        // 触发权限变化事件
        if (cameraChanged && microphoneChanged) {
          this.notifyListeners({
            type: 'both',
            granted: currentState.camera && currentState.microphone,
            timestamp: Date.now(),
          })
        } else if (cameraChanged) {
          this.notifyListeners({
            type: 'camera',
            granted: currentState.camera,
            timestamp: Date.now(),
          })
        } else if (microphoneChanged) {
          this.notifyListeners({
            type: 'microphone',
            granted: currentState.microphone,
            timestamp: Date.now(),
          })
        }

        // 更新权限状态
        this.lastPermissionState = currentState
      }
    } catch (error) {
      console.error('❌ 检查权限状态失败:', error)
    }
  }

  /**
   * 处理页面可见性变化
   */
  private handleVisibilityChange(): void {
    if (document.visibilityState === 'visible') {
      console.log('👁️ 页面变为可见，检查权限状态...')
      // 延迟一点时间再检查，确保页面完全加载
      setTimeout(() => {
        this.checkPermissions()
      }, 1000)
    }
  }

  /**
   * 处理窗口焦点变化
   */
  private handleWindowFocus(): void {
    console.log('🎯 窗口获得焦点，检查权限状态...')
    // 延迟一点时间再检查，确保窗口完全激活
    setTimeout(() => {
      this.checkPermissions()
    }, 500)
  }

  /**
   * 通知所有监听器
   */
  private notifyListeners(event: PermissionChangeEvent): void {
    console.log('📢 通知权限变化事件:', event)
    this.listeners.forEach((callback) => {
      try {
        callback(event)
      } catch (error) {
        console.error('❌ 权限变化回调执行失败:', error)
      }
    })
  }

  /**
   * 获取当前权限状态
   */
  public getCurrentPermissionState(): { camera: boolean; microphone: boolean } | null {
    return this.lastPermissionState
  }

  /**
   * 手动触发权限检查
   */
  public async triggerPermissionCheck(): Promise<void> {
    console.log('🔄 手动触发权限检查...')
    await this.checkPermissions()
  }
}

// 导出单例实例
export const permissionListener = PermissionListener.getInstance()

// 导出便捷函数
export const addPermissionListener = (callback: PermissionChangeCallback) =>
  permissionListener.addListener(callback)
export const removePermissionListener = (callback: PermissionChangeCallback) =>
  permissionListener.removeListener(callback)
export const triggerPermissionCheck = () => permissionListener.triggerPermissionCheck()
