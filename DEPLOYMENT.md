# 部署指南

本文档说明如何将 Markdown to PDF 转换器部署到生产环境。

## 部署架构

- **前端**: Vercel (免费静态托管)
- **后端**: Railway (支持 Puppeteer 的 Node.js 服务)

## 第一步：推送到 GitHub

### 1. 创建 GitHub 仓库

1. 访问 [GitHub](https://github.com/new) 创建新仓库
2. 仓库名称建议：`markdown-to-pdf` 或其他名称
3. 选择 Public 或 Private（选择 Public 可以使用 Vercel 免费套餐的 Hobby 计划）
4. **不要**勾选 "Add a README file"（我们已经有了）
5. 点击 "Create repository"

### 2. 推送代码到 GitHub

在项目根目录执行以下命令（替换 `YOUR_USERNAME` 和 `REPO_NAME`）：

```bash
cd "/Users/wangwei/Documents/Claude playground/demo"

# 添加远程仓库
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# 推送代码到 GitHub
git branch -M main
git push -u origin main
```

---

## 第二步：部署后端到 Railway

### 1. 登录 Railway

访问 [railway.app](https://railway.app/) 并登录（推荐使用 GitHub 账号登录）

### 2. 创建新项目

1. 点击 "New Project" 或 "+" 按钮
2. 选择 "Deploy from GitHub repo"
3. 授权 Railway 访问您的 GitHub 仓库
4. 选择刚创建的仓库

### 3. 配置项目

1. Railway 会自动检测到 `backend` 目录
2. 在项目设置中：
   - **Root Directory**: 设置为 `backend`
   - **Build Command**: 保留默认（自动检测）
   - **Start Command**: `node server.js`

### 4. 配置环境变量（可选）

Railway 会自动设置 `PORT` 环境变量，无需手动配置。

### 5. 部署

点击 "Deploy" 开始部署。Railway 会：
- 自动安装依赖（包括 Puppeteer 和 Chromium）
- 启动 Express 服务器
- 提供一个公网 URL（例如：`https://your-backend.railway.app`）

### 6. 获取后端 URL

部署完成后，记录下 Railway 提供的后端 URL，格式类似：
```
https://your-backend.up.railway.app
```

---

## 第三步：部署前端到 Vercel

### 1. 登录 Vercel

访问 [vercel.com](https://vercel.com/) 并登录（推荐使用 GitHub 账号登录）

### 2. 导入项目

1. 点击 "Add New Project" 或 "New Project"
2. 选择刚创建的 GitHub 仓库
3. Vercel 会自动检测到这是一个前端项目

### 3. 配置项目

在项目配置页面：

**根目录设置**:
- Root Directory: `frontend`

**构建设置**:
- Framework Preset: Vite
- Build Command: `npm run build`
- Output Directory: `dist`

**环境变量**:
- Key: `VITE_API_BASE_URL`
- Value: `https://your-backend.up.railway.app`（使用 Railway 提供的后端 URL）

### 4. 部署

点击 "Deploy" 开始部署。Vercel 会：
- 自动安装依赖
- 运行 `npm run build` 构建项目
- 将构建产物部署到全球 CDN

### 5. 获取前端 URL

部署完成后，Vercel 会提供一个 URL，格式类似：
```
https://your-project.vercel.app
```

---

## 第四步：测试部署

### 1. 访问前端

在浏览器中打开 Vercel 提供的前端 URL

### 2. 测试 PDF 生成

1. 在编辑器中输入一些 Markdown 内容
2. 点击 "下载 PDF" 按钮
3. 验证 PDF 是否成功生成并下载

### 3. 检查后端健康状态

访问后端健康检查接口：
```
https://your-backend.up.railway.app/health
```

应该返回：
```json
{
  "status": "ok",
  "message": "PDF generation service is running"
}
```

---

## 费用说明

### Vercel
- **Hobby 计划**：永久免费
- 限制：
  - 100GB 带宽/月
  - 无限部署
  - 自动 HTTPS
  - 全球 CDN

### Railway
- **免费试用**：新用户 $5 免费额度
- **付费计划**：$5/月起
- 费用基于实际使用量计算
- 适合个人项目和小型应用

---

## 更新部署

当代码有更新时：

1. 提交并推送代码到 GitHub：
   ```bash
   git add .
   git commit -m "Update description"
   git push
   ```

2. Vercel 和 Railway 会自动检测到更新并重新部署

---

## 故障排查

### 问题 1: 前端无法连接后端

**解决方案**：
1. 检查 Vercel 环境变量 `VITE_API_BASE_URL` 是否正确
2. 在 Vercel 项目设置中重新部署（Redeploy）
3. 确认后端 Railway 服务正在运行

### 问题 2: PDF 生成失败

**解决方案**：
1. 检查 Railway 部署日志
2. 确认 Puppeteer 成功安装了 Chromium
3. 增加内存限制（Railway 设置中）

### 问题 3: CORS 错误

**解决方案**：
确认 `backend/server.js` 中已正确配置 CORS：
```javascript
app.use(cors());
```

---

## 技术支持

如有问题，请检查：
- [Vercel 文档](https://vercel.com/docs)
- [Railway 文档](https://docs.railway.app)
- 项目 GitHub Issues
