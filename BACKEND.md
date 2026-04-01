# 🚀 后端服务启动指南

## 1. 安装后端依赖

```bash
cd backend
npm install
```

## 2. 启动后端服务

```bash
npm start
```

服务会在 `http://localhost:8889` 启动，同时可以通过 `http://47.102.128.76:8889` 访问。

## 3. API 接口文档

### 获取统计数据
```
GET /api/pet/stats
```

### 获取动态列表
```
GET /api/pet/moments
```

### 发布新动态
```
POST /api/pet/moments
Content-Type: application/json

{
  "content": "动态内容",
  "photos": ["图片URL1", "图片URL2"],
  "videos": ["视频URL1"]
}
```

### 上传文件
```
POST /api/pet/upload
Content-Type: multipart/form-data

file: 上传的文件
```

### 点赞
```
POST /api/pet/moments/:id/like
```

## 4. 小程序配置

由于使用的是 HTTP 接口（非 HTTPS），需要在微信开发者工具中：

1. 点击右上角 "详情"
2. 找到 "本地设置"
3. 勾选 "不校验合法域名、web-view（业务域名）、TLS 版本以及 HTTPS 证书"

## 5. 数据存储

- 动态数据：`backend/data/moments.json`
- 上传文件：`backend/uploads/`

## 6. 后台运行服务

使用 PM2 让服务在后台运行：

```bash
npm install -g pm2
cd backend
pm2 start server.js --name pet-backend
pm2 save
pm2 startup
```

常用命令：
```bash
pm2 logs pet-backend    # 查看日志
pm2 restart pet-backend # 重启服务
pm2 stop pet-backend    # 停止服务
```
