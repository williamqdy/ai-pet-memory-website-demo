# Design System

This document records the UI and interaction system that is already applied in
the current CreatePet and Home pages. Future work on Timeline, Album, Diary,
GrowthRecords, drawers, and shared components must preserve these rules unless
the user explicitly asks for a different direction.

The product is a front-end demo for AI宠物记忆空间. It must stay soft, warm,
healing, emotional, cartoon-like, and card-based. Do not turn it into a dense
admin dashboard or a cold medical tool.

## Theme States

The product has two core pet states.

### active: 陪伴中

- Primary color family: warm orange.
- Used for primary buttons, selected segmented controls, hover states, selected
  date, selected year, navigation active underline, and active text.
- Visual mood: warm, bright, companionship, daily care, soft garden atmosphere.
- Content mood: daily mood, food, activity, birthday countdown, growth tips,
  latest memories.

### memorial: 纪念中

- Primary color family: lavender / purple.
- Used for the same component roles as active mode: primary buttons, selected
  controls, hover states, selected date, selected year, navigation active
  underline, and active text.
- Visual mood: quiet, gentle, memorial, lavender, rainbow-bridge atmosphere.
- Content mood: precious moments, remembrance, emotional writing, past records.

### State Consistency

- Switching state must update theme color, background, copy, and state-specific
  content together.
- The layout should remain structurally stable between active and memorial.
- Avoid page jumps. Prefer changing theme color, copy, icons, and relevant
  modules instead of moving shared structure.
- Reuse shared theme configuration where possible. Do not introduce unrelated
  one-off orange or purple values on future pages.

## Layout Rules

### Main App Layout

Home, Timeline, Album, Diary, and GrowthRecords must share the same main app
container and header/navigation system.

- Main container remains a centered app card, not full screen.
- Current main container target: `80vw` wide and `95vh` tall.
- Keep rounded outer corners, overflow hidden, and soft shadow.
- Header, status switch, pet info, notification/profile buttons, and nav must
  stay aligned across all main pages.
- Route transitions should animate only the content below the nav. Do not
  animate or remount the header/nav during normal page switching.

### CreatePet Layout

- Do not move the title, subtitle, state switch, center dashed pet image, or
  confirm button unless the user explicitly asks.
- Left and right form columns should be aligned as groups.
- Left column top edge should visually align with right column top edge.
- Left column bottom edge should visually align with right column bottom edge.
- When card heights need adjustment, adjust the column rhythm as a group.
  Do not stretch only one card to solve a column-height problem.
- Center dashed cat/dog area is a visual anchor and must remain centered.

## Card Style

### General Card Style

- Cards use large rounded corners, soft warm white surfaces, subtle borders,
  and soft shadows.
- Card content must not touch edges. Keep comfortable internal padding.
- Text hierarchy should be clear:
  - title: medium/small, bold
  - main value: larger and visually dominant
  - description: smaller, comfortable line-height
- Hover can include slight lift, brighter background, or stronger shadow.
- Hover must not cause layout reflow or visible size jumps.
- Avoid strong glassmorphism unless explicitly requested. The current preferred
  form-card feeling is soft white / cream, not transparent frosted glass.

### CreatePet Form Cards

CreatePet uses six main cards:

- 选择小伙伴
- 品种
- 输入名字
- 上传头像
- 生日
- 到家日期 / 离世日期

Rules:

- Card positions and sizes should remain stable.
- Use image icons from `public/images/auth/create-pet-page/`.
- Icons must be centered, object-contained, and not distorted.
- The upload avatar card should not become overly tall.
- Date cards should vertically center the icon/title/subtitle/date field group.
- Date text should be clear and slightly prominent.
- Name card contains name input, sex segmented control, and neutered segmented
  control. It should remain readable and not overly compressed.

### Home Information Cards

Home active state uses six information cards:

- 今日心情
- 今日饮食
- 今日活动
- 重要日子
- 成长小贴士
- 最新回忆

Rules:

- Use `img` assets for card icons, not temporary emoji, when assets exist.
- Icons sit inside a small white icon base and must be visually centered.
- Icon images use `object-contain`.
- The left active Home icons are intentionally larger than the default icon
  base and may use explicit image sizing.
- Right-side active Home icons keep their current size unless asked.
- Text should have enough breathing room and never touch card edges.
- Memorial Home must not show active-only modules such as 今日饮食, 今日活动,
  成长小贴士, or 最新回忆.

## Buttons and Press Feedback

### General Buttons

- Buttons must give clear hover feedback.
- Hover can brighten, raise slightly, or increase shadow.
- Active press feedback should be subtle:
  - recommended `scale(0.96)` or `scale(0.97)`
  - duration around `120ms` to `180ms`
  - use `ease-out`
- Main hover/transition timing can be `160ms` to `240ms`.
- Do not use exaggerated bounce.
- Do not use sudden grow-on-click animations for normal buttons.

### Interactive Cards and Clickable Components

- Any card or component with a click action must have hover, active, and
  transition feedback.
- Reuse the established CreatePet interaction language for clickable cards:
  soft lift, subtle background brightening, smooth transition, and restrained
  press feedback.
- Do not introduce one-off hover effects that feel different from CreatePet
  unless the user explicitly requests a new interaction style.
- Clickable cards should include a right-side arrow indicator matching the
  CreatePet clickable card language.
- The whole visible card remains clickable; the arrow is an affordance, not the
  only click target.
- Exception: components that are already clearly styled as buttons do not need
  an extra arrow.

### Home Card Popovers

- Any popover opened from a Home page card must stay visually attached to the
  card that triggered it, normally on the card's right side.
- Home card popovers must not appear as centered modals unless explicitly
  requested.
- They may cover the center pet display area, but must not push, resize, or
  reflow the Home layout.
- They must avoid parent overflow clipping; use a safer layer or portal when
  needed while preserving visual attachment to the triggering card.
- Reuse the same animation language as the CreatePet breed selector and the
  Today’s Mood popup.

### Confirm Buttons

- The entire visible rounded button area must be clickable.
- Use a real `button` element with `type="button"`.
- Bind `onClick` to the outer `button`, not only to inner text.
- If a decorative layer overlaps the button, that layer should use
  `pointer-events: none` or the button should have a higher interactive
  stacking context.
- Internal spans/icons should not be the only clickable target.

### Close Buttons

- Close controls must be real buttons.
- The whole round button area must be clickable.
- Include an accessible label such as `aria-label="关闭上传说明面板"`.
- Hover should show a clear but light response:
  - background slightly deepens
  - icon color strengthens
  - slight scale up is acceptable, such as `scale(1.05)`
  - shadow may increase lightly
- Active should use a subtle press, such as `scale(0.95)` to `scale(0.97)`.

## State Toggle

- The 陪伴中 / 纪念中 switch uses a sliding thumb.
- Thumb movement should be smooth, around `300ms`, with `ease-out`.
- Text color and thumb color update by state.
- The switch must not cause header, nav, or page layout jumps.
- Header background switching must not flash old images, misplaced images, or
  fallback background colors.
- For main pages, keep both header background layers mounted and transition
  opacity. Do not swap a single `src` during state changes.

## Date Picker

The CreatePet date picker is the approved base for future date inputs.

### Use Cases

- 生日
- 到家日期
- 离世日期
- Future Timeline, Diary, and GrowthRecords date fields.

### Trigger Behavior

- Clicking the whole date card should open the calendar.
- Clicking the date field text or arrow should also open the calendar.
- Only one date picker should be open at a time.
- Clicking outside closes the picker.
- Clicking inside the picker must not close it.
- Selecting a date updates the corresponding field and closes the picker.

### Positioning

- The date picker floats beside the triggering card.
- For right-side cards, it appears completely to the left of the card.
- It can cover the center dashed pet area.
- It must not overlap the triggering date card.
- It must stay fully inside the viewport.
- The bottom date picker must keep visible spacing from the viewport bottom.
- It must not be clipped by parent `overflow`.
- Use fixed positioning and a high enough z-index.

### Date View

- Top header shows year and month.
- Left/right arrows switch months.
- The year text is clickable and enters year selection.
- Selected date uses a solid theme-colored circle.
- Hovering a date shows a light theme-colored circular background.
- Date buttons should use cursor pointer and subtle active press feedback.
- Do not use large grow animations for date clicks.

### Date Picker Animation

- Popover opens from the card side with a soft funnel-like motion.
- Recommended transition: opacity, scale, and slight translate.
- Duration: about `180ms` to `260ms`.
- Animation must not move the page layout.

## Year Picker

The year picker is part of the date picker and must use the same outer popover.

- Clicking the date-view year enters year view.
- Date view and year view must share the same outer width and height.
- Switching views must not make the popover shrink, grow, or jump.
- The outer picker can use a fixed panel size. Inner content changes only inside
  that fixed frame.
- Year view displays 12 years at a time.
- Use a 3-column by 4-row grid.
- The grid should fill the available content area and avoid large empty zones.
- Left/right arrows in year view switch the previous/next 12-year page.
- Selected year uses a solid current-theme background.
- Hovering a year shows a light theme-colored rounded background.
- Clicking a year uses button-like press feedback, such as `active:scale(0.97)`.
- Do not use a rapid grow / pop animation when selecting a year.
- Selecting a year updates the visible calendar year, keeps the current month,
  returns to date view, and does not close the picker.
- The final date value should only be confirmed by clicking a concrete day.

## Popover / Modal Panels

### Lightweight Popover Panels

Use this pattern for contextual panels such as the AI model reference upload
panel:

- Rounded corners.
- Soft light background.
- Gentle border and shadow.
- Clear content hierarchy.
- Current theme color for the title and primary action.
- Close button in the top-right.
- Clicking outside closes the panel.
- Clicking inside does not close it.
- Esc can close the panel if implemented.
- Avoid a strong dark overlay unless the panel is a blocking modal.
- Opening animation should include opacity, slight scale, and slight upward
  movement.

### Confirmation Modals

CreatePet confirmation uses a blocking centered modal:

- Dark overlay.
- Centered modal.
- Original page inactive.
- No layout shift.
- Rounded corners and soft cream/orange or lavender/purple theme.
- Buttons remain readable and horizontally aligned.

## Upload Entry Rules

CreatePet has two separate upload concepts. Do not merge them.

### Avatar Upload

- Location: right-side 上传头像 card.
- Purpose: pet avatar for header, profile, and future small avatar displays.
- Suggested field: `avatarUrl` or existing avatar field.
- Front-end demo only. No cloud upload.

### AI Model Reference Upload

- Location: center dashed cat/dog area.
- Purpose: reference images for future AI pet image/model generation.
- Suggested field: `modelReferenceImages: string[]`.
- Optional compatibility field: `modelReferenceImageUrl` for the first image.
- Supports up to 3 images.
- Recommended prompt: click to generate AI pet image, suggest 2-3 clear photos.
- The panel should explain:
  - front-facing clear photo
  - side or full-body photo
  - representative expression or pose
- Do not claim real AI modeling is already happening.
- Do not write promises such as 100% restoration or precise modeling.
- Do not call a backend or external AI API.
- Upload is local preview and saved demo state only.

## Home Page Shared Layout

- Main pages use shared `MainLayout`.
- Header includes pet avatar, pet name, sex badge, breed, age, status tag,
  state switch, 通知, and 我的.
- Header backgrounds:
  - active: `/images/auth/home-page/background-up-active-.png`
  - memorial: `/images/auth/home-page/background-up-memorial.png`
- Header background bottom must be flush with the top edge of the nav.
- No gap, crack, border, or fallback color may appear between header and nav.
- Bottom decorative part of the header image must remain visible.
- If cropping is needed, crop from the top, not the bottom.
- Active and memorial backgrounds must use the same rendering strategy.
- Keep both background layers mounted and crossfade opacity to avoid flicker.

## Navigation Rules

Main nav items:

- 首页
- 时间线
- 相册
- 日记
- 成长记录

Rules:

- Navigation position and height must be consistent across all main pages.
- Five items are evenly distributed across the full nav width.
- Do not use a large filled pill behind the active item.
- Active item uses current theme color for text/icon.
- Active item has a short horizontal underline.
- Inactive items use soft warm brown/gray in active mode and soft muted purple
  gray in memorial mode.
- Underline should move smoothly when route changes.
- Header should not animate during page transitions.
- Only content below nav should fade/translate in.

## CreatePet Page Shared Layout

- Page backgrounds:
  - active: `background-active.png`
  - memorial: `background-memorial.png`
- Center dashed pet images:
  - active: `dashed-active.png`
  - memorial: `dashed-memorial.png`
- State switching should update theme, background, dashed image, and card icons.
- Form columns should remain clear of the header, center dashed image, and
  confirm button.
- Breed dropdown:
  - opens to the right of the 品种 card
  - does not push layout
  - rounded outer container with overflow hidden
  - inner scroll area keeps scrollbar inside rounded shape
  - selected breed highlighted by current theme
  - opening animation expands from the card side
- Date picker should follow the Date Picker and Year Picker rules above.

## Animation Rules

- Prefer small, purposeful motion.
- Common durations:
  - button hover/press: `120ms` to `240ms`
  - popover open: `180ms` to `320ms`
  - state switch thumb: about `300ms`
  - page content enter: about `220ms`
- Easing:
  - use `ease-out` or `cubic-bezier(0.22, 1, 0.36, 1)`
- Allowed effects:
  - opacity fade
  - slight translate
  - slight scale for hover or active press
  - subtle shadow changes
- Avoid:
  - exaggerated bounce
  - sudden large scale-up on click
  - page-level layout shifts
  - animations that remount header/nav

## Do Not Change Rules

Unless explicitly requested:

- Do not add backend, database, payment, real authentication, or external APIs.
- Do not redesign existing CreatePet or Home layouts.
- Do not change routing behavior.
- Do not change localStorage keys or persistence behavior.
- Do not introduce inconsistent one-off button, card, date picker, or popover
  patterns.
- Do not let drawers push, resize, or compress the original page.
- Do not let popovers or drawers be clipped by parent overflow.
- Do not mix avatar upload with AI model reference upload.
- Do not use Windows local paths in React code. Use browser paths from
  `public`, such as `/images/auth/...`.

## Future Page Implementation Checklist

Before implementing or refining Timeline, Album, Diary, or GrowthRecords:

- Read `AGENTS.md`, `PRODUCT_SPEC.md`, `DESIGN_MAP.md`, `TASKS.md`, and this
  `DESIGN_SYSTEM.md`.
- Reuse `MainLayout` for header, state switch, and navigation.
- Keep nav active state route-specific.
- Keep state switching on the same route.
- Use active orange and memorial purple consistently.
- Use established card radius, shadow, padding, and text hierarchy.
- Use established button hover/press feedback.
- Use the approved date picker and year picker behavior for date fields.
- Use fixed overlay drawers for add/edit flows. Never push the page.
- Use lightweight popover rules for contextual panels.
- Verify active and memorial layouts do not jump structurally.
- Run `npm run build` before completing the task.
