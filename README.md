# Markdown to PDF 转换器

一个简单易用的 Markdown 到 PDF 转换工具，支持实时预览和自动排版优化。

## 功能特点

- **左侧编辑器**：支持粘贴或手写 Markdown 内容
- **右侧预览**：实时查看转换后的效果
- **自动排版优化**：自动清理多余空行，统一格式
- **一键下载**：点击按钮即可下载生成的 PDF 文件

## 技术栈

### 前端
- React 18 + TypeScript
- Vite (构建工具)
- Tailwind CSS (样式)
- react-markdown (Markdown 渲染)

### 后端
- Node.js + Express
- Puppeteer (PDF 生成)
- marked (Markdown 转 HTML)
- CORS (跨域支持)

## 项目结构

```
demo/
├── frontend/          # React 前端应用
│   ├── src/
│   │   ├── App.tsx           # 主应用组件
│   │   ├── App.css           # 应用样式
│   │   └── index.css         # 全局样式
│   ├── package.json
│   └── ...
└── backend/           # Node.js 后端服务
    ├── server.js             # Express 服务器
    └── package.json
```

## 安装和运行

### 1. 安装前端依赖

```bash
cd frontend
npm install
```

### 2. 安装后端依赖

```bash
cd ../backend
npm install
```

注意：Puppeteer 会自动下载 Chromium 浏览器，这可能需要一些时间。

### 3. 启动后端服务

```bash
cd backend
npm start
```

服务器将在 `http://localhost:3001` 启动

### 4. 启动前端应用

打开新的终端窗口：

```bash
cd frontend
npm run dev
```

前端应用将在 `http://localhost:5173` 启动（Vite 默认端口）

## 使用方法

1. 在浏览器中打开前端应用
2. 在左侧编辑器中输入或粘贴 Markdown 内容
3. 右侧将实时显示预览效果
4. 点击右上角的"下载 PDF"按钮
5. PDF 文件将自动下载到本地

## 排版优化规则

应用会自动优化 Markdown 排版：

- 将 2 个或更多的连续换行符替换为 1 个换行符
- 移除每行首尾的空白字符
- 确保标题前后有空行
- 统一列表格式

## API 接口

### POST /api/generate-pdf

生成 PDF 文件

**请求体：**
```json
{
  "markdown": "# Hello World\n\nThis is a test."
}
```

**响应：**
- Content-Type: `application/pdf`
- 文件以二进制流形式返回

### GET /health

健康检查接口

**响应：**
```json
{
  "status": "ok",
  "message": "PDF generation service is running"
}
```

## 常见问题

### Q: PDF 生成失败怎么办？
A: 请确保后端服务已启动，并且 Puppeteer 成功下载了 Chromium 浏览器。

### Q: 前端无法连接后端？
A: 检查后端是否在 `http://localhost:3001` 运行，并确保 CORS 配置正确。

### Q: 中文显示乱码？
A: 应用已配置中文字体支持，如仍有问题，请检查系统字体。

## 开发建议

- 前端热重载：Vite 支持热模块替换(HMR)，修改代码后自动刷新
- 后端调试：可以使用 `console.log` 输出调试信息
- PDF 样式调整：修改 `backend/server.js` 中的 CSS 样式

## 许可证

MIT
