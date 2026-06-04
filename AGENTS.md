# AGENTS

## 1. Project Identity

This is a React + Vite + TypeScript + Tailwind CSS front-end demo for an AI pet memory website.

Product name in UI:

- AI宠物记忆空间

The demo supports two states:

- 陪伴中
- 纪念中

This is a front-end demo only.

Do not add backend, database, real authentication, payment system, or external APIs unless explicitly requested.

---

## 2. Required Reading Before Major Changes

Before implementing or modifying pages, read:

1. PRODUCT_SPEC.md
2. DESIGN_MAP.md
3. TASKS.md
4. AGENTS.md

Use design images in:

public/images/design-reference/

as visual references.

---

## 3. Commands

Use these commands:

    npm install
    npm run dev
    npm run build

Before finishing a task, always run:

    npm run build

If build fails, fix the issue before completing the task.

---

## 4. Technical Stack

Use:

- React
- Vite
- TypeScript
- Tailwind CSS
- localStorage

Do not add heavy dependencies unless necessary.

Acceptable lightweight libraries:

- react-router-dom
- lucide-react

Avoid:

- backend frameworks
- database clients
- authentication SDKs
- payment SDKs
- unnecessary UI kits
- complex animation libraries

---

## 5. Folder Structure

Use this structure:

    src/
    ├── components/
    ├── pages/
    ├── data/
    ├── types/
    ├── utils/
    ├── App.tsx
    ├── main.tsx
    └── index.css

Recommended components:

    components/
    ├── AppHeader.tsx
    ├── MainLayout.tsx
    ├── MainNav.tsx
    ├── StateSwitch.tsx
    ├── Card.tsx
    ├── Drawer.tsx
    ├── Modal.tsx
    ├── UploadBox.tsx
    ├── EmptyState.tsx
    ├── TimelineCard.tsx
    ├── PhotoCard.tsx
    ├── DiaryCard.tsx
    ├── GrowthRecordCard.tsx
    └── CategoryChip.tsx

Recommended pages:

    pages/
    ├── Login.tsx
    ├── Register.tsx
    ├── CreatePet.tsx
    ├── Home.tsx
    ├── Timeline.tsx
    ├── Album.tsx
    ├── Diary.tsx
    └── GrowthRecords.tsx

---

## 6. Visual Style Rules

The product should feel:

- soft
- warm
- healing
- emotional
- cartoon-like
- spacious
- card-based

Avoid:

- dense admin dashboard style
- cold medical system style
- sharp enterprise UI
- too many hard borders
- overly technical language

---

## 7. Theme Rules

### 7.1 陪伴中

Use:

- warm orange
- cream background
- light yellow
- soft field and flower atmosphere

Content style:

- daily companionship
- activity
- food
- mood
- birthday countdown
- growth tips
- latest memories

### 7.2 纪念中

Use:

- lavender purple
- soft white
- star / rainbow / flower atmosphere

Content style:

- memory
- longing
- emotional writing
- precious moments
- past records

Do not use cold archive wording.

---

## 8. Global Layout Rules

After pet creation, all main pages must share:

- same header structure
- same navigation position
- same state switch position
- same page width logic
- same rounded outer container feeling
- same general spacing system

The navigation contains:

- 首页
- 时间线
- 相册
- 日记
- 成长记录

Active nav item changes by page.

Active color changes by pet state:

- orange for 陪伴中
- purple for 纪念中

---

## 9. State Switch Rules

The state switch controls:

- theme color
- page background
- title style
- content modules
- button copy
- category labels
- drawer style

State must persist across pages.

Use localStorage key:

    petMemory:status

Allowed values:

    active
    memorial

---

## 10. Strict Drawer Rule

This is critical.

All right-side drawers must overlay the original page.

The original page must never be:

- pushed
- resized
- compressed
- shifted left
- narrowed
- reflowed

Do not place drawers inside the main flex layout.

Use fixed positioning.

Expected CSS logic:

    .overlay {
      position: fixed;
      inset: 0;
      z-index: 40;
    }

    .drawer {
      position: fixed;
      top: 0;
      right: 0;
      height: 100vh;
      width: 30vw;
      z-index: 50;
    }

Drawer width can be adjusted between:

- 30vw
- 35vw

The overlay should darken the full page.

The drawer should appear above the overlay.

---

## 11. Modal Rule

Create Pet confirmation uses a centered modal.

Modal behavior:

- dark overlay
- modal centered
- original page inactive
- no layout shift

Use modal for create confirmation only.

Use drawer for:

- add timeline
- add photo
- add growth record

---

## 12. Data Persistence Rules

Use localStorage only.

Recommended keys:

- petMemory:user
- petMemory:pet
- petMemory:status
- petMemory:timelineEvents
- petMemory:albumPhotos
- petMemory:diaryEntries
- petMemory:growthRecords

Use mock data on first load.

User-created data should be saved locally.

No backend required.

---

## 13. Page Implementation Rules

### 13.1 Login / Register

Login and register are demo-only.

Do not build real authentication.

Login button can route to Create Pet or Home depending on whether pet profile exists.

Register button can route to Create Pet.

### 13.2 Create Pet

Must support:

- 陪伴中
- 纪念中

When state is 陪伴中, show 到家日期.

When state is 纪念中, show 离世日期.

Clicking 确认创建 opens confirmation modal.

Final confirmation saves pet profile.

### 13.3 Home

陪伴中 home includes:

- 今日心情
- 今日饮食
- 今日活动
- 重要日子
- 成长小贴士
- 最新回忆

纪念中 home includes:

- emotional card
- 重要日子
- 珍贵瞬间

纪念中 home must not show:

- 今日饮食
- 今日活动
- 成长小贴士
- 最新回忆

### 13.4 Timeline

Timeline must support both states.

陪伴中 copy should feel daily and lively.

纪念中 copy should feel calm and memorial.

Add Timeline drawer must use the strict drawer rule.

### 13.5 Album

Album title:

- 珍贵瞬间

Add Photo drawer must use the strict drawer rule.

Photo grid should be visually dominant.

Do not add unnecessary category tabs.

### 13.6 Diary

Diary supports:

- empty state
- record state

Diary cards can contain:

- date
- weekday
- time
- text
- optional image

Do not add too many predefined options.

Diary should feel user-written.

### 13.7 Growth Records

Growth records support both states.

陪伴中 button:

- 添加记录

纪念中 button:

- 补充生前记录

Growth drawer must use the strict drawer rule.

---

## 14. Code Style

Use:

- React functional components
- TypeScript types
- reusable components
- small files
- clear props

Avoid:

- putting all page code in one file
- hardcoding repeated UI when components can be reused
- mixing unrelated page logic
- adding unnecessary global CSS

---

## 15. Review Checklist

Before finishing each task, check:

1. Does npm run build pass?
2. Does the app still run with npm run dev?
3. Did navigation alignment remain consistent?
4. Did state switch alignment remain consistent?
5. Does 陪伴中 theme stay orange?
6. Does 纪念中 theme stay purple?
7. Do drawers overlay instead of pushing the page?
8. Does create modal appear centered?
9. Does localStorage persistence still work?
10. Did the task avoid unrelated redesign?

---

## 16. Git Practice

After each completed phase:

    git status
    git add .
    git commit -m "Meaningful commit message"

Suggested commit messages:

- Initial project setup
- Add login and register pages
- Add create pet flow
- Add shared app layout
- Add home page
- Add timeline page
- Add timeline drawer
- Add album page
- Add album drawer
- Add diary page
- Add growth records page
- Add growth records drawer
- Add localStorage persistence
- Polish visual consistency
- Add README and deployment notes

---

## 17. Do Not Do These

Do not:

- add backend
- add real database
- add real authentication
- add payment
- add complex user system
- redesign the visual style
- change the main navigation structure
- compress original pages when drawers open
- add unrelated features
- turn the product into a medical dashboard
- make memorial mode visually cold or gloomy