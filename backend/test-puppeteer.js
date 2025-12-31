const puppeteer = require('puppeteer');

async function testPuppeteer() {
  console.log('正在测试 Puppeteer...');

  try {
    console.log('1. 尝试启动浏览器...');
    const browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage'
      ]
    });

    console.log('✓ 浏览器启动成功');

    console.log('2. 创建新页面...');
    const page = await browser.newPage();
    console.log('✓ 页面创建成功');

    console.log('3. 设置测试内容...');
    await page.setContent('<h1>测试 PDF 生成</h1><p>这是一个测试页面。</p>');
    console.log('✓ 内容设置成功');

    console.log('4. 生成 PDF...');
    const pdf = await page.pdf({ format: 'A4' });
    console.log(`✓ PDF 生成成功 (大小: ${pdf.length} bytes)`);

    console.log('5. 关闭浏览器...');
    await browser.close();
    console.log('✓ 浏览器关闭成功');

    console.log('\n✅ 所有测试通过！Puppeteer 工作正常。');
    process.exit(0);

  } catch (error) {
    console.error('\n❌ 测试失败:', error.message);
    console.error('\n详细错误信息:', error);

    if (error.message.includes('socket hang up')) {
      console.error('\n可能的解决方案:');
      console.error('1. 确保系统已安装 Chrome 或 Chromium');
      console.error('2. 在 macOS 上，可能需要允许 Chrome for Testing 运行');
      console.error('3. 检查系统权限设置');
    }

    process.exit(1);
  }
}

testPuppeteer();
