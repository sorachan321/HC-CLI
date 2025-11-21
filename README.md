# Hack.Chat Client Redux 🌸

这是一个基于 React、TypeScript 和 Tailwind CSS 构建的现代 hack.chat 客户端。它旨在提供极致的视觉体验和流畅的交互，拥有精美的主题系统、粒子特效以及现代化的聊天功能。

## ✨ 核心特性 (Features)

*   **🎨 多主题系统**：内置 Dark, Light, Hacker, Nebula, Synthwave, Floral (花语) 等多种精心调色的主题。
*   **💊 智能提及 (New)**：全新的胶囊型 @提及系统。自动高亮提及对象，具备上下文感知的配色方案（己方视角与他人视角不同），支持键盘上下键快速选择用户。
*   **✨ 视觉特效**：支持沉浸式背景动画，包括科技感连线（Hacker/Dark）及唯美的花瓣飘落（Floral）特效。
*   **🛠️ 现代化交互**：
    *   **用户管理**：右键菜单屏蔽用户/Tripcode。
    *   **Markdown 增强**：完整的 Markdown 渲染，支持代码高亮与 LaTeX 数学公式 ($E=mc^2$)。
    *   **媒体集成**：集成 ImgBB 一键上传图片，Tenor API 搜索 GIFs，内置颜文字/Emoji 选择器。
*   **⚡ 极致性能**：基于 Vite 构建，极小的体积与极快的加载速度。

---

## 🛠️ 本地开发 (Local Development)

如果你想在本地运行或修改代码：

1.  **环境准备**：确保安装 [Node.js](https://nodejs.org/) (v18+)。
2.  **安装依赖**：
    ```bash
    npm install
    ```
3.  **启动开发服务器**：
    ```bash
    npm run dev
    ```
    访问 `http://localhost:5173` 即可。

---

## 🚀 服务器部署指南 (Deployment)

### 方式一：使用 Git Clone 部署到 Linux 服务器 (推荐)

如果你有一台 VPS (Ubuntu/CentOS/Debian)，请按照以下步骤操作：

#### 1. 准备环境
确保服务器已安装 Node.js, Git 和 Nginx。

```bash
# Ubuntu/Debian 示例
sudo apt update
sudo apt install nodejs npm git nginx
```

#### 2. 获取代码
在服务器上克隆你的仓库：

```bash
cd /var/www
git clone https://github.com/AndrewBelt/hack.chat.git  # 请替换为你的实际仓库地址
cd hack.chat
```

#### 3. 安装与构建
安装依赖并生成静态文件：

```bash
npm install
npm run build
```
构建完成后，你会看到一个 `dist/` 目录，这里面包含了所有需要发布的静态文件。

#### 4. 配置 Web 服务器

**选项 A: 使用 Nginx (生产环境推荐)**

创建或编辑 Nginx 配置文件：
```bash
sudo nano /etc/nginx/sites-available/hackchat
```

写入以下配置（根据实际路径修改）：

```nginx
server {
    listen 80;
    server_name chat.yourdomain.com; # 替换为你的域名或 IP

    root /var/www/hack.chat/dist;    # 指向构建生成的 dist 目录
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # 开启 Gzip 压缩 (可选，优化加载速度)
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;
}
```

启用配置并重启 Nginx：
```bash
sudo ln -s /etc/nginx/sites-available/hackchat /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

**选项 B: 使用简易静态服务器 (测试用)**

如果你不想配置 Nginx，可以使用 `serve` 快速运行：

```bash
npx serve -s dist -l 3000
```
此时访问 `http://服务器IP:3000` 即可。

---

### 方式二：静态托管平台 (Vercel / Netlify)

这是最简单的部署方式，无需服务器。

1.  Fork 本仓库到你的 GitHub。
2.  登录 [Vercel](https://vercel.com) 或 [Netlify](https://www.netlify.com)。
3.  导入你的仓库。
4.  保持默认设置 (Build Command: `npm run build`, Output Directory: `dist`)。
5.  点击 **Deploy**。

---

## ⚙️ 配置说明 (Configuration)

客户端包含一些可以在界面中配置的选项，部分功能依赖外部 API：

*   **ImgBB API Key**: 用于图片上传。请在 [ImgBB](https://api.imgbb.com/) 申请 Key 并在设置面板填入。
*   **Tenor API Key**: 用于 GIF 搜索。请在 Google Cloud Console 申请 Tenor API Key。

## 🎨 自定义主题

如需修改或添加新主题，请编辑 `src/constants.ts` 文件中的 `THEMES` 对象。你可以自定义背景色、气泡色以及提及胶囊的配色。

License: MIT