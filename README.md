# 数学核心素养 AI (DeepSeek 版)

本项目是基于 DeepSeek API 开发的智能数学学习助手。

## 🛠 修改说明
- **模型核心**：由原通用模型切换为 **DeepSeek-Chat**，提供更精准的数学推理。
- **图形工具**：集成 Desmos 内置渲染，并提供 **[Desmos 中文官网](https://www.desmos.com/?lang=zh-CN)** 的快捷跳转入口。
- **安全性**：通过 Netlify Functions 隐藏 API 密钥。

## 🚀 快速部署
1. 将代码上传至 GitHub。
2. 在 Netlify 关联此仓库。
3. **关键步骤**：在 Netlify 设置页面添加环境变量：
   - `DEEPSEEK_API_KEY`: 填写你从 DeepSeek 平台获取的 `sk-...` 密钥。

## 📁 目录结构
- `index.html`: 前端界面，已更新为 DeepSeek 主题。
- `netlify/functions/chat-stream.js`: 后端代理，负责流式传输 DeepSeek 的响应。