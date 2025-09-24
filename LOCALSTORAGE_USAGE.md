# localStorage 集成使用说明

## 功能概述

数字人应用现在支持在启动时自动从 localStorage 获取用户权限信息，特别是从 `wj_oss_authority` 数组中获取索引为 1（用户ID）和 7（用户姓名）的数据。

## 数据结构

根据你提供的图片，`wj_oss_authority` 数组结构如下：

```javascript
[
  "1",                                    // 索引0: 用户类型
  "2782e8d3-5f82-4443-9855-6f31dff9766a", // 索引1: 用户ID ✅
  "6",                                    // 索引2: 年级
  "3",                                    // 索引3: 班级
  null,                                   // 索引4: 未知字段
  "学校ID",                               // 索引5: 学校ID
  "手机号",                               // 索引6: 手机号
  "test_ly",                              // 索引7: 用户姓名 ✅
  "学校名称",                             // 索引8: 学校名称
  null,                                   // 索引9: 未知字段
  "地区",                                 // 索引10: 地区
  "其他信息"                              // 索引11: 其他信息
]
```

## 使用方法

### 1. 在组件中获取用户信息

```vue
<template>
  <div>
    <h3>欢迎，{{ userName }}！</h3>
    <p>用户ID: {{ userId }}</p>
    <p>学校: {{ schoolName }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useVideoChatStore } from '@/store'

const videoChatStore = useVideoChatStore()

// 获取用户信息
const userName = computed(() => videoChatStore.getUserName()) // "test_ly"
const userId = computed(() => videoChatStore.getUserId())     // "2782e8d3-5f82-4443-9855-6f31dff9766a"
const schoolName = computed(() => videoChatStore.getSchoolName())
</script>
```

### 2. 直接使用工具函数

```typescript
import { 
  getUserName, 
  getUserId, 
  getSchoolId, 
  getSchoolName,
  getUserAuthorityFromLocalStorage 
} from '@/utils/localStorageUtils'

// 获取特定信息
const userName = getUserName() // 返回 "test_ly"
const userId = getUserId()     // 返回 "2782e8d3-5f82-4443-9855-6f31dff9766a"

// 获取完整用户信息
const userInfo = getUserAuthorityFromLocalStorage()
console.log(userInfo?.userName) // "test_ly"
console.log(userInfo?.userId)   // "2782e8d3-5f82-4443-9855-6f31dff9766a"
```

## 日志输出

应用启动时会在控制台输出详细的日志信息：

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
```

## 测试组件

使用 `LocalStorageTest.vue` 组件来测试功能：

```vue
<template>
  <LocalStorageTest />
</template>

<script setup lang="ts">
import LocalStorageTest from '@/components/LocalStorageTest.vue'
</script>
```

## 可用的方法

### Store 方法

```typescript
const videoChatStore = useVideoChatStore()

// 获取用户信息
videoChatStore.getUserName()    // 用户姓名 (索引7)
videoChatStore.getUserId()      // 用户ID (索引1)
videoChatStore.getSchoolId()    // 学校ID (索引5)
videoChatStore.getSchoolName()  // 学校名称 (索引8)
videoChatStore.getGrade()       // 年级 (索引2)
videoChatStore.getClass()       // 班级 (索引3)
videoChatStore.getPhone()       // 手机号 (索引6)
videoChatStore.getRegion()      // 地区 (索引10)

// 获取完整用户信息
videoChatStore.userAuthority    // 完整的用户权限信息对象
```

### 工具函数

```typescript
import { 
  getUserName, 
  getUserId, 
  getSchoolId, 
  getSchoolName,
  getGrade,
  getClass,
  getPhone,
  getRegion,
  getUserAuthorityFromLocalStorage 
} from '@/utils/localStorageUtils'

// 使用方式与 store 方法相同
```

## 故障排除

### 1. 检查控制台日志

确保在浏览器控制台中看到以下日志：
- `🔍 开始从 localStorage 获取 wj_oss_authority 数据...`
- `📦 原始 localStorage 数据: [...]`
- `✅ 成功解析用户权限信息:`

### 2. 检查 localStorage 数据

在浏览器开发者工具中检查：
1. 打开 Application 标签
2. 查看 Local Storage
3. 确认 `wj_oss_authority` 键存在且包含正确的数组数据

### 3. 常见问题

**问题1: 未找到 wj_oss_authority 数据**
- 检查 localStorage 中是否存在该键
- 确认数据格式是否正确（应该是 JSON 数组）

**问题2: 数据解析失败**
- 检查 JSON 格式是否正确
- 查看控制台错误信息

**问题3: 获取到的数据为 null 或 undefined**
- 检查数组索引是否正确
- 确认数据在指定索引位置存在

## 注意事项

1. **数据格式**: 确保 `wj_oss_authority` 是有效的 JSON 数组格式
2. **索引位置**: 用户姓名在索引7，用户ID在索引1
3. **错误处理**: 代码包含完整的错误处理和日志输出
4. **性能**: 每次调用都会重新解析 localStorage，建议缓存结果

## 更新日志

- **v1.0.0**: 初始版本，支持从 localStorage 获取用户信息
- 支持从 `wj_oss_authority` 数组获取用户信息
- 添加详细的日志输出
- 提供完整的错误处理
- 支持所有数组索引的数据获取
