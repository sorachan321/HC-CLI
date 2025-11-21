# Hack.Chat Client Redux 🌸

这是一个基于 React、TypeScript 和 Tailwind CSS 构建的现代 hack.chat 客户端。它拥有精美的主题（包括“花语”主题）、粒子特效背景、图片上传功能（ImgBB）以及强大的用户管理功能。

## ✨ 功能特性

*   **多主题支持**：内置 Dark, Light, Hacker, Nebula, Floral (花语) 等多种配色。
*   **视觉特效**：支持科技感连线动画及“花瓣飘落”特效。
*   **用户交互**：点击头像快捷 @回复，右键菜单屏蔽用户/Tripcode。
*   **Markdown 支持**：完整的 Markdown 渲染，支持代码高亮。
*   **图片上传**：集成 ImgBB API，一键上传图片。
*   **便捷输入**：输入框自动高度调节，支持 Shift+Enter 换行。

---

## 🛠️ 本地部署与开发 (Local Development)

由于本项目使用 `.tsx` (TypeScript + React) 编写，你需要 Node.js 环境来编译代码。

### 1. 环境准备
确保你的电脑上安装了 [Node.js](https://nodejs.org/) (推荐 v18 或更高版本)。

### 2. 初始化项目
打开终端（CMD 或 PowerShell），运行以下命令创建一个基于 Vite 的 React TypeScript 项目：

```bash
npm create vite@latest hackchat-client -- --template react-ts
cd hackchat-client
npm install
```

### 3. 安装依赖
安装项目所需的第三方库：

```bash
npm install lucide-react react-markdown remark-gfm date-fns use-sound
```

*注意：本项目在 `index.html` 中使用了 Tailwind CSS CDN，为了生产环境性能，建议按照 Tailwind 官方文档进行本地安装，或者直接保留 CDN 方式（如下文所述）。*

### 4. 迁移文件
将你现有的代码文件复制到新创建的 `hackchat-client` 文件夹中，结构如下：

*   删除 `src/` 下原有的所有文件（除了 `vite-env.d.ts`）。
*   将 `index.html` 放在项目根目录（覆盖 Vite 生成的默认 `index.html`）。
*   将 `index.tsx` 重命名为 `main.tsx` (Vite 默认入口通常为 main.tsx，或者你需要修改 index.html 中的引用路径)。
*   将其他所有 `.tsx` 和 `.ts` 文件放入 `src/` 目录。

**推荐的文件结构：**
```text
hackchat-client/
├── index.html          (修改 script src 为 "/src/index.tsx")
├── package.json
├── src/
│   ├── index.tsx       (入口文件)
│   ├── App.tsx
│   ├── types.ts
│   ├── constants.ts
│   ├── metadata.json
│   ├── components/
│   │   ├── Login.tsx
│   │   ├── MessageItem.tsx
│   │   ├── ParticleBackground.tsx
│   │   ├── SettingsModal.tsx
│   │   └── UserList.tsx
│   └── services/
│       └── imgbbService.ts
```

### 5. 修改 index.html
打开 `index.html`，找到 `<script>` 标签，确保它指向你的入口文件：

```html
<!-- 如果你的入口文件在 src/index.tsx -->
<script type="module" src="/src/index.tsx"></script>
```

同时，由于你是本地开发，可以移除 `index.html` 中原本的 `importmap` 部分（因为我们通过 npm 安装了依赖）。

### 6. 启动项目
在终端运行：

```bash
npm run dev
```
打开浏览器访问 `http://localhost:5173` 即可看到客户端。

---

## 🚀 部署到服务器 (Deployment)

要将客户端部署到公网（如 Nginx, Apache, Vercel, Netlify 等），你需要构建静态文件。

### 1. 构建项目
在项目根目录运行：

```bash
npm run build
```

这将生成一个 `dist/` 文件夹，里面包含了编译好的 HTML、CSS 和 JavaScript 文件。

### 2. 部署静态文件

#### 方案 A: 静态托管服务 (推荐 - Vercel / Netlify)
这是最简单的方法，通常完全免费。
1. 将项目上传到 GitHub。
2. 登录 Vercel 或 Netlify。
3. 导入你的 GitHub 仓库。
4. 构建设置通常会被自动识别（Build Command: `npm run build`, Output Directory: `dist`）。
5. 点击 Deploy，即可获得一个公网 HTTPS 链接。

#### 方案 B: Nginx / Apache / IIS
将 `dist/` 文件夹内的所有内容上传到你服务器的 Web 根目录（例如 Nginx 的 `/var/www/html`）。

**Nginx 配置示例：**
```nginx
server {
    listen 80;
    server_name chat.yourdomain.com;
    root /var/www/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## ⚙️ 配置 ImgBB 图床
为了使用图片上传功能：
1. 访问 [ImgBB API](https://api.imgbb.com/) 并注册/登录。
2. 获取 API Key。
3. 在客户端点击设置 (Settings) 图标，在 "Image Upload" 一栏填入你的 API Key。

## 🎨 自定义
如果你想修改配色，请编辑 `src/constants.ts` 中的 `THEMES` 对象。

License: MIT
