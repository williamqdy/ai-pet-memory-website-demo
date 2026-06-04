# AI Pet Memory Website Demo Product Spec

## 1. Project Overview

This is an interactive front-end demo for an AI pet memory website.

Product UI name:

- AI宠物记忆空间

The product gives each pet a dedicated digital space. It supports two emotional states:

- 陪伴中
- 纪念中

The website helps pet owners record daily companionship, preserve photos, write diaries, manage growth and health records, and continue emotional memory after a pet has passed away.

This project is a front-end interactive demo only.

Do not build:

- backend
- real database
- real authentication service
- payment system
- cloud upload
- external API integration

Use mock data and localStorage for demo persistence.

---

## 2. Product Positioning

AI宠物记忆空间 is a warm, emotional, pet-centered memory website.

The product focuses on:

- pet companionship
- emotional memory
- photo preservation
- growth timeline
- diary writing
- health and growth record keeping
- memorial continuation

The product should feel soft, healing, emotional, and personal. It should not feel like a cold admin dashboard or a medical management system.

---

## 3. Core Product Concept

The entire product is built around two pet states.

### 3.1 陪伴中

This state is used when the pet is still living with the owner.

Emotional direction:

- warm
- active
- daily
- healing
- lively
- close to real pet care life

Visual direction:

- warm orange
- cream white
- soft yellow
- light green field background
- flowers, hills, butterflies, sunlight

Content emphasis:

- daily mood
- food
- activities
- birthday countdown
- growth tips
- latest memories
- active timeline
- album
- diary
- growth records

### 3.2 纪念中

This state is used when the pet has passed away.

Emotional direction:

- calm
- gentle
- respectful
- commemorative
- emotionally warm
- quiet but not gloomy

Visual direction:

- soft purple
- lavender
- misty white
- stars
- rainbow
- soft clouds
- flowers
- halo or angel-like visual detail

Content emphasis:

- precious memories
- emotional writing
- past moments
- memorial timeline
- diary letters
- life records
- photo memories

Avoid:

- cold archive wording
- overly sad tone
- hospital-like interface
- administrative wording

---

## 4. Target Users

Primary users:

- pet owners who want to record daily life with their pets
- pet owners who want to preserve memories after a pet has passed away
- users who value emotional companionship and visual memory preservation
- users who want a private and warm digital space for one pet

Potential user motivations:

- record a pet’s growth
- keep photos organized
- write emotional diary entries
- preserve special moments
- review memories after loss
- keep health and care records in one place

---

## 5. Demo Scope

The demo includes these pages and interactions:

1. Login page
2. Register page
3. Create Pet page
4. Create Pet confirmation modal
5. Pet Home page
6. Timeline page
7. Add Timeline drawer
8. Album page
9. Add Photo drawer
10. Diary page
11. Growth Records page
12. Add Growth Record drawer

Main navigation after pet creation:

- 首页
- 时间线
- 相册
- 日记
- 成长记录

The following parts are shown visually but do not need full implementation in the first demo:

- 通知
- 我的
- forgot password
- real image upload to cloud
- real AI-generated content
- multi-user system
- multi-pet management

---

## 6. User Flow

### 6.1 Login Flow

1. User enters the website.
2. User sees the login page.
3. User enters username and password.
4. User clicks 登录.
5. If a pet profile exists in localStorage, route to Home page.
6. If no pet profile exists, route to Create Pet page.

For demo purposes:

- login can be fake
- no real authentication is required
- basic empty field validation is enough

### 6.2 Register Flow

1. User clicks 立即注册 on the login page.
2. The right panel changes to the registration form.
3. User enters:
   - username
   - email
   - password
   - confirm password
4. User checks the agreement checkbox.
5. User clicks 立即注册.
6. User enters the Create Pet page.

For demo purposes:

- registration can be fake
- no real email verification is required
- store a basic user object in localStorage if needed

### 6.3 Create Pet Flow

1. User enters the Create Pet page.
2. User chooses pet state:
   - 陪伴中
   - 纪念中
3. User fills pet information.
4. User clicks 确认创建.
5. A confirmation modal appears.
6. User clicks:
   - 再看看: close modal and continue editing
   - 确认创建: save pet profile and enter Home page

### 6.4 Main App Flow

1. User enters pet Home page.
2. User can switch between 陪伴中 and 纪念中.
3. User can navigate to:
   - 首页
   - 时间线
   - 相册
   - 日记
   - 成长记录
4. User can add timeline events.
5. User can add photos.
6. User can view diary empty state or diary cards.
7. User can view growth records.
8. User can add growth records.
9. Data persists in localStorage.

---

## 7. Global Layout

After pet creation, all main pages share the same global structure.

### 7.1 Header Area

The top header contains:

- pet avatar
- pet name
- sex icon
- pet breed
- pet age
- state title: 陪伴中 / 纪念中
- status switch
- 通知
- 我的

The header background changes by state.

陪伴中 header:

- warm orange field background
- flowers
- hills
- butterfly
- active pet illustration in some pages

纪念中 header:

- purple floral background
- stars
- rainbow
- soft clouds
- memorial pet illustration in some pages

### 7.2 Status Switch

The status switch has two options:

- 陪伴中
- 纪念中

Rules:

1. Active state controls page color theme.
2. Active state controls page copywriting.
3. Active state controls which modules are shown.
4. Active state persists across pages.
5. Switching state should not break layout alignment.
6. State switch position should remain consistent across all main pages.

### 7.3 Main Navigation

Navigation items:

- 首页
- 时间线
- 相册
- 日记
- 成长记录

Rules:

1. Navigation position must stay consistent across all main pages.
2. Active tab uses theme color.
3. 陪伴中 uses orange active state.
4. 纪念中 uses purple active state.
5. Icons should stay visually consistent.
6. Navigation should not be moved or resized when state changes.

---

## 8. Login Page

### 8.1 Page Goal

Allow the user to enter the website and introduce the product concept.

### 8.2 Layout

The login page is split into two visual areas.

Left side:

- product name: AI宠物记忆空间
- large pet illustration
- visual concept: half active pet, half memorial pet
- feature list

Right side:

- login card
- logo
- title: 欢迎回来
- subtitle: 登录你的宠物记忆空间
- username input
- password input
- forgot password link
- 登录 button
- 立即注册 button
- user agreement text

### 8.3 Left Feature List

Feature items shown in the design:

1. 照片与回忆
   - 珍藏每个美好瞬间

2. 成长时间线
   - 记录成长的每一步

3. 日记与心情
   - 写下爱的点点滴滴

4. AI智能回顾
   - 智能生成回忆相册

### 8.4 Login Form Fields

Fields:

- 用户名
- 密码

Additional UI:

- password visibility icon
- 忘记密码 link
- 登录 button
- 立即注册 button

For demo:

- clicking 登录 can directly enter Create Pet page or Home page
- no real server validation required
- basic empty validation is acceptable

---

## 9. Register Page

### 9.1 Page Goal

Allow the user to create a demo account.

### 9.2 Layout

The left visual area stays the same as the login page.

The right card changes to registration mode.

### 9.3 Register Form Fields

Fields:

- 用户名
- 邮箱地址
- 密码
- 确认密码
- user agreement checkbox

### 9.4 Buttons and Links

Buttons and links:

- 立即注册
- 去登录

For demo:

- clicking 去登录 switches back to login form
- clicking 立即注册 enters Create Pet page after simple validation

---

## 10. Create Pet Page

### 10.1 Page Goal

Help the user create a dedicated space for a pet.

### 10.2 Common Structure

The page contains:

- title: 创建 TA 的专属空间
- subtitle: 从名字开始，慢慢写下你们的故事
- state switch: 陪伴中 / 纪念中
- center pet silhouette illustration
- left information cards
- right information cards
- confirm creation button

### 10.3 Common Fields

Common fields:

- 选择小伙伴
  - 猫咪
  - 狗狗

- 品种
  - choose or input breed

- 输入名字
  - pet name

- 上传头像
  - upload pet avatar

- 生日
  - pet birthday

### 10.4 陪伴中 Specific Field

Field:

- 到家日期

### 10.5 纪念中 Specific Field

Field:

- 离世日期

### 10.6 Theme Rules

陪伴中:

- orange theme
- warm field background
- active pet atmosphere

纪念中:

- purple theme
- lavender flower field background
- calm memorial atmosphere

---

## 11. Create Pet Confirmation Modal

### 11.1 Trigger

Click 确认创建 on the Create Pet page.

### 11.2 Behavior

1. The page background becomes darkened.
2. A centered modal appears.
3. The modal displays the pet profile summary.
4. The user can confirm or go back.

### 11.3 Modal Content

Modal content:

- pet avatar
- name
- type
- breed
- state
- birthday
- arrival date or memorial date

陪伴中 modal field:

- 到家日期

纪念中 modal field:

- 离世日期

### 11.4 Buttons

Buttons:

- 再看看
- 确认创建

Button behavior:

- 再看看 closes the modal.
- 确认创建 saves the pet profile and enters Home page.

---

## 12. Home Page

### 12.1 Page Goal

Show the pet's main emotional space and state-based dashboard.

### 12.2 陪伴中 Home

Main content:

Left column:

1. 今日心情
2. 今日饮食
3. 今日活动

Center:

- large pet image
- pet name
- breed
- age

Right column:

1. 重要日子
2. 成长小贴士
3. 最新回忆

Example content:

- 重要日子: 距离生日还有 48 天
- 今日心情: 开心
- 今日饮食: 已记录
- 今日活动: 散步 30 分钟

### 12.3 纪念中 Home

Main content:

Left column:

1. 今日心情 / emotional message card
2. gentle memorial text

Center:

- large pet image
- halo above pet
- memorial flower background
- pet name
- breed
- age

Right column:

1. 重要日子
2. 珍贵瞬间 photo card

纪念中 should remove:

- 今日饮食
- 今日活动
- 成长小贴士
- 最新回忆

纪念中 should use:

- 珍贵瞬间
- quiet emotional message
- memorial visual style

---

## 13. Timeline Page

### 13.1 Page Goal

Display important pet memories in chronological order.

Timeline is a core emotional page.

### 13.2 Common Layout

The page contains:

- global header
- main navigation
- left decorative sign
- vertical dotted timeline line
- paw nodes
- timeline event cards
- add timeline button

The timeline layout should stay spacious and horizontal web-friendly.

### 13.3 陪伴中 Timeline

Theme:

- orange
- warm
- active daily memory

Left sign text:

- 我们的美好时光

Button:

- 添加时间轴

Timeline examples shown:

1. 第一次回家
2. 第一次洗澡
3. 生日快乐
4. 公园散步

Card structure:

- image
- date
- title
- short note
- decorative icon

### 13.4 纪念中 Timeline

Theme:

- purple
- calm
- memorial memory

Left sign text:

- 永远在心中的美好回忆

Button:

- 添加时间轴

Timeline examples shown:

1. 第一次回家
2. 最爱的玩具
3. 最后一次散步
4. 想念你

Card structure:

- image
- date
- title
- short note
- decorative icon

---

## 14. Add Timeline Drawer

### 14.1 Trigger

Click 添加时间轴 on Timeline page.

### 14.2 Behavior

This is a right-side drawer.

Strict interaction rules:

1. The drawer overlays the original page.
2. The drawer must not push the original page.
3. The drawer must not resize the original page.
4. The drawer must not shift the original page left.
5. Add a semi-transparent dark mask above the page.
6. Drawer appears above the mask.
7. Drawer right edge aligns with the viewport right edge.

### 14.3 Fields

Required fields:

- 事件
- 时间
- 照片

Optional field:

- 想说的话

### 14.4 Upload Rules

For timeline photo upload:

- support JPG
- support PNG
- HEIC can be shown in UI text if needed
- max 5MB based on design reference

For demo, local preview is acceptable. No real cloud upload is required.

### 14.5 Character Limits

Character limits:

- event title: 30 characters
- note: 200 characters

### 14.6 Buttons

Buttons:

- 取消
- 保存

Theme:

- orange in 陪伴中
- purple in 纪念中

---

## 15. Album Page

### 15.1 Page Goal

Display pet photos as emotional memory cards.

### 15.2 Common Layout

The page contains:

- global header
- navigation
- title: 珍贵瞬间
- add photo button
- photo grid

### 15.3 Photo Card

Photo cards can include:

- image
- date label
- heart decoration

The first photo can be larger than the rest, based on the design.

### 15.4 陪伴中 Album

Theme:

- orange
- warm photo tone

Button:

- 添加照片

### 15.5 纪念中 Album

Theme:

- purple
- softer photo tone

Button:

- 添加照片

---

## 16. Add Photo Drawer

### 16.1 Trigger

Click 添加照片 on Album page.

### 16.2 Behavior

Right-side drawer interaction.

Strict rules:

1. Drawer overlays the original page.
2. Original page does not move.
3. Original page does not shrink.
4. Original page does not reflow.
5. Background has semi-transparent dark overlay.
6. Drawer uses fixed positioning.

### 16.3 Drawer Content

Drawer content:

- title: 添加照片
- upload area
- upload hint
- save button
- close button

### 16.4 Upload Text

The design has two file size versions:

- 10MB
- 20MB

For consistency in implementation, use:

- 支持 JPG、PNG 格式，单张不超过 20MB

For demo:

- local preview is acceptable
- no actual cloud upload is required

---

## 17. Diary Page

### 17.1 Page Goal

Allow users to record written memories and daily feelings.

### 17.2 Common Layout

The page contains:

- global header
- navigation
- top writing entry card
- diary empty state or diary card list

### 17.3 Writing Entry Card

The top entry card includes:

- current date
- weekday
- prompt text
- decorative illustration
- 写日记 button

陪伴中 prompt example:

- 写下今天和奶糖的故事...

纪念中 prompt example:

- 写下今天想对奶糖说的话...

### 17.4 Empty State

陪伴中 empty state:

- 还没有日记，快来记录毛孩子的可爱瞬间吧～

纪念中 empty state:

- 还没有日记，来记录那些关于毛孩子的温柔瞬间吧～

### 17.5 Diary Cards

Each diary card can include:

- date
- weekday
- time
- text content
- optional image
- decorative icon

### 17.6 Diary Content Style

陪伴中:

- daily story
- playful tone
- real-time companionship

纪念中:

- emotional letter
- memory
- longing
- gentle remembrance

---

## 18. Growth Records Page

### 18.1 Page Goal

Record pet health, care, medical, and growth-related information.

### 18.2 Common Layout

The page contains:

- global header
- navigation
- left health overview card
- category filter chips
- record list
- add record button

### 18.3 陪伴中 Growth Records

Theme:

- orange

Button:

- 添加记录

Left overview card:

- 总记录
- 待提醒
- 最近记录

Category filters:

- 全部
- 疫苗
- 驱虫
- 体检
- 绝育
- 护理
- 其他

Record card can include:

- icon
- title
- description
- record date
- next reminder
- status label
- more button

Example records:

- 疫苗接种
- 体内驱虫
- 年度体检
- 绝育手术

### 18.4 纪念中 Growth Records

Theme:

- purple

Button:

- 补充生前记录

Left overview card:

- 总记录
- 最近记录

Category filters:

- 全部
- 健康
- 就诊
- 护理
- 体检
- 疫苗/绝育
- 其他

Record card can include:

- icon
- title
- description
- record date
- more button

Avoid future reminder emphasis in memorial mode.

---

## 19. Add Growth Record Drawer

### 19.1 Trigger

Click 添加记录 or 补充生前记录.

### 19.2 Behavior

This is a right-side drawer.

Strict rules:

1. Drawer overlays the original page.
2. Drawer must not push the main page.
3. Drawer must not shrink the main page.
4. Drawer must not shift layout.
5. Background uses semi-transparent dark overlay.
6. Drawer width should be around 30%–35% of viewport width.
7. Drawer should be fixed to the right side.

### 19.3 陪伴中 Drawer

Title:

- 添加成长记录

Subtitle:

- 记录奶糖的一次健康或护理事项

Fields:

- 记录类型
- 记录名称
- 疫苗种类 / 项目
- 记录日期
- 下次提醒
- 接种地点（可选）
- 备注（可选）

Record types:

- 疫苗
- 驱虫
- 体检
- 绝育
- 护理
- 其他

Buttons:

- 取消
- 保存记录

### 19.4 纪念中 Drawer

Title:

- 补充一条记录

Subtitle:

- 记录奶糖曾经的一次健康或护理事项

Fields:

- 记录类型
- 记录名称
- 记录日期
- 项目说明 / 检查项目
- 地点（可选）
- 备注（可选）

Record types:

- 健康
- 就诊
- 护理
- 体检
- 疫苗/绝育
- 其他

Buttons:

- 取消
- 保存记录

---

## 20. Data Model

### 20.1 User

Type shape:

    type User = {
      id: string
      username: string
      email?: string
    }

### 20.2 Pet

Type shape:

    type Pet = {
      id: string
      name: string
      type: 'cat' | 'dog'
      breed: string
      sex: 'male' | 'female'
      avatar: string
      status: 'active' | 'memorial'
      birthday: string
      arrivalDate?: string
      memorialDate?: string
    }

### 20.3 Timeline Event

Type shape:

    type TimelineEvent = {
      id: string
      petId: string
      title: string
      date: string
      image: string
      note?: string
      status: 'active' | 'memorial'
    }

### 20.4 Album Photo

Type shape:

    type AlbumPhoto = {
      id: string
      petId: string
      image: string
      date: string
      note?: string
      status: 'active' | 'memorial'
    }

### 20.5 Diary Entry

Type shape:

    type DiaryEntry = {
      id: string
      petId: string
      date: string
      weekday: string
      time?: string
      content: string
      image?: string
      status: 'active' | 'memorial'
    }

### 20.6 Growth Record

Type shape:

    type GrowthRecord = {
      id: string
      petId: string
      category: string
      title: string
      description: string
      recordDate: string
      nextReminder?: string
      location?: string
      note?: string
      completed?: boolean
      status: 'active' | 'memorial'
    }

---

## 21. Storage Rules

Use localStorage keys:

- petMemory:user
- petMemory:pet
- petMemory:status
- petMemory:timelineEvents
- petMemory:albumPhotos
- petMemory:diaryEntries
- petMemory:growthRecords

Rules:

1. Use mock data on first load.
2. Save user-created records to localStorage.
3. Keep demo stable after page refresh.
4. Do not connect to backend.

---

## 22. Development Priority

Build order:

1. Login / Register
2. Create Pet
3. Shared main layout
4. Home page
5. Timeline page
6. Album page
7. Diary page
8. Growth Records page
9. Drawers and modal interactions
10. localStorage persistence
11. visual polish
12. README
13. deployment

---

## 23. Strict UI Rules

### 23.1 Drawer Rule

All right-side drawers must overlay the original page.

Do not implement drawers inside the main flex layout.

Use:

- fixed positioning
- full-screen overlay mask
- drawer with fixed right positioning
- correct z-index layering

### 23.2 Layout Rule

The original page must never be:

- resized
- compressed
- shifted left
- reflowed
- narrowed

when a drawer opens.

### 23.3 State Consistency Rule

When switching between 陪伴中 and 纪念中:

- navigation position stays unchanged
- header layout stays stable
- page content changes according to state
- theme color changes
- state persists across pages