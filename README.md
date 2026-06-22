# AI Pet Memory Website Demo

**An interactive AI-assisted website prototype for pet companionship, emotional recording, and memorial experiences.**

一个围绕宠物陪伴与纪念场景设计的前端交互 Demo，用于记录宠物档案、时间线、相册、成长记录和珍贵回忆。

---

## Project Overview｜项目简介

**AI Pet Memory Website Demo** 是一个基于 React + TypeScript 开发的前端交互原型。项目围绕宠物主人的真实使用场景展开，重点展示如何通过网页产品记录宠物陪伴过程、保存照片回忆，并在宠物离世后提供更温柔的纪念体验。

项目支持两种宠物状态：

* **Companionship Mode｜陪伴中**
* **Memorial Mode｜纪念中**

不同状态下，首页内容、视觉氛围和功能重点会发生变化。陪伴中更关注日常记录和成长管理，纪念中更关注回忆整理和情感表达。

This project is a front-end interactive demo for an AI-assisted pet memory website. It focuses on product structure, emotional user scenarios, state-based interface design, and AI-assisted front-end development.

---

## Key Features｜核心功能

### 1. User Flow｜用户流程

项目包含完整的基础使用路径：

* Login｜登录
* Register｜注册
* Create Pet Profile｜创建宠物档案
* Home｜首页
* Timeline｜时间线
* Album｜相册
* Growth Records｜成长记录

用户可以通过登录或注册进入网站，创建宠物档案后进入主页面，并通过导航栏切换不同功能模块。

---

### 2. Pet Status System｜宠物状态系统

项目中的宠物分为两种状态：**陪伴中** 和 **纪念中**。

#### Companionship Mode｜陪伴中

陪伴中状态适用于宠物仍在用户身边的情况。页面内容更偏向日常陪伴、成长记录和生活互动。

主要内容包括：

* 宠物基础信息
* 今日状态展示
* 最新回忆
* 时间线记录
* 相册照片
* 成长记录
* 生活与健康相关信息

#### Memorial Mode｜纪念中

纪念中状态适用于宠物已经离世的情况。页面内容更偏向照片回忆、纪念时间线和情感表达。

主要内容包括：

* 纪念风格首页
* 珍贵瞬间
* 纪念时间线
* 相册回忆
* 生前成长记录
* 温柔纪念文案

纪念中状态会减少实时照护、未来提醒和日常管理类内容，使页面更符合纪念场景。

---

### 3. Home Page｜首页

首页是宠物的主要展示空间。

在 **陪伴中** 状态下，首页强调宠物当前信息、日常陪伴和成长动态。

在 **纪念中** 状态下，首页强调照片回忆、纪念氛围和珍贵瞬间。

---

### 4. Timeline｜时间线

时间线用于记录宠物生命中的重要节点，例如：

* 第一次回家
* 第一次洗澡
* 生日记录
* 玩耍瞬间
* 外出散步
* 重要纪念日
* 难忘回忆

每条时间线记录以卡片形式展示，包含日期、标题、图片和简短描述。

---

### 5. Album｜相册

相册用于集中保存和展示宠物照片。

用户可以浏览宠物的不同生活瞬间，也可以通过添加照片功能扩展相册内容。相册内容还可以与首页中的“珍贵瞬间”模块形成关联，让照片在不同页面中发挥更强的情感展示作用。

---

### 6. Growth Records｜成长记录

成长记录用于保存宠物更结构化的信息，重点记录宠物成长和健康相关内容。

陪伴中状态下，成长记录可用于记录：

* 疫苗
* 驱虫
* 体检
* 绝育
* 护理
* 其他成长事件

纪念中状态下，成长记录更偏向整理宠物生前的重要记录，保留历史信息和回忆价值。

---

### 7. Drawer Interaction｜右侧抽屉交互

项目中的新增内容操作采用右侧抽屉形式，例如添加时间线、添加照片和添加成长记录。

交互特点：

* 抽屉覆盖在原页面上方
* 原页面保持原本布局
* 原页面不会缩小或左移
* 背景加入半透明遮罩
* 抽屉固定在页面右侧
* 不同宠物状态使用不同主题风格

这种交互方式可以减少页面跳转，让用户在当前页面中完成新增操作。

---

## Tech Stack｜技术栈

* React
* TypeScript
* Vite
* Tailwind CSS
* localStorage
* Mock Data
* Responsive Layout

---

## Project Structure｜项目结构

```bash
ai-pet-memory-website-demo/
├── design-reference/        # 设计参考与视觉素材
├── public/                  # 静态资源
├── src/
│   ├── assets/              # 项目图片资源
│   ├── components/          # 通用组件
│   ├── data/                # Mock 数据
│   ├── pages/               # 页面文件
│   │   ├── Album.tsx
│   │   ├── CreatePet.tsx
│   │   ├── GrowthRecords.tsx
│   │   ├── Home.tsx
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   └── Timeline.tsx
│   ├── types/               # TypeScript 类型定义
│   ├── utils/               # localStorage 等工具函数
│   ├── App.tsx              # 路由与页面入口
│   ├── main.tsx             # React 入口文件
│   └── index.css            # 全局样式
├── AGENTS.md                # AI 协作开发说明
├── DESIGN_MAP.md            # 设计映射说明
├── DESIGN_SYSTEM.md         # 设计系统说明
├── PRODUCT_SPEC.md          # 产品说明文档
├── TASKS.md                 # 开发任务拆分
├── package.json
└── README.md
```

---

## Data Design｜数据设计

项目使用 TypeScript 定义核心数据结构，主要包括：

* `User`
* `Pet`
* `TimelineEvent`
* `AlbumPhoto`
* `GrowthRecord`

这些类型用于约束页面展示、mock 数据和本地存储逻辑，使项目结构更清晰，也方便后续扩展。

---

## Getting Started｜本地运行

### 1. Clone the repository｜克隆项目

```bash
git clone https://github.com/williamqdy/ai-pet-memory-website-demo.git
cd ai-pet-memory-website-demo
```

### 2. Install dependencies｜安装依赖

```bash
npm install
```

### 3. Run the development server｜启动开发环境

```bash
npm run dev
```

### 4. Build for production｜打包项目

```bash
npm run build
```

### 5. Preview the build｜本地预览

```bash
npm run preview
```

---

## Demo Notes｜Demo 说明

本项目是前端交互 Demo，主要用于展示产品设计、页面结构、状态切换、组件交互和本地数据模拟。

项目使用 mock data 和 localStorage 模拟用户数据、宠物资料和页面内容。所有数据都保存在浏览器本地，用于支持基础交互体验。

项目未接入后端数据库、真实账号系统、云端上传、支付系统或外部 API。

---

## Product Design Logic｜产品设计思路

这个项目的关键设计点是将宠物记录拆分为两个情感场景：**陪伴中** 和 **纪念中**。

陪伴中状态更关注当下陪伴，页面内容偏向日常记录、成长信息和生活互动。

纪念中状态更关注回忆保存，页面内容偏向照片、时间线、纪念文字和生前记录。

通过这种状态区分，网站可以避免所有宠物资料都使用同一种表达方式，让页面内容更符合用户当下的情绪需求。

---

## AI-Assisted Workflow｜AI 辅助开发流程

本项目采用 AI 辅助的产品设计与前端开发流程。AI 工具主要参与以下环节：

* 产品功能拆分
* 页面结构规划
* 视觉参考生成
* 交互方案迭代
* React + TypeScript 代码辅助实现
* README 和项目文档整理

在开发过程中，AI 用于提高设计和编码效率。项目定位、功能取舍、页面逻辑、交互细节和最终内容均经过人工判断和调整。

---

## Project Highlights｜项目亮点

* 围绕宠物陪伴和离世纪念两个场景进行产品设计
* 使用“陪伴中 / 纪念中”状态系统改变页面内容和视觉风格
* 将首页、时间线、相册和成长记录拆分为清晰的信息层级
* 使用右侧抽屉完成新增内容操作，减少页面跳转
* 使用 TypeScript 类型定义组织核心数据
* 使用 localStorage 模拟前端数据持久化
* 结合 AI 工具完成从产品构思、视觉参考到前端 Demo 的完整实践

---

## Suitable For｜适用展示方向

这个项目适合作为以下方向的作品集展示：

* AI Product Manager｜AI 产品经理
* Front-end Development｜前端开发
* Interaction Design｜交互设计
* User Experience Design｜用户体验设计
* Product Prototype Design｜产品原型设计
* AI-assisted Development｜AI 工具协同开发

项目重点展示从用户场景出发，将产品需求拆解为页面结构、交互流程和前端实现的能力。

---

## Author｜作者

**Dayan Qin**

GitHub: [williamqdy](https://github.com/williamqdy)
