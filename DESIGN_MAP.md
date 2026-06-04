# Design Reference Map

All design reference images should be stored in:

public/images/design-reference/

Use these images as visual references.

Do not copy them pixel by pixel. Match:

- layout structure
- spacing
- color system
- component hierarchy
- interaction behavior
- emotional tone

---

## 1. Login / Register

### login.png

Purpose:

- Login page
- Product entry page
- Introduces the product value

Key elements:

- product name: AI宠物记忆空间
- left feature list
- large half-active / half-memorial cat illustration
- login card on the right
- username input
- password input
- 登录 button
- 立即注册 button

Feature list:

- 照片与回忆
- 成长时间线
- 日记与心情
- AI智能回顾

### login-register.png

Purpose:

- Registration page

Key elements:

- same left visual area as login page
- registration card on the right
- username
- email
- password
- confirm password
- agreement checkbox
- 立即注册 button
- 去登录 link

---

## 2. Create Pet

### create-active.png

Purpose:

- Create pet page in 陪伴中 state

Key elements:

- title: 创建 TA 的专属空间
- subtitle: 从名字开始，慢慢写下你们的故事
- orange active state switch
- center cat / dog outline
- left cards:
  - 选择小伙伴
  - 品种
  - 输入名字
- right cards:
  - 上传头像
  - 生日
  - 到家日期
- bottom button: 确认创建

### create-active-confirm.png

Purpose:

- Confirmation modal for active pet creation

Key elements:

- dark overlay
- centered modal
- pet avatar
- profile summary
- status: 陪伴中
- date field: 到家日期
- buttons:
  - 再看看
  - 确认创建

### create-memorial.png

Purpose:

- Create pet page in 纪念中 state

Key elements:

- purple theme
- status switch active on 纪念中
- center pet outline
- right date field changes to 离世日期
- bottom button: 确认创建

### create-memorial-confirm.png

Purpose:

- Confirmation modal for memorial pet creation

Key elements:

- dark overlay
- centered modal
- pet avatar
- profile summary
- status: 纪念中
- date field: 离世日期
- buttons:
  - 再看看
  - 确认创建

---

## 3. Home

### home-active-sit.png

Purpose:

- Home page in 陪伴中 state, sitting pet version

Key elements:

- orange theme
- pet header
- navigation active on 首页
- center pet image
- left cards:
  - 今日心情
  - 今日饮食
  - 今日活动
- right cards:
  - 重要日子
  - 成长小贴士
  - 最新回忆

### home-active-stand.png

Purpose:

- Home page in 陪伴中 state, standing pet version

Key elements:

- same layout as home-active-sit
- standing pet image
- all component positions should stay consistent

### home-memorial-sit.png

Purpose:

- Home page in 纪念中 state, sitting pet version

Key elements:

- purple theme
- pet with halo
- navigation active on 首页
- left emotional card
- right cards:
  - 重要日子
  - 珍贵瞬间

### home-memorial-stand.png

Purpose:

- Home page in 纪念中 state, standing pet version

Key elements:

- same memorial layout
- standing pet image with halo
- no diet / activity / growth tips
- 珍贵瞬间 card

---

## 4. Timeline

### timeline-active.png

Purpose:

- Timeline page in 陪伴中 state

Key elements:

- orange theme
- navigation active on 时间线
- left sign: 我们的美好时光
- vertical dotted line with paw nodes
- event cards
- add button: 添加时间轴

Example events:

- 第一次回家
- 第一次洗澡
- 生日快乐
- 公园散步

### timeline-active-drawer.png

Purpose:

- Add timeline drawer in 陪伴中 state

Key elements:

- dark overlay
- right-side fixed drawer
- title: 添加时间轴
- fields:
  - 事件
  - 时间
  - 照片
  - 想说的话（可选）
- buttons:
  - 取消
  - 保存
- orange theme

Strict rule:

- drawer overlays the original page
- original page must not shift or shrink

### timeline-memorial.png

Purpose:

- Timeline page in 纪念中 state

Key elements:

- purple theme
- navigation active on 时间线
- left sign: 永远在心中的美好回忆
- vertical dotted line with paw nodes
- event cards
- add button: 添加时间轴

Example events:

- 第一次回家
- 最爱的玩具
- 最后一次散步
- 想念你

### timeline-memorial-drawer.png

Purpose:

- Add timeline drawer in 纪念中 state

Key elements:

- dark overlay
- right-side fixed drawer
- title: 添加时间轴
- purple theme
- same field structure as active timeline drawer

Strict rule:

- drawer overlays the original page
- original page must not shift or shrink

---

## 5. Album

### album-active.png

Purpose:

- Album page in 陪伴中 state

Key elements:

- orange theme
- navigation active on 相册
- title: 珍贵瞬间
- add photo button
- photo grid
- first image is larger
- date labels on photos

### album-active-drawer.png

Purpose:

- Add photo drawer in 陪伴中 state

Key elements:

- dark overlay
- right-side drawer
- title: 添加照片
- upload area
- save button
- close button
- orange theme

Strict rule:

- drawer overlays original page
- original page must not move

### album-memorial.png

Purpose:

- Album page in 纪念中 state

Key elements:

- purple theme
- navigation active on 相册
- title: 珍贵瞬间
- add photo button
- photo grid

### album-memorial-drawer.png

Purpose:

- Add photo drawer in 纪念中 state

Key elements:

- dark overlay
- right-side drawer
- title: 添加照片
- upload area
- save button
- close button
- purple theme

Strict rule:

- drawer overlays original page
- original page must not move

---

## 6. Diary

### diary-active-noRecords.png

Purpose:

- Diary page in 陪伴中 empty state

Key elements:

- orange theme
- navigation active on 日记
- writing entry card
- 写日记 button
- empty state illustration
- empty state text

### diary-active.png

Purpose:

- Diary page in 陪伴中 state with records

Key elements:

- diary entry card at top
- diary card grid
- cards include:
  - date
  - weekday
  - time
  - text
  - optional image

### diary-memorial.png

Purpose:

- Diary page in 纪念中 empty state

Key elements:

- purple theme
- navigation active on 日记
- writing entry card
- 写日记 button
- memorial empty state text

### diary-memorial-withRecords.png

Purpose:

- Diary page in 纪念中 state with records

Key elements:

- purple theme
- diary card grid
- more emotional writing tone
- optional image in diary card

---

## 7. Growth Records

### growth-active.png

Purpose:

- Growth Records page in 陪伴中 state

Key elements:

- orange theme
- navigation active on 成长记录
- left health overview card
- category chips:
  - 全部
  - 疫苗
  - 驱虫
  - 体检
  - 绝育
  - 护理
  - 其他
- add button: 添加记录
- record list
- next reminder
- completed status

### growth-active-drawer.png

Purpose:

- Add Growth Record drawer in 陪伴中 state

Key elements:

- dark overlay
- right-side fixed drawer
- title: 添加成长记录
- record type chips
- fields:
  - 记录名称
  - 疫苗种类 / 项目
  - 记录日期
  - 下次提醒
  - 接种地点（可选）
  - 备注（可选）
- buttons:
  - 取消
  - 保存记录

Strict rule:

- drawer overlays original page
- original page must not move, shrink, or reflow

### growth-memorial.png

Purpose:

- Growth Records page in 纪念中 state

Key elements:

- purple theme
- navigation active on 成长记录
- left health overview card
- category chips:
  - 全部
  - 健康
  - 就诊
  - 护理
  - 体检
  - 疫苗/绝育
  - 其他
- add button: 补充生前记录
- record list
- record date

### growth-memorial-drawer.png

Purpose:

- Add Growth Record drawer in 纪念中 state

Key elements:

- dark overlay
- right-side fixed drawer
- title: 补充一条记录
- fields:
  - 记录类型
  - 记录名称
  - 记录日期
  - 项目说明 / 检查项目
  - 地点（可选）
  - 备注（可选）
- buttons:
  - 取消
  - 保存记录

Strict rule:

- drawer overlays original page
- original page must not move, shrink, or reflow

---

## 8. Global Design Rules

### 8.1 Color Themes

陪伴中:

- primary orange
- cream background
- warm field illustration
- orange active icons and buttons

纪念中:

- primary purple
- lavender background
- floral / star / rainbow illustration
- purple active icons and buttons

### 8.2 Shared Components

Use reusable components for:

- AppHeader
- StateSwitch
- MainNav
- Card
- Drawer
- Modal
- UploadBox
- EmptyState
- TimelineCard
- PhotoCard
- DiaryCard
- GrowthRecordCard
- CategoryChip

### 8.3 Drawer Rule

All drawers must use the same interaction pattern:

- fixed overlay mask
- fixed right-side drawer
- no layout shift
- no page compression
- no page resize
- high z-index