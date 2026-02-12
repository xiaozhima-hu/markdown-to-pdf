import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import './App.css'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'

function App() {
  const [markdown, setMarkdown] = useState(`# 欢迎使用 Markdown to PDF

这是一个简单的 Markdown 到 PDF 转换工具。

## 功能特点

- 在左侧编辑 Markdown
- 右侧实时预览
- 自动优化排版
- 一键下载 PDF

## 表格示例

| 名称 | 类型 | 描述 |
|------|------|------|
| React | 库 | 用于构建用户界面 |
| Vue | 框架 | 渐进式 JavaScript 框架 |
| Angular | 框架 | 完整的企业级前端解决方案 |

## 开始使用

1. 在左侧编辑区输入或粘贴 Markdown 内容
2. 查看右侧预览效果
3. 点击"下载 PDF"按钮导出文件`)

  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState('')

  // 排版优化函数
  const optimizeMarkdown = (text: string): string => {
    let optimized = text

    // 将2个或更多的连续换行符替换为1个换行符
    optimized = optimized.replace(/\n{2,}/g, '\n\n')

    // 移除行首行尾的空白字符
    optimized = optimized.split('\n').map(line => line.trim()).join('\n')

    // 确保标题前后有空行
    optimized = optimized.replace(/([^\n])\n(#{1,6}\s)/g, '$1\n\n$2')
    optimized = optimized.replace(/(#{1,6}\s[^\n]+)\n([^\n#])/g, '$1\n\n$2')

    return optimized
  }

  const handleMarkdownChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMarkdown(e.target.value)
  }

  const handleDownloadPDF = async () => {
    setIsGenerating(true)
    setError('')

    try {
      const optimizedContent = optimizeMarkdown(markdown)
      const response = await fetch(`${API_BASE_URL}/api/generate-pdf`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ markdown: optimizedContent }),
      })

      if (!response.ok) {
        throw new Error('PDF生成失败')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `document-${Date.now()}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      setError('生成PDF失败，请确保后端服务已启动')
      console.error(err)
    } finally {
      setIsGenerating(false)
    }
  }

  const optimizedMarkdown = optimizeMarkdown(markdown)

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Markdown to PDF 转换器</h1>
      </header>

      <div className="main-content">
        {/* 左侧编辑区 */}
        <div className="editor-section">
          <div className="section-header">
            <h2>Markdown 编辑器</h2>
            <span className="hint">粘贴或输入 Markdown 内容</span>
          </div>
          <textarea
            className="markdown-editor"
            value={markdown}
            onChange={handleMarkdownChange}
            placeholder="在此输入或粘贴 Markdown 内容..."
            spellCheck={false}
          />
        </div>

        {/* 右侧预览区 */}
        <div className="preview-section">
          <div className="section-header">
            <h2>PDF 预览</h2>
            <button
              className="download-btn"
              onClick={handleDownloadPDF}
              disabled={isGenerating || !markdown.trim()}
            >
              {isGenerating ? '生成中...' : '下载 PDF'}
            </button>
          </div>
          <div className="preview-content">
            <div className="markdown-preview">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{optimizedMarkdown}</ReactMarkdown>
            </div>
          </div>
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
