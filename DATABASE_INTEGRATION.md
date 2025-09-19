# 数据库集成使用说明

## 功能概述

数字人应用现在支持在获取用户ID后自动请求后端接口获取所有记录值，并输出详细的日志信息。

## 后端接口信息

- **接口地址**: `https://www.zhgk-mind.com/api/dwsurvey/anon/response/getUserResultInfo.do`
- **请求方法**: POST
- **请求头**: `Content-Type: application/json`
- **请求参数**: `{ "userId": "用户ID" }`

## 响应数据结构

```typescript
{
  "resultCode": 200,
  "resultMsg": "执行成功",
  "data": [
    {
      "id": "1",
      "name": "学习焦虑",
      "code": "1",
      "type": "1",
      "resulte": "1-1-A",
      "userId": "4d8f3a08-e886-43ff-ba7f-93ca0a1b0f96",
      "surveyId": null,
      "value": "根据学校量表测评结果，将学生划分为健康（深蓝）、一般关注（浅蓝）、重点关注（黄色）三类..."
    }
  ]
}
```

## 自动触发流程

1. **应用启动** → 从 localStorage 获取用户信息
2. **检测到用户ID** → 自动调用后端接口
3. **获取数据** → 存储到 store 中
4. **输出日志** → 详细记录整个过程

## 日志输出示例

```
🚀 开始初始化用户信息...
🔍 是否在 iframe 中运行: false
📖 从 localStorage 加载用户权限信息...
🔍 开始从 localStorage 获取 wj_oss_authority 数据...
📦 原始 localStorage 数据: ["1","2782e8d3-5f82-4443-9855-6f31dff9766a","6","3",null,...]
🔄 开始解析 JSON 数据...
📋 解析后的数组: ["1","2782e8d3-5f82-4443-9855-6f31dff9766a","6","3",null,...]
📏 数组长度: 12
✅ 成功解析用户权限信息:
   👤 用户姓名 (索引7): test_ly
   🆔 用户ID (索引1): 2782e8d3-5f82-4443-9855-6f31dff9766a
   🏫 学校ID (索引5): 学校ID
   🏢 学校名称 (索引8): 学校名称
   📚 年级 (索引2): 6
   🎒 班级 (索引3): 3
   📱 手机号 (索引6): 手机号
   🌍 地区 (索引10): 地区
   📊 完整数据: {userName: "test_ly", userId: "2782e8d3-5f82-4443-9855-6f31dff9766a", ...}
✅ Store: 成功获取用户权限信息
   👤 用户姓名 (索引7): test_ly
   🆔 用户ID (索引1): 2782e8d3-5f82-4443-9855-6f31dff9766a
   🏫 学校ID (索引5): 学校ID
   🏢 学校名称 (索引8): 学校名称
   📚 年级 (索引2): 6
   🎒 班级 (索引3): 3
   📱 手机号 (索引6): 手机号
   🌍 地区 (索引10): 地区
🔄 检测到用户ID，开始查询数据库...
🚀 开始查询用户结果信息...
📋 查询用户ID: 2782e8d3-5f82-4443-9855-6f31dff9766a
🌐 开始请求后端接口获取用户结果信息...
📋 请求参数 - userId: 2782e8d3-5f82-4443-9855-6f31dff9766a
📤 发送请求到: https://www.zhgk-mind.com/api/dwsurvey/anon/response/getUserResultInfo.do
📦 请求数据: {
  "userId": "2782e8d3-5f82-4443-9855-6f31dff9766a"
}
📡 响应状态: 200 OK
📥 响应数据:
   📊 结果代码: 200
   💬 结果消息: 执行成功
   📋 数据条数: 3
   📝 详细数据:
     1. 学习焦虑 (1) - 1-1-A
        用户ID: 2782e8d3-5f82-4443-9855-6f31dff9766a
        值: 根据学校量表测评结果，将学生划分为健康（深蓝）、一般关注（浅蓝）、重点关注（黄色）三类...
     2. 状态焦虑 (2) - 1-2-A
        用户ID: 2782e8d3-5f82-4443-9855-6f31dff9766a
        值: 根据学校量表测评结果，将学生划分为健康（深蓝）、一般关注（浅蓝）、重点关注（黄色）三类...
     3. 抑郁 (3) - 1-3-B
        用户ID: 2782e8d3-5f82-4443-9855-6f31dff9766a
        值: 根据学校量表测评结果，将学生划分为健康（深蓝）、一般关注（浅蓝）、重点关注（黄色）三类...
✅ Store: 成功获取用户结果信息
   📊 记录数量: 3
   📋 数据: [{id: "1", name: "学习焦虑", ...}, {id: "2", name: "状态焦虑", ...}, {id: "3", name: "抑郁", ...}]
```

## 使用方法

### 1. 在组件中获取数据库记录

```vue
<template>
  <div>
    <h3>用户测评结果</h3>
    <div v-if="userResultInfo.length > 0">
      <div v-for="record in userResultInfo" :key="record.id">
        <h4>{{ record.name }}</h4>
        <p>结果: {{ record.resulte }}</p>
        <p>详情: {{ record.value }}</p>
      </div>
    </div>
    <div v-else-if="userResultInfoLoading">
      加载中...
    </div>
    <div v-else-if="userResultInfoError">
      加载失败: {{ userResultInfoError }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useVideoChatStore } from '@/store'

const videoChatStore = useVideoChatStore()

const userResultInfo = computed(() => videoChatStore.userResultInfo)
const userResultInfoLoading = computed(() => videoChatStore.userResultInfoLoading)
const userResultInfoError = computed(() => videoChatStore.userResultInfoError)
</script>
```

### 2. 手动查询数据库

```typescript
import { useVideoChatStore } from '@/store'

const videoChatStore = useVideoChatStore()

// 查询当前用户的数据库记录
await videoChatStore.fetchCurrentUserResultInfo()

// 查询指定用户的数据库记录
await videoChatStore.fetchUserResultInfo('指定用户ID')
```

### 3. 获取特定数据

```typescript
// 按名称分组
const groupedData = videoChatStore.getUserResultInfoByName()

// 获取特定名称的结果
const anxietyData = videoChatStore.getUserResultInfoBySpecificName('学习焦虑')

// 清除数据
videoChatStore.clearUserResultInfo()
```

## 测试功能

使用 `LocalStorageTest.vue` 组件来测试功能：

```vue
<template>
  <LocalStorageTest />
</template>

<script setup lang="ts">
import LocalStorageTest from '@/components/LocalStorageTest.vue'
</script>
```

测试组件提供：
- localStorage 数据测试
- 数据库查询测试
- 数据清除功能
- 详细的结果展示

## Store 状态

```typescript
interface VideoChatState {
  // 用户数据库记录
  userResultInfo: UserResultInfo[]           // 用户结果信息数组
  userResultInfoLoading: boolean             // 加载状态
  userResultInfoError: string | null         // 错误信息
}
```

## 可用的方法

### Store 方法

```typescript
const videoChatStore = useVideoChatStore()

// 查询用户结果信息
await videoChatStore.fetchUserResultInfo(userId?: string)
await videoChatStore.fetchCurrentUserResultInfo()

// 数据操作
videoChatStore.clearUserResultInfo()
videoChatStore.getUserResultInfoByName()
videoChatStore.getUserResultInfoBySpecificName(name: string)
```

### 服务方法

```typescript
import { getUserResultInfo } from '@/services/databaseService'

// 直接调用服务
const response = await getUserResultInfo('用户ID')
```

## 错误处理

系统包含完整的错误处理机制：

1. **网络错误**: 捕获网络请求失败
2. **数据格式错误**: 验证响应数据格式
3. **业务错误**: 处理后端返回的错误信息
4. **超时处理**: 防止长时间等待

## 注意事项

1. **跨域问题**: 确保后端接口支持跨域请求
2. **用户ID验证**: 确保用户ID有效且存在
3. **错误处理**: 检查控制台日志了解详细错误信息
4. **性能考虑**: 数据会自动缓存，避免重复请求

## 故障排除

### 1. 检查网络请求

在浏览器开发者工具的 Network 标签中查看：
- 请求是否成功发送
- 响应状态码
- 响应数据格式

### 2. 检查控制台日志

确保看到以下关键日志：
- `🔄 检测到用户ID，开始查询数据库...`
- `🌐 开始请求后端接口获取用户结果信息...`
- `✅ Store: 成功获取用户结果信息`

### 3. 常见问题

**问题1: 请求失败**
- 检查网络连接
- 确认接口地址正确
- 检查跨域设置

**问题2: 数据为空**
- 确认用户ID有效
- 检查后端数据是否存在
- 查看响应数据格式

**问题3: 加载状态异常**
- 检查错误信息
- 查看控制台日志
- 确认异步操作正确

## 更新日志

- **v1.0.0**: 初始版本，支持自动数据库查询
- 支持从 localStorage 获取用户ID后自动查询
- 添加详细的日志输出
- 提供完整的错误处理
- 支持手动查询和清除数据
