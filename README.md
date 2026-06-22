# AI Pet Memory Website Demo

**An interactive front-end demo for pet companionship records and memorial experiences.**

这是一个基于 **React + TypeScript** 开发的 AI 宠物记忆网站前端 Demo。项目围绕宠物陪伴与纪念场景，提供宠物档案、首页展示、时间线、相册和成长记录等功能，用来记录宠物日常生活、重要节点和珍贵回忆。

---

## What This Demo Does｜项目功能

这个 Demo 主要展示一个宠物记忆网站的完整前端交互流程：

* 用户登录与注册
* 创建宠物档案
* 查看宠物首页
* 记录宠物时间线
* 管理宠物相册
* 保存成长与健康记录
* 在“陪伴中”和“纪念中”两种状态之间切换页面内容与视觉风格

项目中的宠物状态分为：

* **Companionship Mode｜陪伴中**：偏向日常陪伴、成长记录和生活信息展示
* **Memorial Mode｜纪念中**：偏向照片回忆、纪念时间线和生前记录整理

---

## How to Run｜如何打开 Demo

### 1. Clone the repository | 克隆仓库

```bash
git clone https://github.com/williamqdy/ai-pet-memory-website-demo.git
cd ai-pet-memory-website-demo
```

### 2. Install dependencies | 安装依赖项

```bash
npm install
```

### 3. Start the development server | 启动开发服务器

```bash
npm run dev
```

### 4. Open in browser | 在浏览器里打开

运行成功后，在浏览器中打开终端显示的本地地址，通常是：

```bash
http://localhost:5173/
```

---

## Tech Stack｜技术栈

* **React**：构建前端页面与组件
* **TypeScript**：定义核心数据类型，提高代码结构清晰度
* **Vite**：项目构建与本地开发环境
* **Tailwind CSS**：页面样式与响应式布局
* **localStorage**：模拟本地数据存储
* **Mock Data**：模拟用户、宠物、时间线、相册和成长记录数据

---

## Main Pages｜主要页面

* **Login**：登录页面
* **Register**：注册页面
* **Create Pet**：创建宠物档案
* **Home**：宠物首页
* **Timeline**：宠物时间线
* **Album**：宠物相册
* **Growth Records**：成长记录

---

## Project Structure｜项目结构

```bash
src/
├── assets/              # 图片与视觉素材
├── components/          # 通用组件
├── data/                # Mock 数据
├── pages/               # 页面文件
├── types/               # TypeScript 类型定义
├── utils/               # localStorage 工具函数
├── App.tsx              # 路由与页面入口
├── main.tsx             # React 入口文件
└── index.css            # 全局样式
```

---

## Demo Notes｜Demo 说明

本项目是前端交互 Demo，主要用于展示产品设计、页面结构、状态切换和基础交互逻辑。

项目使用 mock data 和 localStorage 模拟数据存储。当前没有接入后端数据库、真实账号系统、云端上传、支付系统或外部 API。

---

## Highlights｜项目亮点

* 围绕宠物陪伴和离世纪念两个场景进行产品设计
* 使用“陪伴中 / 纪念中”状态系统改变页面内容和视觉风格
* 将首页、时间线、相册和成长记录拆分为清晰的信息模块
* 使用右侧抽屉完成新增内容操作，减少页面跳转
* 使用 TypeScript 类型定义组织核心数据
* 使用 localStorage 模拟前端数据持久化
* 结合 AI 工具完成产品构思、视觉参考和前端 Demo 搭建

---

## Author

**Dayan Qin**

GitHub: [williamqdy](https://github.com/williamqdy)
