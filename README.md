# AI Pet Memory Website Demo

**An AI-assisted front-end demo for pet memory recording, 3D pet avatar display, and memorial experiences.**

这是一个基于 **React + TypeScript** 开发的 AI 宠物记忆网站 Demo。项目围绕宠物陪伴与离世纪念场景，提供宠物档案、3D 宠物形象、首页、时间线、相册和成长记录等功能，用于展示一个面向宠物主人的情感化数字记忆空间。

---

## What This Demo Does｜项目功能

这个 Demo 主要展示一个宠物记忆网站的完整前端交互流程：

* 用户登录与注册
* 创建宠物档案
* 上传宠物形象参考图
* 模拟 AI 识别并生成专属 3D 宠物形象
* 查看宠物首页
* 记录宠物时间线
* 管理宠物相册
* 保存成长与健康记录
* 在“陪伴中”和“纪念中”两种状态之间切换页面内容与视觉风格

项目中的宠物状态分为：

* **Companionship Mode｜陪伴中**：偏向日常陪伴、成长记录和生活信息展示
* **Memorial Mode｜纪念中**：偏向照片回忆、纪念时间线和生前记录整理

---

## Key Highlight｜核心亮点：3D Pet Avatar Demo

本项目在创建宠物和首页中加入了 **3D 宠物模型展示**。

当前 Demo 使用预设的 `.glb` 模型文件模拟 AI 生成结果。用户上传宠物参考图后，页面会展示一个 AI 生成流程，包括：

* 正在识别宠物轮廓
* 正在匹配毛色与品种特征
* 正在生成专属 3D 形象
* 专属 3D 形象已生成

这个流程用于模拟未来的产品方向：用户上传宠物照片后，系统可以接入 AI 图像识别与 3D 生成 API，为宠物生成更个性化的数字形象。

当前阶段重点展示：

* 3D 宠物模型在网页中的嵌入与展示
* AI 生成流程的前端交互模拟
* 宠物模型与宠物档案、首页展示之间的产品关联
* 未来接入 AI 生成 API 的功能预留

---

## Main Features｜主要模块

### Home｜首页

首页展示宠物的核心信息、状态内容和 3D 宠物形象。
陪伴中状态强调日常陪伴和成长动态；纪念中状态强调照片回忆和纪念氛围。

### Timeline｜时间线

时间线用于记录宠物生命中的重要节点，例如第一次回家、生日、玩耍瞬间、外出散步和纪念日等。

### Album｜相册

相册用于集中保存和展示宠物照片，也可以作为首页“珍贵瞬间”内容的来源。

### Growth Records｜成长记录

成长记录用于保存宠物更结构化的健康与成长信息，包括：

* 疫苗
* 驱虫
* 体检
* 绝育
* 护理
* 就诊记录
* 其他成长事件

陪伴中状态下，成长记录更偏向日常健康管理；纪念中状态下，成长记录更偏向整理宠物生前的重要记录。

### Drawer Interaction｜右侧抽屉交互

添加时间线、添加照片、添加成长记录等操作采用右侧抽屉形式。抽屉覆盖在原页面上方，原页面不会缩小或左移，减少页面跳转并保持操作连续性。

---

## Tech Stack｜技术栈

* **React**：构建前端页面与组件
* **TypeScript**：定义核心数据类型，提高代码结构清晰度
* **Vite**：项目构建与本地开发环境
* **Tailwind CSS**：页面样式与响应式布局
* **localStorage**：模拟本地数据存储
* **Mock Data**：模拟用户、宠物、时间线、相册和成长记录数据
* **GLB / 3D Model Viewer**：展示宠物 3D 模型

---

## How to Run｜如何打开 Demo

### 1. Clone the repository

```bash
git clone https://github.com/williamqdy/ai-pet-memory-website-demo.git
cd ai-pet-memory-website-demo
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

### 4. Open in browser

运行成功后，在浏览器中打开终端显示的本地地址，通常是：

```bash
http://localhost:5173/
```

---

## Project Structure｜项目结构

```bash
src/
├── assets/              # 图片与视觉素材
├── components/          # 通用组件与 3D 模型展示组件
├── data/                # Mock 数据
├── pages/               # 页面文件
├── types/               # TypeScript 类型定义
├── utils/               # localStorage 与 Demo 数据工具函数
├── App.tsx              # 路由与页面入口
├── main.tsx             # React 入口文件
└── index.css            # 全局样式

public/
├── images/              # 静态图片资源
└── models/              # 预设 GLB 宠物模型
```

---

## Demo Notes｜Demo 说明

本项目是前端交互 Demo，主要用于展示产品设计、页面结构、状态切换、3D 宠物形象展示和基础交互逻辑。

当前项目使用 mock data 和 localStorage 模拟数据存储。3D 宠物形象使用预设 `.glb` 模型模拟 AI 生成结果。

项目未接入后端数据库、真实账号系统、云端上传、支付系统或真实 AI 生成 API。未来可以在当前流程基础上接入图像识别、宠物特征提取和 3D 模型生成相关 API。

---

## Highlights｜项目亮点

* 围绕宠物陪伴和离世纪念两个场景进行产品设计
* 使用“陪伴中 / 纪念中”状态系统改变页面内容和视觉风格
* 加入宠物 3D 模型展示，模拟未来 AI 生成专属宠物形象的产品方向
* 通过上传参考图 + 生成进度弹窗，展示 AI 宠物模型生成的前端交互流程
* 将首页、时间线、相册和成长记录拆分为清晰的信息模块
* 使用右侧抽屉完成新增内容操作，减少页面跳转
* 使用 TypeScript 类型定义组织核心数据
* 使用 localStorage 模拟前端数据持久化
* 结合 AI 工具完成产品构思、视觉参考、交互设计和前端 Demo 搭建

---

## Suitable For｜适用展示方向

这个项目适合作为以下方向的作品集展示：

* AI Product Manager｜AI 产品经理
* Front-end Development｜前端开发
* Interaction Design｜交互设计
* User Experience Design｜用户体验设计
* Product Prototype Design｜产品原型设计
* AI-assisted Development｜AI 工具协同开发

项目重点展示从用户情绪场景出发，将产品需求拆解为页面结构、交互流程和前端实现的能力。

---

## Author

**Dayan Qin**

GitHub: [williamqdy](https://github.com/williamqdy)
