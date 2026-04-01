# 🛠️ 工具大集合 - 微信小程序

## 📖 快速开始

### 1. 前期准备

#### 1.1 获取小程序 AppID
- 访问：https://mp.weixin.qq.com/
- 登录后进入：开发 → 开发管理 → 开发设置
- 复制你的 **AppID**

#### 1.2 生成上传密钥
- 在同一页面找到 "小程序代码上传"
- 点击 "生成"，创建上传密钥
- **重要**：密钥只显示一次，请立即保存为 `private.key` 文件
- 同时添加你电脑的 IP 到 "IP 白名单"

### 2. 在本地电脑配置

#### 2.1 下载项目
```bash
# 从服务器下载项目（或者用 git）
scp admin@你的服务器IP:/home/admin/.openclaw/workspace/weapp-toolbox.tar.gz ./
tar -xzf weapp-toolbox.tar.gz
cd weapp-toolbox
```

#### 2.2 安装依赖
```bash
npm install
```

#### 2.3 配置上传信息

1. 把下载的 `private.key` 放到项目根目录
2. 编辑 `upload.js`，修改以下内容：
   ```javascript
   const projectConfig = {
     appid: 'wx你的AppID',  // 替换成你的 AppID
     // ...
   };
   
   const uploadConfig = {
     version: '1.0.0',       // 每次上传可以修改版本号
     desc: '更新描述',        // 更新说明
     // ...
   };
   ```

### 3. 自动上传代码

```bash
npm run upload
```

就这么简单！✨

### 4. 去微信公众平台发布

1. 登录 https://mp.weixin.qq.com/
2. 进入：版本管理 → 开发版本
3. 找到刚才上传的版本，点击"提交审核"
4. 审核通过后，点击"发布"

---

## 📁 项目结构

```
weapp-toolbox/
├── app.js              # 小程序入口
├── app.json            # 全局配置
├── app.wxss            # 全局样式
├── package.json        # Node.js 配置
├── upload.js           # 自动上传脚本
├── private.key         # 上传密钥（自己添加）
├── sitemap.json        # 站点地图
└── pages/
    └── calculator/     # 计算器页面
```

---

## 🎯 下一步

- [ ] 添加更多工具（TODO List、单位换算、天气查询...）
- [ ] 配置 GitHub Actions 实现真正的全自动发布
- [ ] 添加小程序首页，展示所有工具列表

---

## 💡 小贴士

- 每次修改代码后，先在微信开发者工具里测试一下
- 确认没问题再运行 `npm run upload` 上传
- 版本号建议用语义化版本：`主版本.次版本.修订号`（如 1.0.0, 1.0.1, 1.1.0）
