# Project Tasks

## Phase 0: Preparation

- [ ] Confirm all design reference images are placed in `public/images/design-reference/`
- [ ] Confirm image filenames match `DESIGN_MAP.md`
- [ ] Confirm `PRODUCT_SPEC.md`, `DESIGN_MAP.md`, `TASKS.md`, and `AGENTS.md` are in the project root
- [ ] Confirm `npm run dev` works
- [ ] Confirm `npm run build` works
- [ ] Make first Git commit

---

## Phase 1: Basic Project Structure

- [ ] Create `src/components`
- [ ] Create `src/pages`
- [ ] Create `src/data`
- [ ] Create `src/types`
- [ ] Create `src/utils`
- [ ] Create shared TypeScript types
- [ ] Create mock data
- [ ] Create localStorage utilities
- [ ] Add route structure
- [ ] Add basic placeholder pages
- [ ] Run `npm run build`
- [ ] Commit: `Add project structure`

---

## Phase 2: Login and Register

- [ ] Implement login page based on `login.png`
- [ ] Implement register page based on `login-register.png`
- [ ] Add fake login behavior
- [ ] Add fake registration behavior
- [ ] Add switch between login and register
- [ ] Add basic empty field validation
- [ ] Route successful login/register to Create Pet page
- [ ] Run `npm run build`
- [ ] Commit: `Add login and register pages`

---

## Phase 3: Create Pet Flow

- [ ] Implement Create Pet page based on `create-active.png`
- [ ] Implement memorial version based on `create-memorial.png`
- [ ] Add state switch: 陪伴中 / 纪念中
- [ ] Add form fields:
  - [ ] pet type
  - [ ] breed
  - [ ] name
  - [ ] avatar
  - [ ] birthday
  - [ ] arrival date
  - [ ] memorial date
- [ ] Add confirmation modal based on `create-active-confirm.png`
- [ ] Add memorial confirmation modal based on `create-memorial-confirm.png`
- [ ] Save pet profile to localStorage
- [ ] Route confirmed creation to Home page
- [ ] Run `npm run build`
- [ ] Commit: `Add create pet flow`

---

## Phase 4: Shared Main App Layout

- [ ] Create shared `AppHeader`
- [ ] Create shared `StateSwitch`
- [ ] Create shared `MainNav`
- [ ] Create shared `MainLayout`
- [ ] Header should display:
  - [ ] avatar
  - [ ] pet name
  - [ ] sex
  - [ ] breed
  - [ ] age
  - [ ] current state
  - [ ] notification
  - [ ] my account
- [ ] Navigation should include:
  - [ ] 首页
  - [ ] 时间线
  - [ ] 相册
  - [ ] 日记
  - [ ] 成长记录
- [ ] Active nav item should use current theme color
- [ ] State switch should persist across pages
- [ ] Run `npm run build`
- [ ] Commit: `Add shared app layout`

---

## Phase 5: Home Page

- [ ] Implement active home page based on `home-active-sit.png`
- [ ] Implement active standing visual option based on `home-active-stand.png`
- [ ] Implement memorial home page based on `home-memorial-sit.png`
- [ ] Implement memorial standing visual option based on `home-memorial-stand.png`
- [ ] Add active home modules:
  - [ ] 今日心情
  - [ ] 今日饮食
  - [ ] 今日活动
  - [ ] 重要日子
  - [ ] 成长小贴士
  - [ ] 最新回忆
- [ ] Add memorial home modules:
  - [ ] 情绪表达卡
  - [ ] 重要日子
  - [ ] 珍贵瞬间
- [ ] Ensure memorial mode removes:
  - [ ] 今日饮食
  - [ ] 今日活动
  - [ ] 成长小贴士
  - [ ] 最新回忆
- [ ] Run `npm run build`
- [ ] Commit: `Add home page`

---

## Phase 6: Timeline Page

- [ ] Implement active timeline based on `timeline-active.png`
- [ ] Implement memorial timeline based on `timeline-memorial.png`
- [ ] Add timeline list layout
- [ ] Add left decorative sign
- [ ] Add dotted timeline line
- [ ] Add paw nodes
- [ ] Add timeline event cards
- [ ] Add active sample events
- [ ] Add memorial sample events
- [ ] Add 添加时间轴 button
- [ ] Run `npm run build`
- [ ] Commit: `Add timeline page`

---

## Phase 7: Add Timeline Drawer

- [ ] Implement active drawer based on `timeline-active-drawer.png`
- [ ] Implement memorial drawer based on `timeline-memorial-drawer.png`
- [ ] Add drawer fields:
  - [ ] 事件
  - [ ] 时间
  - [ ] 照片
  - [ ] 想说的话
- [ ] Add validation for required fields
- [ ] Add character limit for event title
- [ ] Add character limit for note
- [ ] Save timeline event to localStorage
- [ ] Ensure drawer overlays page without shifting layout
- [ ] Run `npm run build`
- [ ] Commit: `Add timeline drawer`

---

## Phase 8: Album Page

- [ ] Implement active album based on `album-active.png`
- [ ] Implement memorial album based on `album-memorial.png`
- [ ] Add photo grid
- [ ] Add larger first photo
- [ ] Add date labels
- [ ] Add heart decoration where appropriate
- [ ] Add 添加照片 button
- [ ] Load album photos from mock data and localStorage
- [ ] Run `npm run build`
- [ ] Commit: `Add album page`

---

## Phase 9: Add Photo Drawer

- [ ] Implement active drawer based on `album-active-drawer.png`
- [ ] Implement memorial drawer based on `album-memorial-drawer.png`
- [ ] Add upload area
- [ ] Add save button
- [ ] Add close button
- [ ] Add local preview if simple to implement
- [ ] Save uploaded photo record to localStorage
- [ ] Ensure drawer overlays page without shifting layout
- [ ] Run `npm run build`
- [ ] Commit: `Add album drawer`

---

## Phase 10: Diary Page

- [ ] Implement active empty state based on `diary-active-noRecords.png`
- [ ] Implement active record state based on `diary-active.png`
- [ ] Implement memorial empty state based on `diary-memorial.png`
- [ ] Implement memorial record state based on `diary-memorial-withRecords.png`
- [ ] Add writing entry card
- [ ] Add diary cards
- [ ] Add optional image support in diary cards
- [ ] Add empty state text by state
- [ ] Load diary entries from mock data and localStorage
- [ ] Run `npm run build`
- [ ] Commit: `Add diary page`

---

## Phase 11: Growth Records Page

- [ ] Implement active growth page based on `growth-active.png`
- [ ] Implement memorial growth page based on `growth-memorial.png`
- [ ] Add health overview card
- [ ] Add category chips
- [ ] Add record list
- [ ] Add record cards
- [ ] Add 添加记录 button for active mode
- [ ] Add 补充生前记录 button for memorial mode
- [ ] Load growth records from mock data and localStorage
- [ ] Run `npm run build`
- [ ] Commit: `Add growth records page`

---

## Phase 12: Add Growth Record Drawer

- [ ] Implement active drawer based on `growth-active-drawer.png`
- [ ] Implement memorial drawer based on `growth-memorial-drawer.png`
- [ ] Add dynamic record type chips
- [ ] Add active form fields
- [ ] Add memorial form fields
- [ ] Add validation
- [ ] Save record to localStorage
- [ ] Ensure drawer overlays page without shifting layout
- [ ] Run `npm run build`
- [ ] Commit: `Add growth records drawer`

---

## Phase 13: State and Storage

- [ ] Persist pet status in localStorage
- [ ] Persist pet profile in localStorage
- [ ] Persist timeline events
- [ ] Persist album photos
- [ ] Persist diary entries
- [ ] Persist growth records
- [ ] Use mock data on first load
- [ ] Ensure page refresh keeps data
- [ ] Run `npm run build`
- [ ] Commit: `Add localStorage persistence`

---

## Phase 14: Visual Polish

- [ ] Align header across all pages
- [ ] Align nav across all pages
- [ ] Align state switch across all pages
- [ ] Unify card radius
- [ ] Unify shadow depth
- [ ] Unify button styles
- [ ] Unify drawer width and animation
- [ ] Check desktop layout
- [ ] Check no drawer causes page compression
- [ ] Run `npm run build`
- [ ] Commit: `Polish visual consistency`

---

## Phase 15: README and Deployment

- [ ] Write README
- [ ] Add project overview
- [ ] Add tech stack
- [ ] Add feature list
- [ ] Add screenshots
- [ ] Add local run instructions
- [ ] Push final version to GitHub
- [ ] Deploy to Vercel or Netlify
- [ ] Add live demo link to README
- [ ] Commit: `Add README and deployment notes`