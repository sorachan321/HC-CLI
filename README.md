# Hack.Chat Client Redux (HC-CLI) 🌸

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

## 📥 本地部署与运行 (Local Deployment)

如果你想在本地电脑或服务器上运行此客户端，请遵循以下步骤。

### 1. 环境准备
确保你的系统已安装：
*   [Node.js](https://nodejs.org/) (推荐 v18 或更高版本)
*   [Git](https://git-scm.com/)

### 2. 克隆仓库
打开终端（Terminal/PowerShell），运行以下命令下载代码：

```bash
git clone https://github.com/sorachan321/HC-CLI.git
cd HC-CLI
```

### 3. 安装依赖
下载项目所需的库文件：

```bash
npm install
```

### 4. 运行项目

**场景 A：日常使用/开发 (推荐)**
如果你只是想快速打开用一下，或者想修改代码：
```bash
npm run dev
```
*   运行后，浏览器访问显示的的本地地址 (通常是 `http://localhost:5173`) 即可。

**场景 B：长期稳定运行 (服务器/挂机)**
如果你想把它部署在服务器上，或者作为本地的一个固定服务运行：

1.  **构建生产版本**：
    ```bash
    npm run build
    ```
    这会生成一个 `dist` 文件夹，里面是优化好的静态文件。

2.  **启动服务**：
    你可以使用 `serve` 工具来运行：
    ```bash
    npx serve -s dist -l 3000
    ```
    访问 `http://localhost:3000` 即可。

---

## 🔄 自动更新指南 (Auto Update)

由于本项目是基于 React 的前端项目，**单纯的 `git pull` 是不够的**，每次拉取代码后都需要重新构建 (Build) 才能生效。

### 方法一：手动更新
当你发现仓库有新功能时，在项目根目录下运行：

```bash
git pull           # 1. 拉取最新代码
npm install        # 2. 更新依赖 (防止有新库加入)
npm run build      # 3. 重新构建
```
*如果你正在运行 `npm run dev`，它通常会自动检测变化并刷新。如果是生产环境，需重启你的 web 服务器。*

### 方法二：编写自动更新脚本 (Linux/Mac)

你可以创建一个简单的脚本来实现一键更新。

1.  在项目根目录下创建 `update.sh`：
    ```bash
    nano update.sh
    ```

2.  粘贴以下内容：
    ```bash
    #!/bin/bash
    echo "🔍 Checking for updates..."
    
    # 拉取代码
    git pull origin main
    
    # 安装依赖并构建
    echo "📦 Installing dependencies..."
    npm install
    
    echo "🏗️ Building project..."
    npm run build
    
    echo "✅ Update complete! (Please restart your web server if needed)"
    ```

3.  赋予执行权限：
    ```bash
    chmod +x update.sh
    ```

4.  **以后只需运行 `./update.sh` 即可自动完成所有更新步骤。**

### 方法三：设置 Crontab 自动定时更新 (高级)

如果你希望服务器每天凌晨自动检查更新：

1.  输入 `crontab -e`
2.  添加一行 (假设项目在 `/home/user/HC-CLI`)：
    ```bash
    0 3 * * * cd /home/user/HC-CLI && ./update.sh >> /home/user/HC-CLI/update.log 2>&1
    ```
    *这会在每天凌晨 3:00 自动拉取代码并构建。*

---

## ⚙️ 配置说明 (Configuration)

客户端包含一些可以在界面中配置的选项，部分功能依赖外部 API：

*   **ImgBB API Key**: 用于图片上传。请在 [ImgBB](https://api.imgbb.com/) 申请 Key 并在设置面板填入。
*   **Tenor API Key**: 用于 GIF 搜索。请在 Google Cloud Console 申请 Tenor API Key。

## 🎨 自定义主题

如需修改或添加新主题，请编辑 `src/constants.ts` 文件中的 `THEMES` 对象。你可以自定义背景色、气泡色以及提及胶囊的配色。

License: MIT
