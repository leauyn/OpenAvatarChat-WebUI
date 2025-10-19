import { WS } from '@/helpers/ws'
import { WsEventTypes } from '@/interface/eventType'
import { StreamState } from '@/interface/voiceChat'
import { UserAuthorityInfo } from '@/interface/userInfo'
import { GaussianAvatar } from '@/utils/gaussianAvatar'
import {
  createSimulatedAudioTrack,
  createSimulatedVideoTrack,
  getDevices,
  getStream,
  setAvailableDevices,
} from '@/utils/streamUtils'
import { setupWebRTC, stop } from '@/utils/webrtcUtils'
import { getUserAuthorityFromLocalStorage, isInIframe } from '@/utils/localStorageUtils'
import { getUserResultInfo } from '@/services/databaseService'
import { UserResultInfo, DatabaseResponse } from '@/interface/databaseTypes'
import { permissionManager } from '@/utils/permissionManager'
import { permissionListener, PermissionChangeEvent } from '@/utils/permissionListener'
import { message } from 'ant-design-vue'
import { defineStore } from 'pinia'
import { useVisionStore } from './vision'
import { useSessionRecord } from '@/composables/useSessionRecord'

const track_constraints = {
  video: {
    width: { ideal: 500, min: 320 },
    height: { ideal: 500, min: 320 },
    aspectRatio: { ideal: 1.0, exact: 1.0 }, // 强制1:1宽高比，使用exact确保严格匹配
  },
  audio: true,
}

interface VideoChatState {
  devices: MediaDeviceInfo[]
  availableVideoDevices: MediaDeviceInfo[]
  availableAudioDevices: MediaDeviceInfo[]
  selectedVideoDevice: MediaDeviceInfo | null
  selectedAudioDevice: MediaDeviceInfo | null
  streamState: StreamState
  stream: MediaStream | null
  peerConnection: RTCPeerConnection | null
  localStream: MediaStream | null
  webcamAccessed: boolean
  showDigitalHumanIntro: boolean
  webRTCId: string

  avatarType: '' | 'lam'
  avatarWSRoute: string
  avatarAssetsPath: string
  rtcConfig: RTCConfiguration | undefined
  trackConstraints:
    | {
        video: MediaTrackConstraints | boolean
        audio: MediaTrackConstraints | boolean
      }
    | undefined
  gsLoadPercent: number

  // 用户信息相关
  userAuthority: UserAuthorityInfo | null
  isInIframe: boolean
  parentOrigin: string | null

  // 用户数据库记录
  userResultInfo: UserResultInfo[]
  userResultInfoLoading: boolean
  userResultInfoError: string | null

  volumeMuted: boolean
  micMuted: boolean
  cameraOff: boolean

  hasCamera: boolean
  hasCameraPermission: boolean
  hasMic: boolean
  hasMicPermission: boolean
  showChatRecords: boolean

  localAvatarRenderer: any

  chatDataChannel: RTCDataChannel | null
  replying: boolean
  chatRecords: Array<{ id: string; role: 'human' | 'avatar'; message: string }>

  // 会话记录相关
  sessionRecordManager: ReturnType<typeof useSessionRecord> | null
}

export const useVideoChatStore = defineStore('videoChatStore', {
  state: (): VideoChatState => {
    return {
      devices: [],
      availableVideoDevices: [],
      availableAudioDevices: [],
      selectedVideoDevice: null,
      selectedAudioDevice: null,
      streamState: StreamState.closed,
      stream: null,
      peerConnection: null,
      localStream: null,
      webRTCId: '',
      webcamAccessed: false,
      showDigitalHumanIntro: true, // 控制数字人介绍组件显示
      avatarType: '',
      avatarWSRoute: '',
      avatarAssetsPath: '',
      rtcConfig: undefined,
      trackConstraints: track_constraints,
      gsLoadPercent: 0,

      // 用户信息相关
      userAuthority: null,
      isInIframe: false,
      parentOrigin: null,

      // 用户数据库记录
      userResultInfo: [],
      userResultInfoLoading: false,
      userResultInfoError: null,

      volumeMuted: false,
      micMuted: false,
      cameraOff: false,
      hasCamera: false,
      hasCameraPermission: true,
      hasMic: false,
      hasMicPermission: true,
      showChatRecords: false,

      localAvatarRenderer: null,

      chatDataChannel: null,
      replying: false,
      chatRecords: [],

      // 会话记录相关
      sessionRecordManager: null,
    }
  },
  getters: {},
  actions: {
    /**
     * 检查权限状态（新增方法）
     */
    async checkPermissions() {
      try {
        console.log('🔍 开始检查权限状态...')
        const result = await permissionManager.checkCurrentPermissions()

        this.hasCameraPermission = result.camera
        this.hasMicPermission = result.microphone

        console.log('✅ 权限检查完成:', {
          camera: result.camera,
          microphone: result.microphone,
          needsPrompt: result.needsPrompt,
        })

        return result
      } catch (error) {
        console.error('❌ 权限检查失败:', error)
        this.hasCameraPermission = false
        this.hasMicPermission = false
        return {
          camera: false,
          microphone: false,
          needsPrompt: true,
        }
      }
    },

    async accessDevice() {
      try {
        const visionState = useVisionStore()
        const node = visionState.localVideoRef
        this.micMuted = false
        this.cameraOff = false
        this.volumeMuted = false

        if (!navigator.mediaDevices) {
          message.error('无法获取媒体设备，请确保用localhost访问或https协议访问')
          return
        }

        // 先检查权限状态
        const permissionResult = await this.checkPermissions()

        // 如果权限已授权，直接获取设备
        if (permissionResult.camera && permissionResult.microphone) {
          console.log('✅ 权限已授权，直接获取设备')
          await this.getDevicesAndStream()
          this.webcamAccessed = true
          return
        }

        // 如果权限未授权，尝试请求权限
        console.log('🔄 权限未授权，尝试请求权限...')

        let cameraPermission = false
        let microphonePermission = false

        try {
          await navigator.mediaDevices.getUserMedia({ audio: true })
          microphonePermission = true
          console.log('✅ 麦克风权限获取成功')
        } catch (error) {
          console.log('❌ 麦克风权限被拒绝:', error)
          this.hasMicPermission = false
        }

        try {
          await navigator.mediaDevices.getUserMedia({ video: true })
          cameraPermission = true
          console.log('✅ 摄像头权限获取成功')
        } catch (error) {
          console.log('❌ 摄像头权限被拒绝:', error)
          this.hasCameraPermission = false
        }

        // 更新权限状态
        permissionManager.updatePermissionState(cameraPermission, microphonePermission)
        this.hasCameraPermission = cameraPermission
        this.hasMicPermission = microphonePermission

        // 获取设备并创建流
        await this.getDevicesAndStream()
        this.webcamAccessed = true
      } catch (err: any) {
        console.log(err)
        message.error(err)
      }
    },

    /**
     * 获取设备并创建流（提取的公共方法）
     */
    async getDevicesAndStream() {
      const devices = await getDevices()
      this.devices = devices
      console.log('🚀 ~ access_webcam ~ devices:', devices)

      const videoDeviceId =
        this.selectedVideoDevice &&
        devices.some((device) => device.deviceId === this.selectedVideoDevice?.deviceId)
          ? this.selectedVideoDevice.deviceId
          : ''
      const audioDeviceId =
        this.selectedAudioDevice &&
        devices.some((device) => device.deviceId === this.selectedAudioDevice?.deviceId)
          ? this.selectedAudioDevice.deviceId
          : ''
      console.log(videoDeviceId, audioDeviceId, ' access web device')
      this.fillStream(audioDeviceId, videoDeviceId)
    },
    async init() {
      // 初始化用户信息
      await this.initializeUserInfo()

      // 检查权限状态（新增）
      await this.checkPermissions()

      // 设置权限变化监听器（新增）
      this.setupPermissionListener()

      fetch('/openavatarchat/initconfig')
        .then((res) => res.json())
        .then((config) => {
          if (config.rtc_configuration) {
            this.rtcConfig = config.rtc_configuration
          }

          console.log(config)
          if (config.avatar_config) {
            this.avatarType = config.avatar_config.avatar_type
            this.avatarWSRoute = config.avatar_config.avatar_ws_route
            this.avatarAssetsPath = config.avatar_config.avatar_assets_path
          }
          if (config.track_constraints) {
            this.trackConstraints = config.track_constraints
          }
        })
        .catch(() => {
          message.error('服务端链接失败，请检查是否能正确访问到 OpenAvatarChat 服务端')
        })
    },

    /**
     * 设置权限变化监听器（新增方法）
     */
    setupPermissionListener() {
      console.log('🔧 设置权限变化监听器...')

      const handlePermissionChange = (event: PermissionChangeEvent) => {
        console.log('📡 收到权限变化事件:', event)

        // 更新权限状态
        if (event.type === 'camera' || event.type === 'both') {
          this.hasCameraPermission = event.granted
        }
        if (event.type === 'microphone' || event.type === 'both') {
          this.hasMicPermission = event.granted
        }

        // 如果权限被拒绝，清除权限状态
        if (!event.granted) {
          console.log('⚠️ 权限被拒绝，清除权限状态')
          permissionManager.clearPermissionState()
        }

        // 如果权限被重新授予，尝试自动获取设备
        if (event.granted && this.webcamAccessed) {
          console.log('✅ 权限重新授予，尝试自动获取设备...')
          this.getDevicesAndStream().catch((error) => {
            console.error('❌ 自动获取设备失败:', error)
          })
        }
      }

      // 添加监听器
      permissionListener.addListener(handlePermissionChange)

      console.log('✅ 权限变化监听器设置完成')
    },

    /**
     * 初始化用户信息
     * 从 localStorage 获取 wj_oss_authority 数组中的用户信息
     */
    async initializeUserInfo() {
      try {
        console.log('🚀 开始初始化用户信息...')

        // 检查是否在 iframe 中运行
        this.isInIframe = isInIframe()
        console.log('🔍 是否在 iframe 中运行:', this.isInIframe)

        // 直接从当前窗口的 localStorage 获取
        await this.loadUserAuthorityFromLocalStorage()
      } catch (error) {
        console.error('❌ 初始化用户信息失败:', error)
      }
    },

    /**
     * 从当前窗口的 localStorage 加载用户权限信息
     */
    async loadUserAuthorityFromLocalStorage() {
      console.log('📖 从 localStorage 加载用户权限信息...')

      const userAuthority = getUserAuthorityFromLocalStorage()
      this.userAuthority = userAuthority

      if (userAuthority) {
        console.log('✅ Store: 成功获取用户权限信息')
        console.log('   🏷️ 账号类型 (索引0):', userAuthority.accountType)
        console.log('   👤 用户姓名 (索引7):', userAuthority.userName)
        console.log('   🆔 用户ID (索引5):', userAuthority.userId)
        console.log('   🎓 学号/身份标识 (索引8):', userAuthority.studentId)
        console.log('   📚 年级 (索引2):', userAuthority.grade)
        console.log('   📱 手机号 (索引6):', userAuthority.phone)
        console.log('   🆔 身份证号 (索引9):', userAuthority.idNumber)
        console.log('   👥 用户类型 (索引10):', userAuthority.userType)
        console.log('   🏢 人员类型 (索引11):', userAuthority.personnelType)

        // 如果有用户ID，自动查询数据库
        if (userAuthority.userId) {
          console.log('🔄 检测到用户ID，开始查询数据库...')
          await this.fetchUserResultInfo(userAuthority.userId)
        }
      } else {
        console.log('❌ Store: 未找到用户权限信息')
      }
    },

    /**
     * 获取用户姓名
     */
    getUserName(): string | null {
      const userName = this.userAuthority?.userName || null
      console.log('🔍 Store: 获取用户姓名:', userName)
      return userName
    },

    /**
     * 获取用户ID
     */
    getUserId(): string | null {
      const userId = this.userAuthority?.userId || null
      console.log('🔍 Store: 获取用户ID:', userId)
      return userId
    },

    /**
     * 获取学号/身份标识
     */
    getStudentId(): string | null {
      const studentId = this.userAuthority?.studentId || null
      console.log('🔍 Store: 获取学号/身份标识:', studentId)
      return studentId
    },

    /**
     * 获取身份证号
     */
    getIdNumber(): string | null {
      const idNumber = this.userAuthority?.idNumber || null
      console.log('🔍 Store: 获取身份证号:', idNumber)
      return idNumber
    },

    /**
     * 获取用户类型
     */
    getUserType(): string | null {
      const userType = this.userAuthority?.userType || null
      console.log('🔍 Store: 获取用户类型:', userType)
      return userType
    },

    /**
     * 获取人员类型
     */
    getPersonnelType(): string | null {
      const personnelType = this.userAuthority?.personnelType || null
      console.log('🔍 Store: 获取人员类型:', personnelType)
      return personnelType
    },

    /**
     * 获取账号类型
     */
    getAccountType(): string | null {
      const accountType = this.userAuthority?.accountType || null
      console.log('🔍 Store: 获取账号类型:', accountType)
      return accountType
    },

    /**
     * 获取年级
     */
    getGrade(): string | null {
      const grade = this.userAuthority?.grade || null
      console.log('🔍 Store: 获取年级:', grade)
      return grade
    },

    /**
     * 获取手机号
     */
    getPhone(): string | null {
      const phone = this.userAuthority?.phone || null
      console.log('🔍 Store: 获取手机号:', phone)
      return phone
    },

    /**
     * 根据用户ID查询用户结果信息
     */
    async fetchUserResultInfo(userId?: string): Promise<void> {
      try {
        console.log('🚀 开始查询用户结果信息...')

        // 如果没有提供userId，尝试从userAuthority获取
        const targetUserId = userId || this.userAuthority?.userId

        if (!targetUserId) {
          console.error('❌ 未提供用户ID，无法查询数据库')
          this.userResultInfoError = '未提供用户ID'
          return
        }

        console.log('📋 查询用户ID:', targetUserId)

        // 设置加载状态
        this.userResultInfoLoading = true
        this.userResultInfoError = null

        // 调用数据库服务
        const response = await getUserResultInfo(targetUserId)

        if (response.resultCode === 200) {
          this.userResultInfo = response.data
          console.log('✅ Store: 成功获取用户结果信息')
          console.log('   📊 记录数量:', response.data.length)
          console.log('   📋 数据:', response.data)
        } else {
          this.userResultInfoError = response.resultMsg || '查询失败'
          console.error('❌ Store: 查询用户结果信息失败:', response.resultMsg)
        }
      } catch (error) {
        console.error('❌ Store: 查询用户结果信息异常:', error)
        this.userResultInfoError = error instanceof Error ? error.message : '未知错误'
      } finally {
        this.userResultInfoLoading = false
      }
    },

    /**
     * 自动查询当前用户的数据库记录
     */
    async fetchCurrentUserResultInfo(): Promise<void> {
      console.log('🔄 自动查询当前用户的数据库记录...')
      await this.fetchUserResultInfo()
    },

    /**
     * 清除用户结果信息
     */
    clearUserResultInfo(): void {
      console.log('🗑️ 清除用户结果信息')
      this.userResultInfo = []
      this.userResultInfoError = null
    },

    /**
     * 获取用户结果信息（按名称分组）
     */
    getUserResultInfoByName(): Record<string, UserResultInfo[]> {
      const grouped: Record<string, UserResultInfo[]> = {}

      this.userResultInfo.forEach((record) => {
        if (!grouped[record.name]) {
          grouped[record.name] = []
        }
        grouped[record.name].push(record)
      })

      console.log('📊 按名称分组的用户结果信息:', grouped)
      return grouped
    },

    /**
     * 获取特定名称的结果信息
     */
    getUserResultInfoBySpecificName(name: string): UserResultInfo[] {
      const filtered = this.userResultInfo.filter((record) => record.name === name)
      console.log(`🔍 获取名称 "${name}" 的结果信息:`, filtered)
      return filtered
    },
    handleCameraOff() {
      this.cameraOff = !this.cameraOff
      this.stream?.getTracks().forEach((track) => {
        if (track.kind.includes('video')) track.enabled = !this.cameraOff
      })
    },
    handleMicMuted() {
      this.micMuted = !this.micMuted
      this.stream?.getTracks().forEach((track) => {
        if (track.kind.includes('audio')) track.enabled = !this.micMuted
      })
    },
    handleVolumeMute() {
      this.volumeMuted = !this.volumeMuted
      if (this.avatarType === 'lam') {
        this.localAvatarRenderer?.setAvatarMute(this.volumeMuted)
      }
    },
    async handleDeviceChange(deviceId: string) {
      const device_id = deviceId
      const devices = await getDevices()
      this.devices = devices
      console.log('🚀 ~ handle_device_change ~ devices:', devices)
      let videoDeviceId =
        this.selectedVideoDevice &&
        devices.some((device) => device.deviceId === this.selectedVideoDevice?.deviceId)
          ? this.selectedVideoDevice.deviceId
          : ''
      let audioDeviceId =
        this.selectedAudioDevice &&
        devices.some((device) => device.deviceId === this.selectedAudioDevice?.deviceId)
          ? this.selectedAudioDevice.deviceId
          : ''
      if (this.availableVideoDevices.find((video_device) => video_device.deviceId === device_id)) {
        videoDeviceId = device_id
        this.cameraOff = false
      } else if (
        this.availableAudioDevices.find((audio_device) => audio_device.deviceId === device_id)
      ) {
        audioDeviceId = device_id
        this.micMuted = false
      }
      this.fillStream(audioDeviceId, videoDeviceId)
    },
    handleSubtitleToggle() {
      this.showChatRecords = !this.showChatRecords
      const visionState = useVisionStore()
      const { wrapperRef, wrapperRect } = visionState
      console.log(wrapperRect, wrapperRef)
      if (!wrapperRef || !wrapperRect) return
      wrapperRef.getBoundingClientRect()
      wrapperRect.width = wrapperRef!.clientWidth
      wrapperRect.height = wrapperRef!.clientHeight
      visionState.isLandscape = wrapperRect.width > wrapperRect.height
    },
    async ensureSquareVideo() {
      // 检查视频轨道是否应用了正确的约束
      if (this.stream) {
        const videoTrack = this.stream.getVideoTracks()[0]
        if (videoTrack) {
          const settings = videoTrack.getSettings()
          console.log('Video settings:', settings)

          // 如果宽高比不是1:1，尝试重新应用约束
          if (settings.width && settings.height && settings.width !== settings.height) {
            console.log('Video aspect ratio is not 1:1, attempting to fix...')

            // 停止当前轨道
            videoTrack.stop()

            // 重新获取视频流，使用更严格的约束
            const strictConstraints = {
              video: {
                width: { exact: 500 },
                height: { exact: 500 },
                aspectRatio: { exact: 1.0 },
                deviceId: settings.deviceId ? { exact: settings.deviceId } : undefined,
              },
              audio: false,
            }

            try {
              const newStream = await navigator.mediaDevices.getUserMedia(strictConstraints)
              const newVideoTrack = newStream.getVideoTracks()[0]

              // 替换视频轨道
              this.stream.removeTrack(videoTrack)
              this.stream.addTrack(newVideoTrack)

              console.log('Video aspect ratio fixed to 1:1')
            } catch (error) {
              console.warn('Failed to fix video aspect ratio:', error)
            }
          }
        }
      }
    },
    async updateAvailableDevices() {
      const devices = await getDevices()
      this.availableVideoDevices = setAvailableDevices(devices, 'videoinput')
      this.availableAudioDevices = setAvailableDevices(devices, 'audioinput')
    },
    async fillStream(audioDeviceId: string, videoDeviceId: string) {
      const { devices } = this
      const visionState = useVisionStore()
      const node = visionState.localVideoRef
      this.hasMic =
        devices.some((device) => {
          return device.kind === 'audioinput' && device.deviceId
        }) && this.hasMicPermission
      this.hasCamera =
        devices.some((device) => device.kind === 'videoinput' && device.deviceId) &&
        this.hasCameraPermission
      // 确保至少请求 audio 或 video 中的一个
      const audioRequest =
        audioDeviceId && audioDeviceId !== 'default'
          ? { deviceId: { exact: audioDeviceId } }
          : this.hasMic || true // 默认请求音频
      const videoRequest =
        videoDeviceId && videoDeviceId !== 'default'
          ? { deviceId: { exact: videoDeviceId } }
          : this.hasCamera || false // 默认不请求视频

      await getStream(audioRequest, videoRequest, this.trackConstraints)
        .then(async (local_stream) => {
          console.log('local_stream', local_stream)
          this.stream = local_stream
          this.updateAvailableDevices()

          // 手机端额外检查：如果宽高比不正确，尝试重新应用约束
          this.ensureSquareVideo()
        })
        .then(() => {
          const used_devices = this.stream!.getTracks().map(
            (track) => track.getSettings()?.deviceId
          )
          used_devices.forEach((device_id) => {
            const used_device = devices.find((device) => device.deviceId === device_id)
            if (used_device && used_device?.kind.includes('video')) {
              this.selectedVideoDevice = used_device
            } else if (used_device && used_device?.kind.includes('audio')) {
              this.selectedAudioDevice = used_device
            }
          })
          !this.selectedVideoDevice && (this.selectedVideoDevice = this.availableVideoDevices[0])
        })
        .catch((e) => {
          console.error('image.no_webcam_support', e)
        })
        .finally(() => {
          console.log(this.stream)
          if (!this.stream) {
            this.stream = new MediaStream()
          }
          console.log(this.stream.getTracks())

          if (!this.stream.getTracks().find((item) => item.kind === 'audio')) {
            this.stream.addTrack(createSimulatedAudioTrack())
          }
          if (!this.stream.getTracks().find((item) => item.kind === 'video')) {
            this.stream.addTrack(createSimulatedVideoTrack())
          }
          console.log(this.hasCamera, this.hasMic)
          this.webcamAccessed = true
          this.localStream = this.stream
          // 只有在连接成功后（streamState === 'open'）才显示视频
          if (node && this.streamState === 'open') {
            node.srcObject = this.localStream
            node.muted = true
            node?.play()
          }
        })
    },
    async startWebRTC() {
      const visionState = useVisionStore()
      if (this.streamState === 'closed') {
        this.chatRecords = []

        // 初始化会话记录管理器
        if (!this.sessionRecordManager) {
          this.sessionRecordManager = useSessionRecord()
        }

        // 重新创建视频流以确保应用最新的约束
        const videoDeviceId = this.selectedVideoDevice?.deviceId || ''
        const audioDeviceId = this.selectedAudioDevice?.deviceId || ''
        await this.fillStream(audioDeviceId, videoDeviceId)

        // 手机端额外确保视频是正方形
        setTimeout(() => {
          this.ensureSquareVideo()
        }, 1000) // 延迟1秒确保视频流完全初始化

        this.peerConnection = new RTCPeerConnection(this.rtcConfig)
        this.peerConnection.addEventListener('connectionstatechange', async (event) => {
          switch (this.peerConnection!.connectionState) {
            case 'connected':
              this.streamState = StreamState.open
              // 连接成功后显示视频
              if (visionState.localVideoRef && this.localStream) {
                visionState.localVideoRef.srcObject = this.localStream
                visionState.localVideoRef.muted = true
                visionState.localVideoRef?.play()
              }
              break
            case 'disconnected':
              this.streamState = StreamState.closed
              stop(this.peerConnection!)
              // await access_webcam() //TODO 重置状态
              break
            default:
              break
          }
        })
        this.streamState = StreamState.waiting
        // 获取用户ID
        const userId = this.getUserId()
        console.log('🚀 启动WebRTC连接，用户ID:', userId)

        await setupWebRTC(this.stream!, this.peerConnection!, visionState.remoteVideoRef!, userId)
          .then(([dataChannel, webRTCId]) => {
            this.streamState = StreamState.open
            this.webRTCId = webRTCId as string
            this.chatDataChannel = dataChannel as any

            // 开始会话记录
            if (this.sessionRecordManager) {
              this.sessionRecordManager.startSession(webRTCId, userId)
            }

            // 连接成功后显示视频
            if (visionState.localVideoRef && this.localStream) {
              visionState.localVideoRef.srcObject = this.localStream
              visionState.localVideoRef.muted = true
              visionState.localVideoRef?.play()
            }

            if (this.avatarType && this.avatarWSRoute) {
              const ws = this.initWebsocket(this.avatarWSRoute, this.webRTCId)
              if (this.avatarType === 'lam') {
                this.localAvatarRenderer = this.doGaussianRender(ws)
              }
            }
          })
          .catch((e) => {
            console.info('catching', e)
            this.streamState = StreamState.closed
            message.error(e)
            message.error('请检查是否超过数字人并发上限')
          })
      } else if (this.streamState === 'waiting') {
        // waiting 中不允许操作
      } else {
        // 结束会话记录
        if (this.sessionRecordManager) {
          this.sessionRecordManager.endSession()
        }

        stop(this.peerConnection!)
        this.streamState = StreamState.closed
        this.chatRecords = []
        this.chatDataChannel = null
        this.replying = false
        await this.accessDevice()
        if (this.avatarType === 'lam') {
          this.localAvatarRenderer?.exit()
          this.gsLoadPercent = 0
        }
      }
    },
    initWebsocket(ws_route: string, webRTCId: string) {
      const ws = new WS(
        `${window.location.protocol.includes('https') ? 'wss' : 'ws'}://${window.location.host}${ws_route}/${webRTCId}`
      )
      ws.on(WsEventTypes.WS_OPEN, () => {
        console.log('socket opened')
      })
      ws.on(WsEventTypes.WS_CLOSE, () => {
        console.log('socket closed')
      })
      ws.on(WsEventTypes.WS_ERROR, (event) => {
        console.log('socket error', event)
      })
      ws.on(WsEventTypes.WS_MESSAGE, (data) => {
        console.log('socket on message', data)
      })
      return ws
    },
    doGaussianRender(ws: WS) {
      const visionState = useVisionStore()
      const gaussianAvatar = new GaussianAvatar({
        container: visionState.remoteVideoContainerRef!,
        assetsPath: this.avatarAssetsPath,
        ws,
        loadProgress: (progress) => {
          console.log('gs loadProgress', progress)
          this.gsLoadPercent = progress
          if (progress >= 1) {
            // visionState.computeRemotePosition();
          }
        },
      })
      gaussianAvatar.start()
      return gaussianAvatar
    },
  },
})
