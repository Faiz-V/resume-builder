# Resume Builder · 简历助手

**Historical / early project** — a browser-based resume editor with three templates, live preview and local rule-based suggestions.

这是一个早期网页项目，用来练习把简历填写、模板预览和导出组合成可体验的流程。界面上的「AI 优化」实际由 `js/optimizer.js` 的本地规则生成，**没有调用大模型或在线 AI 服务**。

## Preview

**[打开在线演示](https://faiz-v.github.io/resume-builder/)**

GitHub Pages 从仓库 `main` 分支根目录发布。`code/` 是另一份历史页面副本，不是根页面的构建产物或必需安装步骤。

## 使用方式

1. 选择「简约风」「商务风」或「创意风」。
2. 填写个人信息，按需添加教育、工作、项目和技能条目。
3. 右侧实时预览所选模板。
4. 点击「AI 优化」查看完整性、描述长度、量化信息等规则建议。评分不是招聘结果预测、ATS 认证或简历事实核验。
5. 页面提供 PNG/PDF 导出按钮；投递前请自行检查分页、字体和排版。浏览器下载策略与 CDN 可用性会影响导出。

## 本地运行

无需 npm 安装或构建。使用 Python 3 提供静态文件：

```sh
git clone https://github.com/Faiz-V/resume-builder.git
cd resume-builder
python -m http.server 8000 --bind 127.0.0.1
```

打开 **http://127.0.0.1:8000/**。macOS/Linux 可将 `python` 换成 `python3`，Windows 可使用 `py -3`。终端按 `Ctrl+C` 停止。

## 技术栈与数据

原生 HTML/CSS/JavaScript；Tailwind CSS CDN 提供样式，Font Awesome 提供图标，html2canvas 与 jsPDF 实现图片/PDF 导出。

- `js/templates.js`：模板；`js/editor.js`：表单与浏览器存储。
- `js/optimizer.js`：规则建议；`js/export.js`：导出；`js/app.js`：页面整合。
- 简历保存在当前站点的 `localStorage`，会在同一浏览器再次访问时恢复；不会自动同步到其他设备。
- 清除该站点的浏览器存储可删除本地草稿。共享电脑上不要留下个人简历。
- 当前代码没有上传简历的业务后端，但会从第三方 CDN 加载脚本、样式与字体资源，因此不是完全离线应用。

## 当前维护状态与限制

保留为早期可交互作品，不承诺持续维护或生产级功能。主要面向桌面编辑；长简历导出、多页排版与不同浏览器仍需人工检查。

2026-09-22 核验：GitHub Pages 返回 HTTP 200；本地页面可选择模板、填写信息、预览并生成规则建议。本轮 PNG 下载事件等待超时，导出文件未完成验收，因此不宣称 PDF/PNG 已通过端到端验证。

仓库没有自动化测试套件、应用测试 CI、CHANGELOG 或 Release；Pages 构建成功不等于应用功能测试通过。当前未选择仓库许可证，公开可见不应理解为已获得复用或再分发授权。未在本次文档更新中新增许可证。
