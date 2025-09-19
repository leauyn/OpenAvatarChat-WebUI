# 跨域 localStorage 解决方案

## 问题描述

数字人应用运行在 `localhost:5173` 域名下，而用户数据存储在父应用 `https://www.zhgk-mind.com` 的 localStorage 中。由于浏览器的同源策略，无法直接访问不同域名的 localStorage 数据。

## 解决方案

我们提供了三种解决方案来传递用户数据：

### 方案1: URL 参数传递（推荐）

**优点**: 简单可靠，无需复杂的跨域通信
**缺点**: URL 可能较长

#### 父应用实现

```javascript
// 将用户数据编码后作为 URL 参数传递
const userData = ["1", "4d8f3a08-e886-43ff-ba7f-93ca0a1b0f96", "3", "1", null, "学校ID", "13666666661", "贾同学", "中小学生个人对比中小学", null, "1", "2"];
const encodedData = encodeURIComponent(JSON.stringify(userData));
const iframeUrl = `http://localhost:5173?wj_oss_authority=${encodedData}`;

// 设置 iframe src
document.getElementById('digitalHumanIframe').src = iframeUrl;
```

#### 数字人应用实现

```typescript
// 从 URL 参数获取数据
const urlParams = new URLSearchParams(window.location.search);
const authorityData = urlParams.get('wj_oss_authority');
if (authorityData) {
  const userData = JSON.parse(decodeURIComponent(authorityData));
  // 处理用户数据
}
```

### 方案2: PostMessage 通信

**优点**: 实时通信，支持双向数据交换
**缺点**: 需要父应用配合实现消息监听

#### 父应用实现

```javascript
// 监听来自 iframe 的消息
window.addEventListener('message', function(event) {
  if (event.data && event.data.type === 'request_localStorage' && event.data.key === 'wj_oss_authority') {
    // 发送数据给 iframe
    event.source.postMessage({
      type: 'localStorage_response',
      key: 'wj_oss_authority',
      value: JSON.stringify(userData)
    }, '*');
  }
});
```

#### 数字人应用实现

```typescript
// 请求父窗口数据
window.parent.postMessage({
  type: 'request_localStorage',
  key: 'wj_oss_authority'
}, '*');

// 监听父窗口响应
window.addEventListener('message', function(event) {
  if (event.data && event.data.type === 'localStorage_response' && event.data.key === 'wj_oss_authority') {
    const userData = JSON.parse(event.data.value);
    // 处理用户数据
  }
});
```

### 方案3: SessionStorage 传递

**优点**: 数据不会暴露在 URL 中
**缺点**: 需要确保在同一个浏览器会话中

#### 父应用实现

```javascript
// 将数据存储到 sessionStorage
sessionStorage.setItem('wj_oss_authority', JSON.stringify(userData));

// 打开 iframe
document.getElementById('digitalHumanIframe').src = 'http://localhost:5173';
```

#### 数字人应用实现

```typescript
// 从 sessionStorage 获取数据
const authorityData = sessionStorage.getItem('wj_oss_authority');
if (authorityData) {
  const userData = JSON.parse(authorityData);
  // 处理用户数据
}
```

## 完整实现

### 1. 更新 localStorageUtils.ts

```typescript
export function getUserAuthorityFromLocalStorage(): UserAuthorityInfo | null {
  try {
    console.log('🔍 开始从 localStorage 获取 wj_oss_authority 数据...');
    console.log('🌐 当前域名:', window.location.origin);
    console.log('🔍 是否在 iframe 中:', isInIframe());

    // 1. 首先尝试从当前域名的 localStorage 获取
    let authorityData = localStorage.getItem('wj_oss_authority');
    console.log('📦 当前域名 localStorage 数据:', authorityData);

    // 2. 如果在 iframe 中且当前域名没有数据，尝试从父窗口获取
    if (!authorityData && isInIframe()) {
      console.log('🔄 在 iframe 中，尝试从父窗口获取数据...');
      authorityData = getDataFromParentWindow();
    }

    // 3. 如果仍然没有数据，尝试从 URL 参数获取
    if (!authorityData) {
      console.log('🔄 尝试从 URL 参数获取数据...');
      authorityData = getDataFromUrlParams();
    }

    // 4. 如果仍然没有数据，尝试从 sessionStorage 获取
    if (!authorityData) {
      console.log('🔄 尝试从 sessionStorage 获取数据...');
      authorityData = sessionStorage.getItem('wj_oss_authority');
      if (authorityData) {
        console.log('✅ 从 sessionStorage 获取到数据:', authorityData);
      }
    }

    console.log('📦 最终获取到的数据:', authorityData);

    if (!authorityData) {
      console.log('❌ 未找到 wj_oss_authority 数据');
      return null;
    }

    return parseAuthorityData(authorityData);
  } catch (error) {
    console.error('❌ 获取 localStorage 数据失败:', error);
    return null;
  }
}
```

### 2. 父应用示例

参考 `integration-example/parent-app-example.html` 文件，包含三种方案的完整实现。

## 使用步骤

### 步骤1: 在父应用中准备数据

```javascript
// 从父应用的 localStorage 获取数据
const userData = JSON.parse(localStorage.getItem('wj_oss_authority'));

// 选择一种方案传递数据
// 方案1: URL 参数
const encodedData = encodeURIComponent(JSON.stringify(userData));
const iframeUrl = `http://localhost:5173?wj_oss_authority=${encodedData}`;

// 方案2: PostMessage（需要实现消息监听）
// 方案3: SessionStorage
sessionStorage.setItem('wj_oss_authority', JSON.stringify(userData));
```

### 步骤2: 打开数字人应用

```javascript
// 设置 iframe src
document.getElementById('digitalHumanIframe').src = iframeUrl;
```

### 步骤3: 数字人应用自动获取数据

数字人应用会在启动时自动尝试多种方式获取用户数据，并输出详细的日志信息。

## 调试和故障排除

### 1. 检查控制台日志

确保看到以下关键日志：
- `🌐 当前域名: http://localhost:5173`
- `🔍 是否在 iframe 中: true`
- `📦 最终获取到的数据: [...]`

### 2. 检查数据传递

**URL 参数方案**:
- 检查 URL 是否包含 `wj_oss_authority` 参数
- 检查参数值是否正确编码

**PostMessage 方案**:
- 检查父应用是否正确监听消息
- 检查消息格式是否正确

**SessionStorage 方案**:
- 检查数据是否正确存储
- 检查是否在同一个浏览器会话中

### 3. 常见问题

**问题1: 数据获取失败**
- 检查父应用是否正确传递数据
- 检查数据格式是否正确
- 查看控制台错误信息

**问题2: 跨域问题**
- 确保使用正确的跨域通信方案
- 检查父应用的域名和端口

**问题3: 数据格式错误**
- 确保数据是有效的 JSON 格式
- 检查数组索引是否正确

## 推荐方案

**推荐使用 URL 参数方案**，因为：
1. 实现简单，无需复杂的跨域通信
2. 数据传递可靠，不依赖浏览器状态
3. 易于调试和故障排除
4. 支持直接访问和书签保存

## 更新日志

- **v1.0.0**: 初始版本，支持多种跨域数据传递方案
- 支持 URL 参数传递
- 支持 PostMessage 通信
- 支持 SessionStorage 传递
- 添加详细的日志输出
- 提供完整的父应用示例
