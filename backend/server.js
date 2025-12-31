import express from 'express';
import cors from 'cors';
import puppeteer from 'puppeteer';
import { marked } from 'marked';

const app = express();
const PORT = 3001;

// 中间件
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Markdown转HTML的模板
function generateHTML(markdownContent) {
  const htmlContent = marked(markdownContent);

  return `
    <!DOCTYPE html>
    <html lang="zh-CN">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Markdown Document</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 800px;
          margin: 0 auto;
          padding: 40px 20px;
          background: white;
        }

        h1, h2, h3, h4, h5, h6 {
          margin-top: 1.5em;
          margin-bottom: 0.5em;
          font-weight: 600;
          line-height: 1.3;
        }

        h1 {
          font-size: 2em;
          border-bottom: 2px solid #eee;
          padding-bottom: 0.3em;
          margin-top: 0;
        }

        h2 {
          font-size: 1.5em;
          border-bottom: 1px solid #eee;
          padding-bottom: 0.3em;
        }

        h3 {
          font-size: 1.25em;
        }

        p {
          margin: 1em 0;
        }

        ul, ol {
          padding-left: 2em;
          margin: 1em 0;
        }

        li {
          margin: 0.5em 0;
        }

        code {
          background-color: #f6f8fa;
          padding: 0.2em 0.4em;
          border-radius: 3px;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          font-size: 0.9em;
        }

        pre {
          background-color: #f6f8fa;
          padding: 1em;
          border-radius: 6px;
          overflow-x: auto;
          margin: 1em 0;
        }

        pre code {
          background-color: transparent;
          padding: 0;
          font-size: 0.9em;
        }

        blockquote {
          border-left: 4px solid #ddd;
          padding-left: 1em;
          color: #666;
          margin: 1em 0;
        }

        a {
          color: #0366d6;
          text-decoration: none;
        }

        a:hover {
          text-decoration: underline;
        }

        table {
          border-collapse: collapse;
          width: 100%;
          margin: 1em 0;
        }

        th, td {
          border: 1px solid #ddd;
          padding: 0.5em 1em;
          text-align: left;
        }

        th {
          background-color: #f6f8fa;
          font-weight: 600;
        }

        img {
          max-width: 100%;
          height: auto;
        }

        hr {
          border: none;
          border-top: 1px solid #eee;
          margin: 2em 0;
        }
      </style>
    </head>
    <body>
      ${htmlContent}
    </body>
    </html>
  `;
}

// PDF生成API
app.post('/api/generate-pdf', async (req, res) => {
  let browser = null;

  try {
    const { markdown } = req.body;

    if (!markdown) {
      return res.status(400).json({ error: 'Markdown content is required' });
    }

    console.log('Generating PDF...');

    // 启动浏览器
    browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--disable-gpu'
      ]
    });

    const page = await browser.newPage();

    // 生成HTML内容
    const html = generateHTML(markdown);

    // 设置页面内容
    await page.setContent(html, {
      waitUntil: 'networkidle0',
      timeout: 30000
    });

    // 生成PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        right: '15mm',
        bottom: '20mm',
        left: '15mm'
      }
    });

    console.log('PDF generated successfully');

    // 设置响应头
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="document-${Date.now()}.pdf"`);

    // 发送PDF
    res.send(pdfBuffer);

  } catch (error) {
    console.error('Error generating PDF:', error);

    // 提供更详细的错误信息
    let errorMessage = 'Failed to generate PDF';
    if (error.message) {
      errorMessage += `: ${error.message}`;
    }

    // 如果是 Puppeteer 相关错误，提供更多上下文
    if (error.message && error.message.includes('socket hang up')) {
      errorMessage = '浏览器启动失败，请确保系统已正确安装 Chrome 或 Chromium';
    }

    res.status(500).json({ error: errorMessage, details: error.message });
  } finally {
    if (browser) {
      try {
        await browser.close();
        console.log('Browser closed successfully');
      } catch (closeError) {
        console.error('Error closing browser:', closeError);
      }
    }
  }
});

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'PDF generation service is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`PDF generation endpoint: http://localhost:${PORT}/api/generate-pdf`);
});
