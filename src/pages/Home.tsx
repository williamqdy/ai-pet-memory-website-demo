import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { ReactNode, Ref, RefObject } from 'react'
import { createPortal } from 'react-dom'
import { useMainPetLayout } from '../components/MainLayout'
import { mockTimelineEvents } from '../data/mockData'
import type { AlbumPhoto, TimelineEvent } from '../types'
import { getAlbumImage } from '../utils/albumImageDB'
import {
  getStorageItem,
  SESSION_STORAGE_KEYS,
  STORAGE_KEYS,
} from '../utils/storage'

const activeMoodOptions = ['开心', '安静', '兴奋', '撒娇', '疲惫', '有点emo']
const memorialMoodOptions = ['安详', '想念', '温柔', '平静', '守护', '怀念']
const activeMoodStorageKey = 'petMemory:homeMood:active'
const memorialMoodStorageKey = 'petMemory:homeMood:memorial'
const dietStorageKey = 'petMemory:homeDiet'
const activityStorageKey = 'petMemory:homeActivity'
const commonDietTags = ['主粮', '罐头', '冻干', '零食', '小鱼干', '鸡胸肉']

type HomePopover = 'mood' | 'diet' | 'activity' | null

type StoredAlbumPhoto = AlbumPhoto & {
  createdAt?: string
  imageId?: string
}

type MemorialPreciousMoment = {
  id: string
  image: string
  title: string
}

type MemorialPreciousMomentsSelection = {
  photoIds: string[]
  sessionId: string
}

type DietRecord = {
  customFood: string
  note: string
  tags: string[]
}

type ActivityRecord = {
  activityText: string
  duration: string
}

const defaultDietRecord: DietRecord = {
  customFood: '',
  note: '',
  tags: ['小鱼干'],
}

const defaultActivityRecord: ActivityRecord = {
  activityText: '散步',
  duration: '30',
}

const readSavedMood = (
  key: string,
  fallback: string,
  options: string[],
) => {
  if (typeof window === 'undefined') {
    return fallback
  }

  const savedMood = window.localStorage.getItem(key)
  return savedMood && options.includes(savedMood) ? savedMood : fallback
}

const saveMood = (key: string, mood: string) => {
  window.localStorage.setItem(key, mood)
}

const readSavedDiet = () => {
  if (typeof window === 'undefined') {
    return defaultDietRecord
  }

  try {
    const savedDiet = window.localStorage.getItem(dietStorageKey)
    if (!savedDiet) {
      return defaultDietRecord
    }

    const parsed = JSON.parse(savedDiet) as Partial<DietRecord>
    const tags = Array.isArray(parsed.tags)
      ? parsed.tags.filter((tag): tag is string => typeof tag === 'string')
      : defaultDietRecord.tags

    return {
      customFood:
        typeof parsed.customFood === 'string' ? parsed.customFood : '',
      note: typeof parsed.note === 'string' ? parsed.note : '',
      tags,
    }
  } catch {
    return defaultDietRecord
  }
}

const readSavedActivity = () => {
  if (typeof window === 'undefined') {
    return defaultActivityRecord
  }

  try {
    const savedActivity = window.localStorage.getItem(activityStorageKey)
    if (!savedActivity) {
      return defaultActivityRecord
    }

    const parsed = JSON.parse(savedActivity) as Partial<ActivityRecord>
    return {
      activityText:
        typeof parsed.activityText === 'string'
          ? parsed.activityText
          : defaultActivityRecord.activityText,
      duration:
        typeof parsed.duration === 'string'
          ? parsed.duration
          : defaultActivityRecord.duration,
    }
  } catch {
    return defaultActivityRecord
  }
}

const saveDietRecord = (record: DietRecord) => {
  window.localStorage.setItem(dietStorageKey, JSON.stringify(record))
}

const saveActivityRecord = (record: ActivityRecord) => {
  window.localStorage.setItem(activityStorageKey, JSON.stringify(record))
}

const readStoredAlbumPhotos = () =>
  getStorageItem<StoredAlbumPhoto[]>(STORAGE_KEYS.albumPhotos, [])

const isUserUploadedAlbumPhoto = (photo: StoredAlbumPhoto) =>
  photo.id.startsWith('album-upload-') &&
  photo.status === 'memorial' &&
  (Boolean(photo.imageId) || photo.image.trim().length > 0)

const getCurrentLoginSessionId = () => {
  if (typeof window === 'undefined') {
    return 'server'
  }

  const existingSessionId = window.sessionStorage.getItem(
    SESSION_STORAGE_KEYS.currentLoginSessionId,
  )

  if (existingSessionId) {
    return existingSessionId
  }

  const fallbackSessionId = `home-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}`

  window.sessionStorage.setItem(
    SESSION_STORAGE_KEYS.currentLoginSessionId,
    fallbackSessionId,
  )

  return fallbackSessionId
}

const readMemorialPreciousSelection = () => {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    const rawSelection = window.sessionStorage.getItem(
      SESSION_STORAGE_KEYS.memorialPreciousMomentsSelection,
    )

    if (!rawSelection) {
      return null
    }

    const parsedSelection = JSON.parse(
      rawSelection,
    ) as Partial<MemorialPreciousMomentsSelection>

    if (
      typeof parsedSelection.sessionId !== 'string' ||
      !Array.isArray(parsedSelection.photoIds)
    ) {
      return null
    }

    return {
      sessionId: parsedSelection.sessionId,
      photoIds: parsedSelection.photoIds.filter(
        (photoId): photoId is string => typeof photoId === 'string',
      ),
    }
  } catch {
    return null
  }
}

const saveMemorialPreciousSelection = (
  selection: MemorialPreciousMomentsSelection,
) => {
  if (typeof window === 'undefined') {
    return
  }

  window.sessionStorage.setItem(
    SESSION_STORAGE_KEYS.memorialPreciousMomentsSelection,
    JSON.stringify(selection),
  )
}

const shuffleAlbumPhotos = (photos: StoredAlbumPhoto[]) => {
  const shuffledPhotos = [...photos]

  for (let index = shuffledPhotos.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1))
    ;[shuffledPhotos[index], shuffledPhotos[randomIndex]] = [
      shuffledPhotos[randomIndex],
      shuffledPhotos[index],
    ]
  }

  return shuffledPhotos
}

const selectMemorialPreciousPhotoIds = (
  photos: StoredAlbumPhoto[],
  sessionId: string,
) => {
  const storedSelection = readMemorialPreciousSelection()
  const availablePhotoIds = new Set(photos.map((photo) => photo.id))
  const expectedCount = photos.length >= 4 ? 4 : photos.length > 0 ? 1 : 0

  if (
    storedSelection?.sessionId === sessionId &&
    storedSelection.photoIds.length === expectedCount &&
    storedSelection.photoIds.every((photoId) => availablePhotoIds.has(photoId))
  ) {
    return storedSelection.photoIds
  }

  if (expectedCount === 0) {
    saveMemorialPreciousSelection({
      sessionId,
      photoIds: [],
    })
    return []
  }

  const selectedPhotoIds = shuffleAlbumPhotos(photos)
    .slice(0, expectedCount)
    .map((photo) => photo.id)

  saveMemorialPreciousSelection({
    sessionId,
    photoIds: selectedPhotoIds,
  })

  return selectedPhotoIds
}

const resolveAlbumPhotoImage = async (photo: StoredAlbumPhoto) => {
  if (photo.imageId) {
    try {
      const imageRecord = await getAlbumImage(photo.imageId)

      if (imageRecord?.dataUrl) {
        return imageRecord.dataUrl
      }
    } catch {
      return photo.image.trim()
    }
  }

  return photo.image.trim()
}

const getDietItems = (record: DietRecord) => {
  const customFood = record.customFood.trim()
  return [customFood, ...record.tags].filter(Boolean)
}

const getDietPreview = (record: DietRecord) => {
  const items = getDietItems(record)
  const sortedItems = [...items].sort((first, second) => {
    const firstIsCompact = first.length <= 4 ? 0 : 1
    const secondIsCompact = second.length <= 4 ? 0 : 1

    if (firstIsCompact !== secondIsCompact) {
      return firstIsCompact - secondIsCompact
    }

    return first.length - second.length
  })
  const visibleItems: string[] = []
  let widthScore = 0
  const maxWidthScore = 7

  for (const item of sortedItems) {
    const score = Math.min(item.length, 4) + 1

    if (
      item.length > 6 ||
      visibleItems.length >= 2 ||
      widthScore + score > maxWidthScore
    ) {
      continue
    }

    visibleItems.push(item)
    widthScore += score
  }

  return {
    count: items.length,
    remainingCount: Math.max(items.length - visibleItems.length, 0),
    visibleItems,
  }
}

const formatActivitySummary = (record: ActivityRecord) => {
  const activity = record.activityText.trim() || defaultActivityRecord.activityText
  const duration = record.duration.trim()
  return duration ? `${activity} ${duration} 分钟` : activity
}

const formatTimelineDate = (date: string) =>
  date ? date.replaceAll('-', '.') : '暂无日期'

const readTimelineEventsForHome = () =>
  getStorageItem<TimelineEvent[]>(
    STORAGE_KEYS.timelineEvents,
    mockTimelineEvents,
  )

const getLatestActiveTimelineEvent = () => {
  const timelineEvents = readTimelineEventsForHome()

  return timelineEvents
    .map((event, index) => ({ event, index }))
    .filter(({ event }) => event.status === 'active')
    .sort((first, second) => {
      const dateCompare = second.event.date.localeCompare(first.event.date)

      if (dateCompare !== 0) {
        return dateCompare
      }

      return second.index - first.index
    })[0]?.event ?? null
}

type HomeCardProps = {
  cardRef?: Ref<HTMLElement>
  children?: ReactNode
  className?: string
  contentClassName?: string
  icon?: string
  iconClassName?: string
  iconImageClassName?: string
  iconSrc?: string
  onClick?: () => void
  showArrow?: boolean
  arrowOpen?: boolean
  arrowClassName?: string
  title: string
}

const HomeCard = ({
  arrowClassName = '',
  arrowOpen = false,
  cardRef,
  children,
  className = '',
  contentClassName = '',
  icon,
  iconClassName = '',
  iconImageClassName = 'h-11 w-11',
  iconSrc,
  onClick,
  showArrow = false,
  title,
}: HomeCardProps) => (
  <article
    className={`group cursor-pointer rounded-[20px] border border-white/70 bg-white/82 px-4 py-3.5 text-left shadow-[0_14px_34px_rgba(116,72,28,0.10)] backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/90 ${className}`}
    onClick={onClick}
    ref={cardRef}
  >
    <div className="flex items-start justify-between gap-3">
      <div className="flex min-w-0 items-center gap-2.5">
        <span
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-lg shadow-inner ${iconClassName}`}
        >
          {iconSrc ? (
            <img
              alt=""
              aria-hidden="true"
              className={`${iconImageClassName} object-contain`}
              src={iconSrc}
            />
          ) : (
            icon
          )}
        </span>
        <h3 className="text-[15px] font-extrabold text-stone-800">{title}</h3>
      </div>

      {showArrow ? (
        <span
          aria-hidden="true"
          className={`mt-1 text-xl font-black leading-none transition duration-300 ease-out group-hover:translate-x-1 group-active:scale-95 ${arrowClassName} ${
            arrowOpen ? 'rotate-90' : ''
          }`}
        >
          ›
        </span>
      ) : null}
    </div>
    {children ? (
      <div className={`mt-2.5 ${contentClassName}`}>{children}</div>
    ) : null}
  </article>
)

const MemorialPreciousMomentsGrid = ({
  isLoading,
  photos,
}: {
  isLoading: boolean
  photos: MemorialPreciousMoment[]
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-1.5">
        {Array.from({ length: 4 }, (_, index) => (
          <div
            className="h-12 animate-pulse rounded-xl border border-white/70 bg-purple-50/80 shadow-inner"
            key={index}
          />
        ))}
      </div>
    )
  }

  if (photos.length === 0) {
    return (
      <div className="flex h-[102px] items-center justify-center rounded-xl border border-dashed border-purple-200 bg-purple-50/72 px-4 text-center">
        <p className="text-xs font-black leading-5 text-purple-500">
          还没有珍贵瞬间，去相册添加照片吧
        </p>
      </div>
    )
  }

  if (photos.length === 1) {
    return (
      <img
        alt={photos[0].title}
        className="h-[102px] w-full rounded-xl border border-white/70 object-cover shadow-inner"
        src={photos[0].image}
      />
    )
  }

  return (
    <div className="grid grid-cols-2 gap-1.5">
      {photos.map((photo, index) => (
        <img
          alt={photo.title || `珍贵瞬间 ${index + 1}`}
          className="h-12 rounded-xl border border-white/70 object-cover shadow-inner"
          key={photo.id}
          src={photo.image}
        />
      ))}
    </div>
  )
}

const MemorialMoodVisual = () => (
  <div className="relative mx-auto flex h-[126px] w-[136px] items-center justify-center">
    <div className="absolute inset-2 rounded-full bg-gradient-to-b from-purple-100/80 to-white shadow-[inset_0_-14px_30px_rgba(139,92,246,0.12)]" />
    <div className="absolute right-4 top-5 h-7 w-7 rounded-full bg-white/80 shadow-sm" />
    <div className="absolute left-3 top-9 h-14 w-6 rotate-[-18deg] rounded-full bg-purple-200/55 blur-[1px]" />

    <div className="relative z-10 h-[86px] w-[86px] rounded-full bg-gradient-to-b from-[#fff4c8] to-[#ffe2a8] shadow-[0_14px_30px_rgba(126,34,206,0.14)]">
      <span className="absolute left-[22px] top-[36px] h-2 w-4 rounded-b-full border-b-2 border-purple-500" />
      <span className="absolute right-[22px] top-[36px] h-2 w-4 rounded-b-full border-b-2 border-purple-500" />
      <span className="absolute left-1/2 top-[54px] h-3 w-8 -translate-x-1/2 rounded-b-full border-b-2 border-purple-500" />
      <span className="absolute -right-3 bottom-3 text-lg leading-none text-purple-300">
        ♥
      </span>
    </div>

    <div className="absolute bottom-2 left-5 flex h-14 w-5 rotate-[18deg] flex-col items-center justify-end">
      <span className="h-12 w-0.5 rounded-full bg-purple-300" />
      <span className="absolute bottom-8 left-2 h-2 w-2 rounded-full bg-purple-400" />
      <span className="absolute bottom-11 right-1 h-2 w-2 rounded-full bg-purple-300" />
      <span className="absolute bottom-5 right-0 h-2 w-2 rounded-full bg-purple-400" />
    </div>
  </div>
)

type MoodSelectPopoverProps = {
  anchorRef: RefObject<HTMLElement | null>
  onSelect: (mood: string) => void
  options: string[]
  popoverRef: RefObject<HTMLDivElement | null>
  selectedMood: string
  status: 'active' | 'memorial'
}

type HomeCardPopoverFrameProps = {
  anchorRef: RefObject<HTMLElement | null>
  children: ReactNode
  panelWidth?: number
  popoverRef: RefObject<HTMLDivElement | null>
}

const HomeCardPopoverFrame = ({
  anchorRef,
  children,
  panelWidth = 280,
  popoverRef,
}: HomeCardPopoverFrameProps) => {
  const [position, setPosition] = useState<{ left: number; top: number } | null>(
    null,
  )

  useLayoutEffect(() => {
    const updatePosition = () => {
      const anchor = anchorRef.current

      if (!anchor) {
        return
      }

      const rect = anchor.getBoundingClientRect()
      const panelHeight = popoverRef.current?.offsetHeight || 304
      const sideGap = 16
      const safeGap = 10
      const homeContent = anchor.closest('[data-home-content="true"]')
      const bounds = homeContent?.getBoundingClientRect()
      const minCenter =
        (bounds?.top ?? safeGap) + safeGap + panelHeight / 2
      const maxCenter =
        (bounds?.bottom ?? window.innerHeight - safeGap) -
        safeGap -
        panelHeight / 2
      const desiredCenter = rect.top + rect.height / 2
      const top =
        maxCenter >= minCenter
          ? Math.min(Math.max(desiredCenter, minCenter), maxCenter)
          : Math.max(desiredCenter, minCenter)
      const left = Math.min(
        rect.right + sideGap,
        window.innerWidth - panelWidth - safeGap,
      )

      setPosition({
        left: Math.max(safeGap, left),
        top,
      })
    }

    updatePosition()
    const frameId = window.requestAnimationFrame(updatePosition)

    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)

    return () => {
      window.cancelAnimationFrame(frameId)
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [anchorRef, panelWidth, popoverRef])

  return createPortal(
    <div
      className="fixed z-[60] max-w-[calc(100vw-32px)] origin-left overflow-hidden rounded-[24px] border border-white/80 bg-white/90 p-2 shadow-[0_18px_44px_rgba(87,66,40,0.18)] backdrop-blur"
      ref={popoverRef}
      style={{
        animation:
          'createPetBreedPopoverIn 380ms cubic-bezier(0.22, 1, 0.36, 1) both',
        left: position ? `${position.left}px` : 0,
        top: position ? `${position.top}px` : 0,
        transformOrigin: 'left center',
        visibility: position ? 'visible' : 'hidden',
        width: `${panelWidth}px`,
      }}
    >
      {children}
    </div>,
    document.body,
  )
}

const MoodSelectPopover = ({
  anchorRef,
  onSelect,
  options,
  popoverRef,
  selectedMood,
  status,
}: MoodSelectPopoverProps) => {
  const selectedClass =
    status === 'active' ? 'bg-orange-500 text-white' : 'bg-purple-500 text-white'
  const titleClass = status === 'active' ? 'text-orange-500' : 'text-purple-500'
  const optionHoverClass =
    status === 'active'
      ? 'hover:bg-orange-50 hover:text-orange-600 hover:shadow-[0_8px_18px_rgba(251,146,60,0.14),inset_0_0_0_1px_rgba(251,146,60,0.18)]'
      : 'hover:bg-purple-50 hover:text-purple-600 hover:shadow-[0_8px_18px_rgba(139,92,246,0.14),inset_0_0_0_1px_rgba(139,92,246,0.18)]'

  return (
    <HomeCardPopoverFrame
      anchorRef={anchorRef}
      panelWidth={280}
      popoverRef={popoverRef}
    >
      <div
        className="create-pet-breed-scroll max-h-[300px] overflow-y-auto pr-1"
        style={{ maxHeight: 'min(300px, calc(100vh - 48px))' }}
      >
        <p className={`px-4 pb-2 pt-1 text-sm font-black ${titleClass}`}>
          选择今日心情
        </p>
        {options.map((mood) => (
          <button
            className={`block h-10 w-full cursor-pointer rounded-2xl px-4 text-left text-sm font-bold transition duration-200 ease-out active:scale-[0.98] ${
              selectedMood === mood
                ? selectedClass
                : `text-stone-600 ${optionHoverClass}`
            }`}
            key={mood}
            onClick={(event) => {
              event.stopPropagation()
              onSelect(mood)
            }}
            type="button"
          >
            {mood}
          </button>
        ))}
      </div>
    </HomeCardPopoverFrame>
  )
}

type DietRecordPopoverProps = {
  anchorRef: RefObject<HTMLElement | null>
  draft: DietRecord
  onChange: (record: DietRecord) => void
  onSave: () => void
  popoverRef: RefObject<HTMLDivElement | null>
}

const DietRecordPopover = ({
  anchorRef,
  draft,
  onChange,
  onSave,
  popoverRef,
}: DietRecordPopoverProps) => {
  const toggleTag = (tag: string) => {
    const nextTags = draft.tags.includes(tag)
      ? draft.tags.filter((item) => item !== tag)
      : [...draft.tags, tag]

    onChange({ ...draft, tags: nextTags })
  }

  return (
    <HomeCardPopoverFrame
      anchorRef={anchorRef}
      panelWidth={336}
      popoverRef={popoverRef}
    >
      <div className="space-y-3 p-2">
        <p className="px-2 text-sm font-black text-orange-500">今日饮食</p>

        <div>
          <p className="px-2 text-xs font-black text-stone-500">常用食物</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {commonDietTags.map((tag) => {
              const selected = draft.tags.includes(tag)
              return (
                <button
                  className={`rounded-full px-3 py-1.5 text-xs font-black transition duration-200 ease-out active:scale-[0.97] ${
                    selected
                      ? 'bg-orange-500 text-white shadow-[0_8px_18px_rgba(249,115,22,0.20)]'
                      : 'bg-orange-50/70 text-stone-600 hover:bg-orange-100 hover:text-orange-600 hover:shadow-[0_8px_16px_rgba(251,146,60,0.14)]'
                  }`}
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  type="button"
                >
                  {tag}
                </button>
              )
            })}
          </div>
        </div>

        <label className="block px-2 text-xs font-black text-stone-500">
          自定义添加
          <input
            className="mt-1.5 h-10 w-full rounded-2xl border border-orange-100 bg-white/85 px-3 text-sm font-bold text-stone-700 outline-none transition duration-200 ease-out placeholder:text-stone-300 focus:border-orange-300 focus:shadow-[0_0_0_3px_rgba(251,146,60,0.14)]"
            onChange={(event) =>
              onChange({ ...draft, customFood: event.target.value })
            }
            placeholder="请输入今天吃了什么"
            value={draft.customFood}
          />
        </label>

        <label className="block px-2 text-xs font-black text-stone-500">
          备注
          <textarea
            className="mt-1.5 h-16 w-full resize-none rounded-2xl border border-orange-100 bg-white/85 px-3 py-2 text-sm font-bold text-stone-700 outline-none transition duration-200 ease-out placeholder:text-stone-300 focus:border-orange-300 focus:shadow-[0_0_0_3px_rgba(251,146,60,0.14)]"
            onChange={(event) =>
              onChange({ ...draft, note: event.target.value })
            }
            placeholder="例如：胃口正常、吃得少、吃得多"
            value={draft.note}
          />
        </label>

        <button
          className="h-10 w-full rounded-2xl bg-orange-500 text-sm font-black text-white shadow-[0_12px_24px_rgba(249,115,22,0.22)] transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-orange-400 active:scale-[0.97]"
          onClick={onSave}
          type="button"
        >
          保存
        </button>
      </div>
    </HomeCardPopoverFrame>
  )
}

type ActivityRecordPopoverProps = {
  anchorRef: RefObject<HTMLElement | null>
  draft: ActivityRecord
  onChange: (record: ActivityRecord) => void
  onSave: () => void
  popoverRef: RefObject<HTMLDivElement | null>
}

const ActivityRecordPopover = ({
  anchorRef,
  draft,
  onChange,
  onSave,
  popoverRef,
}: ActivityRecordPopoverProps) => (
  <HomeCardPopoverFrame
    anchorRef={anchorRef}
    panelWidth={320}
    popoverRef={popoverRef}
  >
    <div className="space-y-3 p-2">
      <p className="px-2 text-sm font-black text-orange-500">今日活动</p>

      <label className="block px-2 text-xs font-black text-stone-500">
        活动内容
        <input
          className="mt-1.5 h-10 w-full rounded-2xl border border-orange-100 bg-white/85 px-3 text-sm font-bold text-stone-700 outline-none transition duration-200 ease-out placeholder:text-stone-300 focus:border-orange-300 focus:shadow-[0_0_0_3px_rgba(251,146,60,0.14)]"
          onChange={(event) =>
            onChange({ ...draft, activityText: event.target.value })
          }
          placeholder="例如：散步、玩球、训练、洗澡"
          value={draft.activityText}
        />
      </label>

      <label className="block px-2 text-xs font-black text-stone-500">
        活动时长
        <div className="mt-1.5 flex items-center gap-2">
          <input
            className="h-10 min-w-0 flex-1 rounded-2xl border border-orange-100 bg-white/85 px-3 text-sm font-bold text-stone-700 outline-none transition duration-200 ease-out placeholder:text-stone-300 focus:border-orange-300 focus:shadow-[0_0_0_3px_rgba(251,146,60,0.14)]"
            inputMode="numeric"
            onChange={(event) =>
              onChange({ ...draft, duration: event.target.value })
            }
            placeholder="30"
            value={draft.duration}
          />
          <span className="shrink-0 text-sm font-black text-orange-500">分钟</span>
        </div>
      </label>

      <button
        className="h-10 w-full rounded-2xl bg-orange-500 text-sm font-black text-white shadow-[0_12px_24px_rgba(249,115,22,0.22)] transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-orange-400 active:scale-[0.97]"
        onClick={onSave}
        type="button"
      >
        保存
      </button>
    </div>
  </HomeCardPopoverFrame>
)

const Home = () => {
  const { ageText, pet, status, theme } = useMainPetLayout()
  const isMemorial = status === 'memorial'
  const [activeMood, setActiveMood] = useState(() =>
    readSavedMood(activeMoodStorageKey, '开心', activeMoodOptions),
  )
  const [memorialMood, setMemorialMood] = useState(() =>
    readSavedMood(memorialMoodStorageKey, '安详', memorialMoodOptions),
  )
  const [dietRecord, setDietRecord] = useState(readSavedDiet)
  const [activityRecord, setActivityRecord] = useState(readSavedActivity)
  const [dietDraft, setDietDraft] = useState(readSavedDiet)
  const [activityDraft, setActivityDraft] = useState(readSavedActivity)
  const [latestActiveMemory] = useState(getLatestActiveTimelineEvent)
  const [memorialPreciousMoments, setMemorialPreciousMoments] = useState<
    MemorialPreciousMoment[]
  >([])
  const [isMemorialPreciousLoading, setIsMemorialPreciousLoading] =
    useState(false)
  const [openPopover, setOpenPopover] = useState<HomePopover>(null)
  const moodCardRef = useRef<HTMLElement | null>(null)
  const dietCardRef = useRef<HTMLElement | null>(null)
  const activityCardRef = useRef<HTMLElement | null>(null)
  const homePopoverRef = useRef<HTMLDivElement | null>(null)
  const petImage =
    pet.avatar ||
    (isMemorial
      ? '/images/auth/create-pet-page/memorial_select_partner_icon.png'
      : '/images/auth/create-pet-page/active_select_partner_icon.png')
  const centerGrassBaseClass =
    'pointer-events-none absolute left-1/2 z-20 -translate-x-1/2 object-contain transition-opacity duration-500 ease-out will-change-[opacity] [backface-visibility:hidden]'
  const activeCenterGrassClass = 'top-[calc(50%_+_14px)] w-[136%] max-w-[448px]'
  const memorialCenterGrassClass = 'top-[calc(50%_-_32px)] w-[163%] max-w-[538px]'
  const currentMood = isMemorial ? memorialMood : activeMood
  const moodOptions = isMemorial ? memorialMoodOptions : activeMoodOptions
  const dietPreview = getDietPreview(dietRecord)
  const activitySummary = formatActivitySummary(activityRecord)

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node

      if (
        !moodCardRef.current?.contains(target) &&
        !dietCardRef.current?.contains(target) &&
        !activityCardRef.current?.contains(target) &&
        !homePopoverRef.current?.contains(target)
      ) {
        setOpenPopover(null)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenPopover(null)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  useEffect(() => {
    if (!isMemorial) {
      return undefined
    }

    let isCancelled = false

    const loadMemorialPreciousMoments = async () => {
      setIsMemorialPreciousLoading(true)

      const sessionId = getCurrentLoginSessionId()
      const albumPhotos = readStoredAlbumPhotos().filter(
        isUserUploadedAlbumPhoto,
      )
      const selectedPhotoIds = selectMemorialPreciousPhotoIds(
        albumPhotos,
        sessionId,
      )
      const selectedPhotoIdsSet = new Set(selectedPhotoIds)
      const selectedPhotos = albumPhotos.filter((photo) =>
        selectedPhotoIdsSet.has(photo.id),
      )
      const resolvedPhotos = await Promise.all(
        selectedPhotos.map(async (photo) => {
          const image = await resolveAlbumPhotoImage(photo)

          if (!image) {
            return null
          }

          return {
            id: photo.id,
            image,
            title: photo.note?.trim() || '珍贵瞬间',
          }
        }),
      )

      if (isCancelled) {
        return
      }

      setMemorialPreciousMoments(
        resolvedPhotos.filter(
          (photo): photo is MemorialPreciousMoment => Boolean(photo),
        ),
      )
      setIsMemorialPreciousLoading(false)
    }

    void loadMemorialPreciousMoments()

    return () => {
      isCancelled = true
    }
  }, [isMemorial])

  const handleMoodSelect = (mood: string) => {
    if (isMemorial) {
      setMemorialMood(mood)
      saveMood(memorialMoodStorageKey, mood)
    } else {
      setActiveMood(mood)
      saveMood(activeMoodStorageKey, mood)
    }

    setOpenPopover(null)
  }

  const toggleHomePopover = (popover: HomePopover) => {
    if (popover === 'diet') {
      setDietDraft(dietRecord)
    }

    if (popover === 'activity') {
      setActivityDraft(activityRecord)
    }

    setOpenPopover((current) => (current === popover ? null : popover))
  }

  const handleDietSave = () => {
    const nextRecord = {
      customFood: dietDraft.customFood.trim(),
      note: dietDraft.note.trim(),
      tags: dietDraft.tags,
    }

    if (nextRecord.tags.length === 0 && !nextRecord.customFood) {
      return
    }

    setDietRecord(nextRecord)
    saveDietRecord(nextRecord)
    setOpenPopover(null)
  }

  const handleActivitySave = () => {
    const nextRecord = {
      activityText: activityDraft.activityText.trim(),
      duration: activityDraft.duration.trim(),
    }

    if (!nextRecord.activityText) {
      return
    }

    setActivityRecord(nextRecord)
    saveActivityRecord(nextRecord)
    setOpenPopover(null)
  }

  return (
    <div
      className="relative h-full overflow-hidden bg-transparent px-7 py-4"
      data-home-content="true"
    >
      <style>
        {`
          @keyframes createPetBreedPopoverIn {
            from {
              opacity: 0;
              transform: translateX(-8px) translateY(-50%) scaleX(0.18) scaleY(0.88);
            }
            to {
              opacity: 1;
              transform: translateX(0) translateY(-50%) scaleX(1) scaleY(1);
            }
          }
        `}
      </style>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-white/70 to-transparent" />
      <div className="relative z-10 grid h-full grid-cols-[minmax(190px,0.88fr)_minmax(260px,1.24fr)_minmax(190px,0.88fr)] items-center gap-5">
        <div className="flex h-[340px] flex-col gap-3">
          <div className={isMemorial ? 'relative h-[330px]' : 'relative h-[112px]'}>
            <HomeCard
              cardRef={moodCardRef}
              className={isMemorial ? 'flex h-full flex-col' : 'h-full'}
              contentClassName={
                isMemorial ? 'flex flex-1 flex-col' : ''
              }
              icon={isMemorial ? '♥' : '☀'}
              iconClassName={isMemorial ? 'bg-purple-50 text-2xl text-purple-500' : ''}
              iconImageClassName="h-[65px] w-[65px] max-h-none max-w-none"
              iconSrc={
                isMemorial
                  ? '/images/auth/home-page/mood_memorial_icon.png'
                  : '/images/auth/home-page/mood_icon.png'
              }
              onClick={() => toggleHomePopover('mood')}
              showArrow
              arrowOpen={openPopover === 'mood'}
              arrowClassName={theme.primary}
              title="今日心情"
            >
              {isMemorial ? (
                <div className="flex flex-1 flex-col items-center justify-between text-center">
                  <MemorialMoodVisual />

                  <div>
                    <p className={`text-[24px] leading-none font-black ${theme.primary}`}>
                      {currentMood}
                    </p>
                    <div className="mt-4 flex items-center justify-center gap-2 text-purple-300">
                      <span className="h-px w-12 bg-purple-200" />
                      <span className="text-sm leading-none">♥</span>
                      <span className="h-px w-12 bg-purple-200" />
                    </div>
                  </div>

                  <p className="text-[15px] font-bold leading-7 text-purple-700/80">
                    愿你在彩虹桥那边
                    <br />
                    每天都很安好。
                  </p>
                </div>
              ) : (
                <p className={`text-[22px] leading-tight font-black ${theme.primary}`}>
                  {currentMood}
                </p>
              )}
            </HomeCard>

            {openPopover === 'mood' ? (
              <MoodSelectPopover
                anchorRef={moodCardRef}
                onSelect={handleMoodSelect}
                options={moodOptions}
                popoverRef={homePopoverRef}
                selectedMood={currentMood}
                status={status}
              />
            ) : null}
          </div>

          {!isMemorial ? (
            <>
              <div className="relative flex-[1.1]">
                <HomeCard
                  arrowClassName={theme.primary}
                  arrowOpen={openPopover === 'diet'}
                  cardRef={dietCardRef}
                  className="relative flex h-full flex-col justify-between"
                  contentClassName="!mt-0"
                  iconImageClassName="h-[65px] w-[65px] max-h-none max-w-none translate-x-[2px]"
                  iconSrc="/images/auth/home-page/food_icon.png"
                  onClick={() => toggleHomePopover('diet')}
                  showArrow
                  title="今日饮食"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="shrink-0 whitespace-nowrap text-[15px] leading-none font-black text-stone-800">
                      {dietPreview.count > 0
                        ? `已记录 ${dietPreview.count} 项`
                        : '未记录'}
                    </p>
                    {dietPreview.count > 0 ? (
                      <div className="flex min-w-0 max-w-[128px] flex-nowrap justify-end gap-1.5 overflow-hidden whitespace-nowrap">
                        {dietPreview.visibleItems.map((item) => (
                          <span
                            className="max-w-[50px] shrink-0 truncate rounded-full bg-orange-50 px-2 py-0.5 text-[11px] font-black leading-5 text-orange-500"
                            key={item}
                          >
                            {item}
                          </span>
                        ))}
                        {dietPreview.remainingCount > 0 ? (
                          <span className="shrink-0 rounded-full bg-orange-100 px-2 py-0.5 text-[11px] font-black leading-5 text-orange-500">
                            +{dietPreview.remainingCount}
                          </span>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                </HomeCard>

                {openPopover === 'diet' ? (
                  <DietRecordPopover
                    anchorRef={dietCardRef}
                    draft={dietDraft}
                    onChange={setDietDraft}
                    onSave={handleDietSave}
                    popoverRef={homePopoverRef}
                  />
                ) : null}
              </div>

              <div className="relative flex-1">
                <HomeCard
                  arrowClassName={theme.primary}
                  arrowOpen={openPopover === 'activity'}
                  cardRef={activityCardRef}
                  className="h-full"
                  iconImageClassName="h-[65px] w-[65px] max-h-none max-w-none translate-x-[2px]"
                  iconSrc="/images/auth/home-page/activity_icon.png"
                  onClick={() => toggleHomePopover('activity')}
                  showArrow
                  title="今日活动"
                >
                  <p className="text-[20px] leading-tight font-black text-stone-800">
                    {activitySummary}
                  </p>
                  <div className="mt-3 h-2 rounded-full bg-orange-100">
                    <div className="h-full w-2/3 rounded-full bg-orange-400" />
                  </div>
                </HomeCard>

                {openPopover === 'activity' ? (
                  <ActivityRecordPopover
                    anchorRef={activityCardRef}
                    draft={activityDraft}
                    onChange={setActivityDraft}
                    onSave={handleActivitySave}
                    popoverRef={homePopoverRef}
                  />
                ) : null}
              </div>
            </>
          ) : null}
        </div>

        <div className="relative flex h-full -translate-y-2 flex-col items-center justify-center">
          <img
            alt=""
            aria-hidden="true"
            className={`${centerGrassBaseClass} ${activeCenterGrassClass} ${
              isMemorial ? 'opacity-0' : 'opacity-100'
            }`}
            decoding="async"
            src="/images/auth/home-page/active_central_grass.png"
          />
          <img
            alt=""
            aria-hidden="true"
            className={`${centerGrassBaseClass} ${memorialCenterGrassClass} ${
              isMemorial ? 'opacity-100' : 'opacity-0'
            }`}
            decoding="async"
            src="/images/auth/home-page/memorial_central_grass.png"
          />
          <div
            className={`relative z-10 flex h-[min(30vh,270px)] w-[min(27vw,330px)] cursor-pointer items-center justify-center rounded-[34px] border border-white/70 backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/90 ${
              isMemorial
                ? 'bg-gradient-to-b from-purple-100/80 to-white/80'
                : 'bg-gradient-to-b from-orange-100/80 to-white/80'
            } shadow-[inset_0_-18px_48px_rgba(255,255,255,0.7)]`}
          >
            {isMemorial ? (
              <span className="absolute top-6 h-7 w-20 rounded-full border-4 border-purple-200/80" />
            ) : null}
            <span
              className={`absolute bottom-7 h-12 w-44 rounded-[50%] ${
                isMemorial ? 'bg-purple-200/45' : 'bg-orange-200/45'
              } blur-sm`}
            />
            <img
              alt={pet.name || '奶糖'}
              className={`relative z-10 ${
                pet.avatar ? 'h-40 w-40 rounded-full object-cover' : 'h-36 w-36 object-contain'
              }`}
              src={petImage}
            />
          </div>

          <div className="relative z-30 mt-4 flex translate-y-12 items-center gap-2.5 rounded-full bg-white/86 px-[18px] py-2.5 shadow-[0_12px_28px_rgba(116,72,28,0.12)]">
            <span className="text-[13px] font-black leading-none text-stone-500">
              {pet.breed || '布偶猫'}
            </span>
            <span className={`h-2 w-2 rounded-full ${theme.primaryBg}`} />
            <span className="text-[15px] font-black leading-none text-stone-900">
              {pet.name || '奶糖'}
            </span>
            <span className={`h-2 w-2 rounded-full ${theme.primaryBg}`} />
            <span className="text-[13px] font-black leading-none text-stone-500">
              {ageText}
            </span>
          </div>
        </div>

        <div className="flex h-[330px] flex-col gap-3">
          <HomeCard
            className="h-[112px]"
            icon={isMemorial ? '☆' : undefined}
            iconImageClassName={isMemorial ? 'h-8 w-8' : undefined}
            iconSrc={
              isMemorial
                ? '/images/auth/home-page/calendar_memorial_icon.png'
                : '/images/auth/home-page/important_days_icon.png'
            }
            title="重要日子"
          >
            <div className="flex items-center justify-between gap-4">
              <p className="text-[13px] font-bold leading-5 text-stone-500">
                距离生日还有
              </p>
              <p
                className={`shrink-0 pr-1 text-[32px] leading-none font-black ${theme.primary}`}
              >
                48 天
              </p>
            </div>
          </HomeCard>

          {isMemorial ? (
            <HomeCard
              className="flex-1"
              iconImageClassName="h-8 w-8"
              iconSrc="/images/auth/home-page/precious_memories_memorial_icon.png"
              title="珍贵瞬间"
            >
              <MemorialPreciousMomentsGrid
                isLoading={isMemorialPreciousLoading}
                photos={memorialPreciousMoments}
              />
            </HomeCard>
          ) : (
            <>
              <HomeCard
                className="flex-1"
                iconSrc="/images/auth/home-page/growth_tip_icon.png"
                title="成长小贴士"
              >
                <p className="text-[13px] font-semibold leading-5 text-stone-500">
                  春季换毛季，记得多梳毛哦~
                </p>
              </HomeCard>

              <HomeCard
                className="flex-1"
                iconSrc="/images/auth/home-page/latest_memory_icon.png"
                title="最新回忆"
              >
                <div className="flex items-center gap-2.5">
                  {latestActiveMemory?.image ? (
                    <img
                      alt={latestActiveMemory.title}
                      className="h-12 w-14 shrink-0 rounded-xl object-cover shadow-inner"
                      src={latestActiveMemory.image}
                    />
                  ) : (
                    <div className="h-12 w-14 shrink-0 rounded-xl bg-gradient-to-br from-orange-200 to-white shadow-inner" />
                  )}
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-black leading-5 text-stone-800">
                      {latestActiveMemory
                        ? formatTimelineDate(latestActiveMemory.date)
                        : '暂无回忆'}
                    </p>
                    <p className="mt-1 truncate text-xs font-black leading-4 text-stone-600">
                      {latestActiveMemory?.title || '去时间线记录第一个瞬间'}
                    </p>
                    {latestActiveMemory?.note ? (
                      <p className="mt-0.5 line-clamp-1 text-[11px] font-semibold leading-4 text-stone-400">
                        {latestActiveMemory.note}
                      </p>
                    ) : null}
                  </div>
                </div>
              </HomeCard>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Home
