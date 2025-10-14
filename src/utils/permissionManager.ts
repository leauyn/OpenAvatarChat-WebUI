/**
 * 权限管理工具
 * 用于检测、存储和管理摄像头、麦克风权限状态
 * 实现类似移动App的权限持久化效果
 */

export interface PermissionState {
  camera: boolean
  microphone: boolean
  lastChecked: number
  userAgent: string
  domain: string
}

export interface PermissionCheckResult {
  camera: boolean
  microphone: boolean
  needsPrompt: boolean
}

const PERMISSION_STORAGE_KEY = 'openavatar_permissions'
const PERMISSION_EXPIRY_DAYS = 30 // 权限状态有效期（天）

/**
 * 权限管理器类
 */
export class PermissionManager {
  private static instance: PermissionManager
  private permissionState: PermissionState | null = null

  private constructor() {
    this.loadPermissionState()
  }

  public static getInstance(): PermissionManager {
    if (!PermissionManager.instance) {
      PermissionManager.instance = new PermissionManager()
    }
    return PermissionManager.instance
  }

  /**
   * 检查权限状态是否有效
   */
  private isPermissionStateValid(): boolean {
    if (!this.permissionState) return false

    const now = Date.now()
    const expiryTime =
      this.permissionState.lastChecked + PERMISSION_EXPIRY_DAYS * 24 * 60 * 60 * 1000

    // 检查是否过期
    if (now > expiryTime) {
      console.log('🔍 权限状态已过期，需要重新检查')
      return false
    }

    // 检查域名是否匹配
    if (this.permissionState.domain !== window.location.origin) {
      console.log('🔍 域名不匹配，需要重新检查权限')
      return false
    }

    // 检查用户代理是否发生重大变化
    if (this.permissionState.userAgent !== navigator.userAgent) {
      console.log('🔍 用户代理发生变化，需要重新检查权限')
      return false
    }

    return true
  }

  /**
   * 从localStorage加载权限状态
   */
  private loadPermissionState(): void {
    try {
      const stored = localStorage.getItem(PERMISSION_STORAGE_KEY)
      if (stored) {
        this.permissionState = JSON.parse(stored)
        console.log('📖 加载权限状态:', this.permissionState)
      }
    } catch (error) {
      console.error('❌ 加载权限状态失败:', error)
      this.permissionState = null
    }
  }

  /**
   * 保存权限状态到localStorage
   */
  private savePermissionState(camera: boolean, microphone: boolean): void {
    try {
      this.permissionState = {
        camera,
        microphone,
        lastChecked: Date.now(),
        userAgent: navigator.userAgent,
        domain: window.location.origin,
      }

      localStorage.setItem(PERMISSION_STORAGE_KEY, JSON.stringify(this.permissionState))
      console.log('💾 保存权限状态:', this.permissionState)
    } catch (error) {
      console.error('❌ 保存权限状态失败:', error)
    }
  }

  /**
   * 检查当前权限状态
   */
  public async checkCurrentPermissions(): Promise<PermissionCheckResult> {
    console.log('🔍 检查当前权限状态...')

    // 如果权限状态有效，直接返回
    if (this.isPermissionStateValid()) {
      console.log('✅ 使用缓存的权限状态')
      return {
        camera: this.permissionState!.camera,
        microphone: this.permissionState!.microphone,
        needsPrompt: false,
      }
    }

    // 需要重新检查权限
    console.log('🔄 重新检查权限状态...')

    try {
      // 检查摄像头权限
      const cameraPermission = await this.checkCameraPermission()

      // 检查麦克风权限
      const microphonePermission = await this.checkMicrophonePermission()

      // 保存权限状态
      this.savePermissionState(cameraPermission, microphonePermission)

      return {
        camera: cameraPermission,
        microphone: microphonePermission,
        needsPrompt: !cameraPermission || !microphonePermission,
      }
    } catch (error) {
      console.error('❌ 检查权限失败:', error)
      return {
        camera: false,
        microphone: false,
        needsPrompt: true,
      }
    }
  }

  /**
   * 检查摄像头权限
   */
  private async checkCameraPermission(): Promise<boolean> {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.log('❌ 浏览器不支持getUserMedia')
        return false
      }

      // 尝试获取摄像头权限
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })

      // 立即停止流，我们只是检查权限
      stream.getTracks().forEach((track) => track.stop())

      console.log('✅ 摄像头权限已授权')
      return true
    } catch (error) {
      console.log('❌ 摄像头权限被拒绝:', error)
      return false
    }
  }

  /**
   * 检查麦克风权限
   */
  private async checkMicrophonePermission(): Promise<boolean> {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.log('❌ 浏览器不支持getUserMedia')
        return false
      }

      // 尝试获取麦克风权限
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

      // 立即停止流，我们只是检查权限
      stream.getTracks().forEach((track) => track.stop())

      console.log('✅ 麦克风权限已授权')
      return true
    } catch (error) {
      console.log('❌ 麦克风权限被拒绝:', error)
      return false
    }
  }

  /**
   * 更新权限状态（当用户授权后调用）
   */
  public updatePermissionState(camera: boolean, microphone: boolean): void {
    this.savePermissionState(camera, microphone)
    console.log('🔄 更新权限状态:', { camera, microphone })
  }

  /**
   * 清除权限状态（当用户拒绝权限或需要重新授权时调用）
   */
  public clearPermissionState(): void {
    try {
      localStorage.removeItem(PERMISSION_STORAGE_KEY)
      this.permissionState = null
      console.log('🗑️ 清除权限状态')
    } catch (error) {
      console.error('❌ 清除权限状态失败:', error)
    }
  }

  /**
   * 获取当前权限状态
   */
  public getCurrentPermissionState(): PermissionState | null {
    return this.permissionState
  }

  /**
   * 检查是否需要显示权限提示
   */
  public needsPermissionPrompt(): boolean {
    if (!this.isPermissionStateValid()) {
      return true
    }

    return !this.permissionState!.camera || !this.permissionState!.microphone
  }
}

// 导出单例实例
export const permissionManager = PermissionManager.getInstance()

// 导出便捷函数
export const checkPermissions = () => permissionManager.checkCurrentPermissions()
export const updatePermissions = (camera: boolean, microphone: boolean) =>
  permissionManager.updatePermissionState(camera, microphone)
export const clearPermissions = () => permissionManager.clearPermissionState()
export const needsPermissionPrompt = () => permissionManager.needsPermissionPrompt()
