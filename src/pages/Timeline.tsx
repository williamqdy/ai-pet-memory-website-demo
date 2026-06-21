import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useMainPetLayout } from '../components/MainLayout'
import { mockTimelineEvents } from '../data/mockData'
import type { PetStatus, TimelineEvent } from '../types'
import { getStorageItem, setStorageItem, STORAGE_KEYS } from '../utils/storage'

type TimelineDraft = {
  date: string
  image: string
  note: string
  title: string
}

type TimelineDrawerMode = 'add' | 'edit'

type TimelineFieldErrors = Partial<
  Record<'date' | 'image' | 'title', string>
>

type TimelineTone = {
  accent: string
  accentBg: string
  accentBorder: string
  button: string
  chipActive: string
  chipInactive: string
  focus: string
  glow: string
  hover: string
  line: string
  soft: string
  text: string
}

type TimelineCalendarProps = {
  anchorRef: React.RefObject<HTMLButtonElement | null>
  onSelect: (date: string) => void
  popoverRef: React.RefObject<HTMLDivElement | null>
  selectedDate: string
  tone: TimelineTone
}

const timelineStorageKey = STORAGE_KEYS.timelineEvents

const timelineTones: Record<PetStatus, TimelineTone> = {
  active: {
    accent: 'text-orange-500',
    accentBg: 'bg-orange-500',
    accentBorder: 'border-orange-200',
    button:
      'bg-gradient-to-r from-orange-600 to-orange-500 shadow-[0_18px_34px_rgba(234,88,12,0.26)] hover:from-orange-500 hover:to-orange-400',
    chipActive: 'bg-orange-500 text-white',
    chipInactive: 'bg-orange-50 text-orange-500',
    focus:
      'focus:border-orange-300 focus:ring-orange-100 focus:shadow-[0_0_0_3px_rgba(251,146,60,0.14)]',
    glow: 'shadow-[0_18px_44px_rgba(205,116,35,0.13)]',
    hover: 'hover:bg-orange-100 hover:text-orange-700',
    line: 'border-orange-300',
    soft: 'bg-orange-50/78',
    text: 'text-orange-600',
  },
  memorial: {
    accent: 'text-purple-500',
    accentBg: 'bg-purple-500',
    accentBorder: 'border-purple-200',
    button:
      'bg-gradient-to-r from-purple-600 to-purple-500 shadow-[0_18px_34px_rgba(126,34,206,0.24)] hover:from-purple-500 hover:to-purple-400',
    chipActive: 'bg-purple-500 text-white',
    chipInactive: 'bg-purple-50 text-purple-500',
    focus:
      'focus:border-purple-300 focus:ring-purple-100 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.14)]',
    glow: 'shadow-[0_18px_44px_rgba(126,34,206,0.12)]',
    hover: 'hover:bg-purple-100 hover:text-purple-700',
    line: 'border-purple-300',
    soft: 'bg-purple-50/78',
    text: 'text-purple-600',
  },
}

const defaultTimelineEvents: TimelineEvent[] = [
  {
    date: '2023-03-12',
    id: 'active-first-home',
    image: '',
    note: '欢迎你来到我们家，开启了幸福的日子！',
    petId: 'pet-naitang',
    status: 'active',
    title: '第一次回家',
  },
  {
    date: '2023-04-02',
    id: 'active-first-bath',
    image: '',
    note: '有点紧张，但好像很乖，瞬间香香～',
    petId: 'pet-naitang',
    status: 'active',
    title: '第一次洗澡',
  },
  {
    date: '2024-03-12',
    id: 'active-birthday',
    image: '',
    note: '2岁生日派对，愿你每天都开心！',
    petId: 'pet-naitang',
    status: 'active',
    title: '生日快乐',
  },
  {
    date: '2024-05-20',
    id: 'active-park-walk',
    image: '',
    note: '阳光正好，和你一起散步好快乐！',
    petId: 'pet-naitang',
    status: 'active',
    title: '公园散步',
  },
  {
    date: '2023-03-12',
    id: 'memorial-first-home',
    image: '',
    note: '那天你走进家门，命运给了我们彼此温暖。',
    petId: 'pet-naitang',
    status: 'memorial',
    title: '第一次回家',
  },
  {
    date: '2023-06-18',
    id: 'memorial-favorite-toy',
    image: '',
    note: '你总是把它叼在哪里，真的好可爱。',
    petId: 'pet-naitang',
    status: 'memorial',
    title: '最爱的玩具',
  },
  {
    date: '2024-07-10',
    id: 'memorial-last-walk',
    image: '',
    note: '那天风很温柔，你却慢慢走了很久。',
    petId: 'pet-naitang',
    status: 'memorial',
    title: '最后一次散步',
  },
  {
    date: '2024-07-17',
    id: 'memorial-missing-you',
    image: '',
    note: '你在每一缕微风、每片花瓣里，陪着我们走过想你。',
    petId: 'pet-naitang',
    status: 'memorial',
    title: '想念你',
  },
]

const emptyDraft: TimelineDraft = {
  date: '',
  image: '',
  note: '',
  title: '',
}

const getToday = () => new Date().toISOString().slice(0, 10)

const formatDateForValue = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

const formatDateForDisplay = (date: string) =>
  date ? date.replaceAll('-', '.') : '选择日期'

const parseDateValue = (date: string) => {
  const [year, month, day] = date.split('-').map(Number)

  if (!year || !month || !day) {
    return new Date()
  }

  return new Date(year, month - 1, day)
}

const getCalendarDays = (viewDate: Date) => {
  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const firstDay = new Date(year, month, 1)
  const leadingEmptyDays = (firstDay.getDay() + 6) % 7
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const days: Array<number | null> = Array.from(
    { length: leadingEmptyDays },
    () => null,
  )

  for (let day = 1; day <= daysInMonth; day += 1) {
    days.push(day)
  }

  while (days.length % 7 !== 0) {
    days.push(null)
  }

  return days
}

const getYearPageStart = (year: number) => Math.floor(year / 12) * 12

const deletedTimelineStorageKey = 'petMemory:timelineDeletedEventIds'

const readDeletedTimelineEventIds = () => {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const rawValue = window.localStorage.getItem(deletedTimelineStorageKey)

    if (!rawValue) {
      return []
    }

    const value = JSON.parse(rawValue)

    return Array.isArray(value)
      ? value.filter((item): item is string => typeof item === 'string')
      : []
  } catch {
    return []
  }
}

const saveDeletedTimelineEventIds = (eventIds: string[]) => {
  if (typeof window === 'undefined') {
    return
  }

  try {
    window.localStorage.setItem(
      deletedTimelineStorageKey,
      JSON.stringify(eventIds),
    )
  } catch {
    // localStorage is best-effort for this front-end demo.
  }
}

const readTimelineEvents = () => {
  const savedEvents = getStorageItem<TimelineEvent[]>(timelineStorageKey, [])
  const deletedEventIds = new Set(readDeletedTimelineEventIds())
  const visibleDefaultEvents = defaultTimelineEvents.filter(
    (event) => !deletedEventIds.has(event.id),
  )

  if (savedEvents.length === 0) {
    return visibleDefaultEvents
  }

  const defaultIds = new Set(defaultTimelineEvents.map((event) => event.id))
  const legacySeedIds = new Set(mockTimelineEvents.map((event) => event.id))
  const savedEventsById = new Map(savedEvents.map((event) => [event.id, event]))
  const mergedDefaultEvents = visibleDefaultEvents.map(
    (event) => savedEventsById.get(event.id) || event,
  )
  const savedUserEvents = savedEvents.filter(
    (event) =>
      !defaultIds.has(event.id) &&
      !legacySeedIds.has(event.id) &&
      !deletedEventIds.has(event.id),
  )

  return [...mergedDefaultEvents, ...savedUserEvents]
}

const formatTimelineDate = (date: string) => date.replaceAll('-', '.')

const getTimelineImage = (index: number, status: PetStatus) => {
  const activeGradients = [
    'from-orange-200 via-yellow-100 to-white',
    'from-amber-100 via-orange-200 to-white',
    'from-rose-100 via-orange-100 to-white',
    'from-lime-100 via-orange-100 to-white',
  ]
  const memorialGradients = [
    'from-purple-200 via-white to-pink-100',
    'from-violet-100 via-purple-200 to-white',
    'from-indigo-100 via-purple-100 to-white',
    'from-fuchsia-100 via-white to-purple-100',
  ]

  return status === 'active'
    ? activeGradients[index % activeGradients.length]
    : memorialGradients[index % memorialGradients.length]
}

const CalendarPopover = ({
  anchorRef,
  onSelect,
  popoverRef,
  selectedDate,
  tone,
}: TimelineCalendarProps) => {
  const selected = parseDateValue(selectedDate)
  const today = new Date()
  const [viewDate, setViewDate] = useState(
    () => new Date(selected.getFullYear(), selected.getMonth(), 1),
  )
  const [viewMode, setViewMode] = useState<'date' | 'year'>('date')
  const [yearPageStart, setYearPageStart] = useState(() =>
    getYearPageStart(selected.getFullYear()),
  )
  const [position, setPosition] = useState<{
    left: number
    top: number
  } | null>(null)
  const calendarDays = getCalendarDays(viewDate)
  const visibleYears = Array.from(
    { length: 12 },
    (_, index) => yearPageStart + index,
  )
  const weekdays = ['一', '二', '三', '四', '五', '六', '日']

  useLayoutEffect(() => {
    const updatePosition = () => {
      const anchor = anchorRef.current

      if (!anchor) {
        return
      }

      const rect = anchor.getBoundingClientRect()
      const popoverHeight = popoverRef.current?.offsetHeight || 352
      const safeGap = 18
      const sideGap = 14
      const width = 320
      const left = Math.max(safeGap, rect.left - width - sideGap)
      const desiredTop = rect.top + rect.height / 2 - popoverHeight / 2
      const maxTop = Math.max(
        safeGap,
        window.innerHeight - popoverHeight - safeGap,
      )

      setPosition({
        left,
        top: Math.min(Math.max(safeGap, desiredTop), maxTop),
      })
    }

    updatePosition()
    window.addEventListener('resize', updatePosition)

    return () => {
      window.removeEventListener('resize', updatePosition)
    }
  }, [anchorRef, popoverRef, viewDate, viewMode])

  const goToMonth = (offset: number) => {
    setViewDate(
      (date) => new Date(date.getFullYear(), date.getMonth() + offset, 1),
    )
  }

  const selectYear = (year: number) => {
    setViewDate((date) => new Date(year, date.getMonth(), 1))
    setYearPageStart(getYearPageStart(year))
    setViewMode('date')
  }

  return createPortal(
    <div
      className="fixed z-[95] flex h-[352px] w-[320px] max-w-[calc(100vw-32px)] origin-right flex-col overflow-hidden rounded-[24px] border border-white/80 bg-white/92 p-4 shadow-[0_18px_44px_rgba(87,66,40,0.18)] backdrop-blur"
      ref={popoverRef}
      style={{
        animation:
          'timelineDatePopoverIn 260ms cubic-bezier(0.22, 1, 0.36, 1) both',
        left: position ? `${position.left}px` : 0,
        top: position ? `${position.top}px` : 0,
        transformOrigin: 'right center',
        visibility: position ? 'visible' : 'hidden',
      }}
    >
      <div className="flex h-9 shrink-0 items-center justify-between">
        <button
          className={`flex h-9 w-9 items-center justify-center rounded-full ${tone.chipInactive} text-lg font-black transition hover:bg-white active:scale-[0.97]`}
          onClick={(event) => {
            event.stopPropagation()
            if (viewMode === 'year') {
              setYearPageStart((year) => year - 12)
            } else {
              goToMonth(-1)
            }
          }}
          type="button"
        >
          ‹
        </button>
        {viewMode === 'year' ? (
          <p className="text-sm font-black text-stone-900">
            {yearPageStart} - {yearPageStart + 11}
          </p>
        ) : (
          <p className="flex items-center justify-center gap-1 text-sm font-black text-stone-900">
            <button
              className={`cursor-pointer rounded-full px-3 py-1 transition duration-200 ease-out ${tone.accent} ${tone.hover}`}
              onClick={(event) => {
                event.stopPropagation()
                setYearPageStart(getYearPageStart(viewDate.getFullYear()))
                setViewMode('year')
              }}
              type="button"
            >
              {viewDate.getFullYear()}年
            </button>
            <span>{viewDate.getMonth() + 1}月</span>
          </p>
        )}
        <button
          className={`flex h-9 w-9 items-center justify-center rounded-full ${tone.chipInactive} text-lg font-black transition hover:bg-white active:scale-[0.97]`}
          onClick={(event) => {
            event.stopPropagation()
            if (viewMode === 'year') {
              setYearPageStart((year) => year + 12)
            } else {
              goToMonth(1)
            }
          }}
          type="button"
        >
          ›
        </button>
      </div>

      <div
        className="min-h-0 flex-1 transition-all duration-200 ease-out"
        key={viewMode}
        style={{
          animation:
            'timelineCalendarViewIn 220ms cubic-bezier(0.22, 1, 0.36, 1) both',
        }}
      >
        {viewMode === 'year' ? (
          <div className="grid h-full grid-cols-3 grid-rows-4 gap-2.5">
            {visibleYears.map((year) => (
              <button
                className={`flex h-full min-h-[52px] transform-gpu cursor-pointer items-center justify-center rounded-[18px] text-sm font-black transition duration-150 ease-out active:scale-[0.97] ${
                  year === viewDate.getFullYear()
                    ? tone.chipActive
                    : `text-stone-600 ${tone.hover}`
                }`}
                key={year}
                onClick={(event) => {
                  event.stopPropagation()
                  selectYear(year)
                }}
                type="button"
              >
                {year}
              </button>
            ))}
          </div>
        ) : (
          <>
            <div className="mt-4 grid grid-cols-7 gap-1 text-center text-xs font-black text-stone-400">
              {weekdays.map((weekday) => (
                <span key={weekday}>{weekday}</span>
              ))}
            </div>

            <div className="mt-2 grid grid-cols-7 gap-1">
              {calendarDays.map((day, index) =>
                day ? (
                  <button
                    className={`h-9 transform-gpu cursor-pointer rounded-full text-sm font-black transition duration-150 ease-out active:scale-[0.97] ${
                      selected.getFullYear() === viewDate.getFullYear() &&
                      selected.getMonth() === viewDate.getMonth() &&
                      selected.getDate() === day
                        ? tone.chipActive
                        : today.getFullYear() === viewDate.getFullYear() &&
                            today.getMonth() === viewDate.getMonth() &&
                            today.getDate() === day
                          ? `border ${tone.accentBorder} bg-white/60 ${tone.accent} ${tone.hover}`
                          : `text-stone-600 ${tone.hover}`
                    }`}
                    key={`${viewDate.getFullYear()}-${viewDate.getMonth()}-${day}`}
                    onClick={(event) => {
                      event.stopPropagation()
                      onSelect(
                        formatDateForValue(
                          new Date(
                            viewDate.getFullYear(),
                            viewDate.getMonth(),
                            day,
                          ),
                        ),
                      )
                    }}
                    type="button"
                  >
                    {day}
                  </button>
                ) : (
                  <span key={`empty-${index}`} />
                ),
              )}
            </div>
          </>
        )}
      </div>
    </div>,
    document.body,
  )
}

const Timeline = () => {
  const { pet, status } = useMainPetLayout()
  const isMemorial = status === 'memorial'
  const tone = timelineTones[status]
  const [events, setEvents] = useState<TimelineEvent[]>(readTimelineEvents)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [draft, setDraft] = useState<TimelineDraft>(emptyDraft)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<TimelineFieldErrors>({})
  const [drawerMode, setDrawerMode] = useState<TimelineDrawerMode>('add')
  const [editingEventId, setEditingEventId] = useState<string | null>(null)
  const [isClosingDrawer, setIsClosingDrawer] = useState(false)
  const [selectedTimelineEvent, setSelectedTimelineEvent] =
    useState<TimelineEvent | null>(null)
  const [pendingDeleteEventId, setPendingDeleteEventId] = useState<
    string | null
  >(null)
  const [deleteConfirmPosition, setDeleteConfirmPosition] = useState<{
    left: number
    top: number
  } | null>(null)
  const dateButtonRef = useRef<HTMLButtonElement | null>(null)
  const calendarRef = useRef<HTMLDivElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const drawerRef = useRef<HTMLDivElement | null>(null)
  const suppressNextTimelineCardClickRef = useRef(false)
  const visibleEvents = events
    .map((event, index) => ({ event, index }))
    .filter(({ event }) => event.status === status)
    .sort((first, second) => {
      const dateCompare = second.event.date.localeCompare(first.event.date)

      if (dateCompare !== 0) {
        return dateCompare
      }

      return second.index - first.index
    })
    .map(({ event }) => event)
  const drawerHint = isMemorial
    ? '把想念里的片段，温柔地补进时间线。'
    : '记录下今天和 TA 一起走过的小小闪光。'
  const selectedEventIndex = selectedTimelineEvent
    ? Math.max(
        visibleEvents.findIndex((event) => event.id === selectedTimelineEvent.id),
        0,
      )
    : 0
  const pendingDeleteEvent = pendingDeleteEventId
    ? visibleEvents.find((event) => event.id === pendingDeleteEventId) || null
    : null

  const closeDeleteConfirm = () => {
    setPendingDeleteEventId(null)
    setDeleteConfirmPosition(null)
  }

  const openDeleteConfirm = (
    eventId: string,
    trigger: HTMLButtonElement,
  ) => {
    if (pendingDeleteEventId === eventId) {
      closeDeleteConfirm()
      return
    }

    const rect = trigger.getBoundingClientRect()
    const popoverWidth = 152
    const popoverHeight = 86
    const gap = 8
    const sidePadding = 12
    const desiredTop = rect.bottom + gap
    const shouldOpenUp =
      desiredTop + popoverHeight > window.innerHeight - sidePadding

    setSelectedTimelineEvent(null)
    setPendingDeleteEventId(eventId)
    setDeleteConfirmPosition({
      left: Math.min(
        window.innerWidth - popoverWidth - sidePadding,
        Math.max(sidePadding, rect.right - popoverWidth),
      ),
      top: shouldOpenUp
        ? Math.max(sidePadding, rect.top - popoverHeight - gap)
        : desiredTop,
    })
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsCalendarOpen(false)
        setSelectedTimelineEvent(null)
        closeDeleteConfirm()
        if (isDrawerOpen) {
          closeDrawer()
        }
      }
    }

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node
      const targetElement = event.target as HTMLElement | null

      if (
        isCalendarOpen &&
        !calendarRef.current?.contains(target) &&
        !dateButtonRef.current?.contains(target)
      ) {
        setIsCalendarOpen(false)
      }

      if (
        pendingDeleteEventId &&
        targetElement &&
        !targetElement.closest('[data-timeline-delete-confirm]') &&
        !targetElement.closest('[data-timeline-delete-trigger]') &&
        !targetElement.closest('[data-timeline-edit-trigger]')
      ) {
        if (targetElement.closest('[data-timeline-event-card]')) {
          suppressNextTimelineCardClickRef.current = true
        }

        closeDeleteConfirm()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('mousedown', handlePointerDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handlePointerDown)
    }
  }, [isCalendarOpen, isDrawerOpen, pendingDeleteEventId])

  useEffect(() => {
    closeDeleteConfirm()
  }, [status])

  const openDrawer = () => {
    setDrawerMode('add')
    setEditingEventId(null)
    setDraft(emptyDraft)
    setError('')
    setFieldErrors({})
    setIsCalendarOpen(false)
    setSelectedTimelineEvent(null)
    closeDeleteConfirm()
    setIsClosingDrawer(false)
    setIsDrawerOpen(true)
  }

  const openEditDrawer = (event: TimelineEvent) => {
    setDrawerMode('edit')
    setEditingEventId(event.id)
    setDraft({
      date: event.date || '',
      image: event.image || '',
      note: event.note || '',
      title: event.title || '',
    })
    setError('')
    setFieldErrors({})
    setIsCalendarOpen(false)
    setSelectedTimelineEvent(null)
    closeDeleteConfirm()
    setIsClosingDrawer(false)
    setIsDrawerOpen(true)
  }

  const closeDrawer = () => {
    setIsCalendarOpen(false)
    setIsClosingDrawer(true)
    window.setTimeout(() => {
      setIsDrawerOpen(false)
      setIsClosingDrawer(false)
      setDrawerMode('add')
      setEditingEventId(null)
      setDraft(emptyDraft)
      setError('')
      setFieldErrors({})
    }, 260)
  }

  const saveEvents = (nextEvents: TimelineEvent[]) => {
    setEvents(nextEvents)
    setStorageItem(timelineStorageKey, nextEvents)
  }

  const clearFieldError = (field: keyof TimelineFieldErrors) => {
    setFieldErrors((current) => {
      if (!current[field]) {
        return current
      }

      const nextErrors = { ...current }
      delete nextErrors[field]
      return nextErrors
    })
  }

  const deleteTimelineEvent = (eventId: string) => {
    if (defaultTimelineEvents.some((event) => event.id === eventId)) {
      saveDeletedTimelineEventIds([
        ...new Set([...readDeletedTimelineEventIds(), eventId]),
      ])
    }

    saveEvents(events.filter((event) => event.id !== eventId))
    setSelectedTimelineEvent((current) =>
      current?.id === eventId ? null : current,
    )
    closeDeleteConfirm()
  }

  const applySelectedFile = (file?: File) => {
    if (!file) {
      return
    }

    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      setError('请上传 JPG 或 PNG 图片')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('图片大小不能超过 5MB')
      return
    }

    setError('')
    clearFieldError('image')
    setDraft((current) => ({
      ...current,
      image: URL.createObjectURL(file),
    }))
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    applySelectedFile(event.target.files?.[0])
  }

  const handleDrop = (event: React.DragEvent<HTMLButtonElement>) => {
    event.preventDefault()
    applySelectedFile(event.dataTransfer.files?.[0])
  }

  const handleSave = () => {
    const nextTitle = draft.title.trim()
    const nextNote = draft.note.trim()

    const nextFieldErrors: TimelineFieldErrors = {}

    if (!nextTitle) {
      nextFieldErrors.title = '请输入事件标题'
    }

    if (!draft.date) {
      nextFieldErrors.date = '请选择时间'
    }

    if (!draft.image) {
      nextFieldErrors.image = '请上传照片'
    }

    setFieldErrors(nextFieldErrors)

    if (Object.keys(nextFieldErrors).length > 0) {
      setError('')
      return
    }

    if (drawerMode === 'edit' && editingEventId) {
      let updatedEvent: TimelineEvent | null = null
      const nextEvents = events.map((event) => {
        if (event.id !== editingEventId) {
          return event
        }

        updatedEvent = {
          ...event,
          date: draft.date,
          image: draft.image,
          note: nextNote || undefined,
          title: nextTitle,
        }

        return updatedEvent
      })

      saveEvents(nextEvents)
      setSelectedTimelineEvent((current) =>
        current?.id === editingEventId && updatedEvent ? updatedEvent : current,
      )
      closeDrawer()
      return
    }

    const nextEvent: TimelineEvent = {
      date: draft.date,
      id: `timeline-${status}-${Date.now()}`,
      image: draft.image,
      note: nextNote || undefined,
      petId: pet.id,
      status,
      title: nextTitle,
    }
    saveEvents([...events, nextEvent])
    closeDrawer()
  }

  return (
    <div className="relative h-full overflow-hidden px-7 py-5">
      <style>
        {`
          @keyframes timelineDrawerOverlayIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          @keyframes timelineDrawerOverlayOut {
            from { opacity: 1; }
            to { opacity: 0; }
          }

          @keyframes timelineDrawerIn {
            from {
              opacity: 0;
              transform: translateX(100%);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          @keyframes timelineDrawerOut {
            from {
              opacity: 1;
              transform: translateX(0);
            }
            to {
              opacity: 0;
              transform: translateX(100%);
            }
          }

          @keyframes timelineDatePopoverIn {
            from {
              opacity: 0;
              transform: translateX(8px) scaleX(0.92) scaleY(0.96);
            }
            to {
              opacity: 1;
              transform: translateX(0) scaleX(1) scaleY(1);
            }
          }

          @keyframes timelineCalendarViewIn {
            from {
              opacity: 0;
              transform: translateY(6px) scale(0.98);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          @keyframes timelineDetailOverlayIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          @keyframes timelineDetailModalIn {
            from {
              opacity: 0;
              transform: translate(-50%, -48%) scale(0.96);
            }
            to {
              opacity: 1;
              transform: translate(-50%, -50%) scale(1);
            }
          }

          @keyframes timelineDeleteConfirmIn {
            from {
              opacity: 0;
              transform: translateY(-4px) scale(0.96);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          .timeline-scroll-area {
            scrollbar-color: transparent transparent;
            scrollbar-width: thin;
          }

          .timeline-scroll-area:hover,
          .timeline-scroll-area:focus-within {
            scrollbar-color: var(--timeline-scroll-thumb) transparent;
          }

          .timeline-scroll-area::-webkit-scrollbar {
            width: 6px;
          }

          .timeline-scroll-area::-webkit-scrollbar-track {
            background: transparent;
          }

          .timeline-scroll-area::-webkit-scrollbar-thumb {
            background: transparent;
            border-radius: 999px;
            transition: background-color 180ms ease-out;
          }

          .timeline-scroll-area:hover::-webkit-scrollbar-thumb,
          .timeline-scroll-area:focus-within::-webkit-scrollbar-thumb {
            background: var(--timeline-scroll-thumb);
          }
        `}
      </style>

      <div className="relative z-10 grid h-full grid-cols-[190px_minmax(0,1fr)] gap-5">
        <aside className="relative flex items-center justify-center">
          <div className="pointer-events-none relative h-[220px] w-[178px] -translate-y-[99px] select-none">
            <img
              alt=""
              aria-hidden="true"
              className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-300 ease-out ${
                isMemorial ? 'opacity-0' : 'opacity-100'
              }`}
              src="/images/auth/home-page/beautiful_time.png"
            />
            <img
              alt=""
              aria-hidden="true"
              className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-300 ease-out ${
                isMemorial ? 'opacity-100' : 'opacity-0'
              }`}
              src="/images/auth/home-page/memorial_beautiful_time.png"
            />
          </div>
        </aside>

        <section className="flex min-h-0 min-w-0 flex-col py-2">
          <div className="mb-4 flex items-center justify-between pr-[14px]">
            <div>
              <p className={`text-sm font-black ${tone.accent}`}>Timeline</p>
              <h2 className="mt-1 text-[28px] font-black leading-none text-stone-900">
                时间线
              </h2>
            </div>
            <button
              className={`h-11 rounded-full px-6 text-sm font-black text-white transition duration-200 ease-out hover:-translate-y-0.5 active:scale-[0.97] ${tone.button}`}
              onClick={openDrawer}
              type="button"
            >
              添加时间轴
            </button>
          </div>

          <div
            className="timeline-scroll-area min-h-0 flex-1 overflow-y-auto pr-2 [scrollbar-gutter:stable]"
            data-status={status}
            onScroll={closeDeleteConfirm}
            style={{
              '--timeline-scroll-thumb': isMemorial
                ? 'rgba(168,85,247,0.34)'
                : 'rgba(249,115,22,0.34)',
            } as React.CSSProperties}
          >
            <div className="relative grid grid-cols-[82px_minmax(0,1fr)] gap-x-5 gap-y-3 pb-2">
              <div
                className={`pointer-events-none absolute bottom-5 left-[41px] top-5 -translate-x-1/2 border-l-4 border-dashed ${tone.line}`}
              />
            {visibleEvents.map((event, index) => (
              <div className="contents" key={event.id}>
                <div className="relative z-10 flex items-center justify-center py-3">
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 bg-white shadow-[0_10px_24px_rgba(87,66,40,0.14)] transition duration-200 ease-out hover:-translate-y-0.5 active:scale-[0.97] ${tone.line}`}
                  >
                    <img
                      alt=""
                      aria-hidden="true"
                      className="h-6 w-6 object-contain"
                      src={
                        isMemorial
                          ? '/images/auth/home-page/purple_paw_print.png'
                          : '/images/auth/home-page/orange_paw_print.png'
                      }
                    />
                  </span>
                </div>
              <article
                className={`group grid cursor-pointer grid-cols-[88px_minmax(0,1fr)_88px] items-center gap-4 rounded-[24px] border border-white/72 bg-white/82 p-3.5 text-left ${tone.glow} backdrop-blur transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-white/92 active:scale-[0.99]`}
                data-timeline-event-card
                key={event.id}
                onClick={() => {
                  if (
                    pendingDeleteEventId ||
                    suppressNextTimelineCardClickRef.current
                  ) {
                    suppressNextTimelineCardClickRef.current = false
                    closeDeleteConfirm()
                    return
                  }

                  setSelectedTimelineEvent(event)
                }}
              >
                {event.image ? (
                  <img
                    alt={event.title}
                    className="h-[74px] w-[88px] rounded-[18px] object-cover shadow-inner"
                    src={event.image}
                  />
                ) : (
                  <div
                    className={`flex h-[74px] w-[88px] items-center justify-center rounded-[18px] bg-gradient-to-br ${getTimelineImage(
                      index,
                      status,
                    )} text-2xl shadow-inner`}
                  >
                    {isMemorial ? '♡' : '🐱'}
                  </div>
                )}
                <div className="min-w-0">
                  <p className={`text-xs font-black ${tone.accent}`}>
                    {formatTimelineDate(event.date)}
                  </p>
                  <h3 className="mt-1 truncate text-[17px] font-black text-stone-900">
                    {event.title}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-[13px] font-semibold leading-5 text-stone-500">
                    {event.note}
                  </p>
                </div>
                <div className="flex h-10 items-center justify-end gap-2">
                  <button
                    aria-label={`编辑 ${event.title}`}
                    className={`grid h-10 w-10 cursor-pointer place-items-center rounded-2xl ${tone.soft} ${tone.accent} transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-white hover:shadow-md active:scale-[0.95]`}
                    data-timeline-edit-trigger
                    onClick={(clickEvent) => {
                      clickEvent.stopPropagation()
                      openEditDrawer(event)
                    }}
                    type="button"
                  >
                    <svg
                      aria-hidden="true"
                      className="h-[23px] w-[23px]"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M4 20h16"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeWidth="2.4"
                      />
                      <path
                        d="m14.5 5.5 4 4"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeWidth="2.4"
                      />
                      <path
                        d="M5.5 15.8 15.7 5.6a2 2 0 0 1 2.8 0l.1.1a2 2 0 0 1 0 2.8L8.4 18.7l-3.5.8.6-3.7Z"
                        stroke="currentColor"
                        strokeLinejoin="round"
                        strokeWidth="2.2"
                      />
                    </svg>
                  </button>
                  <button
                    aria-label={`删除 ${event.title}`}
                    className={`grid h-10 w-10 cursor-pointer place-items-center rounded-2xl ${tone.soft} ${tone.accent} transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-white hover:shadow-md active:scale-[0.95]`}
                    data-timeline-delete-trigger
                    onClick={(clickEvent) => {
                      clickEvent.stopPropagation()
                      openDeleteConfirm(event.id, clickEvent.currentTarget)
                    }}
                    type="button"
                  >
                    <span
                      aria-hidden="true"
                      className="relative block h-4 w-3.5 translate-y-[4px] rounded-b-[3px] border-2 border-current border-t-0"
                    >
                      <span className="absolute -top-1.5 left-1/2 h-1 w-4 -translate-x-1/2 rounded-full border-2 border-current" />
                      <span className="absolute -top-2 left-1/2 h-1 w-2 -translate-x-1/2 rounded-full bg-current" />
                    </span>
                  </button>
                </div>
              </article>
              </div>
            ))}
            </div>
          </div>
        </section>
      </div>

      {pendingDeleteEvent && deleteConfirmPosition
        ? createPortal(
            <div
              className="fixed z-[75] w-[152px] rounded-[18px] border border-white/80 bg-white/95 p-3 shadow-[0_18px_42px_rgba(47,28,8,0.18)] backdrop-blur"
              data-timeline-delete-confirm
              onClick={(event) => event.stopPropagation()}
              onMouseDown={(event) => event.stopPropagation()}
              style={{
                animation:
                  'timelineDeleteConfirmIn 180ms cubic-bezier(0.22, 1, 0.36, 1) both',
                left: `${deleteConfirmPosition.left}px`,
                top: `${deleteConfirmPosition.top}px`,
              }}
            >
              <p className="text-center text-xs font-black text-stone-700">
                确认删除？
              </p>
              <div className="mt-3 flex gap-2">
                <button
                  className="h-8 flex-1 cursor-pointer rounded-full bg-stone-50 text-xs font-black text-stone-500 transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-white hover:shadow-sm active:scale-[0.97]"
                  onClick={(event) => {
                    event.stopPropagation()
                    closeDeleteConfirm()
                  }}
                  type="button"
                >
                  取消
                </button>
                <button
                  className={`h-8 flex-1 cursor-pointer rounded-full text-xs font-black transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md active:scale-[0.97] ${tone.chipActive}`}
                  onClick={(event) => {
                    event.stopPropagation()
                    deleteTimelineEvent(pendingDeleteEvent.id)
                  }}
                  type="button"
                >
                  删除
                </button>
              </div>
            </div>,
            document.body,
          )
        : null}

      {selectedTimelineEvent
        ? createPortal(
            <div
              className="fixed inset-0 z-[100]"
              onClick={() => setSelectedTimelineEvent(null)}
            >
              <div
                className="absolute inset-0 bg-black/38"
                style={{
                  animation: 'timelineDetailOverlayIn 220ms ease-out both',
                }}
              />
              <section
                className="fixed left-1/2 top-1/2 z-[101] flex max-h-[calc(100vh-48px)] w-[min(560px,calc(100vw-44px))] flex-col overflow-hidden rounded-[30px] border border-white/80 bg-white/95 p-5 shadow-[0_28px_80px_rgba(47,28,8,0.24)] backdrop-blur"
                onClick={(event) => event.stopPropagation()}
                style={{
                  animation:
                    'timelineDetailModalIn 260ms cubic-bezier(0.22, 1, 0.36, 1) both',
                }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className={`text-xs font-black ${tone.accent}`}>
                      {formatTimelineDate(selectedTimelineEvent.date)}
                    </p>
                    <h3 className="mt-1 truncate text-2xl font-black text-stone-900">
                      {selectedTimelineEvent.title}
                    </h3>
                  </div>
                  <button
                    aria-label="关闭时间线详情"
                    className={`flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-white/80 text-lg font-black text-stone-500 shadow-sm transition duration-200 ease-out hover:-translate-y-0.5 hover:scale-105 hover:shadow-md active:scale-95 ${tone.hover}`}
                    onClick={() => setSelectedTimelineEvent(null)}
                    type="button"
                  >
                    ×
                  </button>
                </div>

                <div className="mt-5 min-h-0 overflow-y-auto pr-1">
                  {selectedTimelineEvent.image ? (
                    <img
                      alt={selectedTimelineEvent.title}
                      className="h-[280px] w-full rounded-[24px] object-cover shadow-inner"
                      src={selectedTimelineEvent.image}
                    />
                  ) : (
                    <div
                      className={`flex h-[280px] w-full items-center justify-center rounded-[24px] bg-gradient-to-br ${getTimelineImage(
                        selectedEventIndex,
                        status,
                      )} text-5xl shadow-inner`}
                    >
                      {isMemorial ? '♡' : '🐱'}
                    </div>
                  )}

                  <div className={`mt-4 rounded-[22px] ${tone.soft} px-4 py-3`}>
                    <p className="text-xs font-black text-stone-400">
                      想说的话
                    </p>
                    <p className="mt-2 text-sm font-semibold leading-7 text-stone-600">
                      {selectedTimelineEvent.note || '还没有留下备注'}
                    </p>
                  </div>
                </div>
              </section>
            </div>,
            document.body,
          )
        : null}

      {isDrawerOpen
        ? createPortal(
            <div
              className="fixed inset-0 z-[80]"
              onClick={closeDrawer}
            >
              <div
                className="absolute inset-0 bg-black/42"
                style={{
                  animation: `${
                    isClosingDrawer
                      ? 'timelineDrawerOverlayOut'
                      : 'timelineDrawerOverlayIn'
                  } 260ms ease-out both`,
                }}
              />
              <aside
                className="fixed right-0 top-0 z-[90] flex h-screen w-[31vw] min-w-[360px] max-w-[460px] flex-col overflow-hidden border-l border-white/70 bg-white/94 shadow-[0_0_80px_rgba(47,28,8,0.28)] backdrop-blur"
                onClick={(event) => event.stopPropagation()}
                ref={drawerRef}
                style={{
                  animation: `${
                    isClosingDrawer ? 'timelineDrawerOut' : 'timelineDrawerIn'
                  } 300ms cubic-bezier(0.22, 1, 0.36, 1) both`,
                }}
              >
                <div className="flex items-start justify-between border-b border-stone-100 px-6 py-5">
                  <div>
                    <p className={`text-xs font-black ${tone.accent}`}>
                      {isMemorial ? 'Memory Timeline' : 'Happy Timeline'}
                    </p>
                    <h3 className="mt-1 text-2xl font-black text-stone-900">
                      {drawerMode === 'edit' ? '编辑时间轴' : '添加时间轴'}
                    </h3>
                    <p className="mt-2 text-xs font-semibold leading-5 text-stone-500">
                      {drawerHint}
                    </p>
                  </div>
                  <button
                    aria-label="关闭时间轴抽屉"
                    className={`flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-white/80 text-lg font-black text-stone-500 shadow-sm transition duration-200 ease-out hover:-translate-y-0.5 hover:scale-105 hover:shadow-md active:scale-95 ${tone.hover}`}
                    onClick={closeDrawer}
                    type="button"
                  >
                    ×
                  </button>
                </div>

                <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-6 py-5">
                  <label className="block text-xs font-black text-stone-500">
                    事件 *
                    <input
                      className={`mt-2 h-11 w-full rounded-2xl border bg-white/82 px-4 text-sm font-bold text-stone-800 outline-none transition duration-200 ease-out placeholder:text-stone-300 ${
                        fieldErrors.title ? 'border-rose-300' : tone.accentBorder
                      } ${tone.focus}`}
                      maxLength={30}
                      onChange={(event) =>
                        {
                          clearFieldError('title')
                          setDraft((current) => ({
                            ...current,
                            title: event.target.value,
                          }))
                        }
                      }
                      placeholder="请输入事件标题"
                      value={draft.title}
                    />
                    <span className="mt-1 block min-h-[16px] text-xs font-black text-rose-400">
                      {fieldErrors.title || ''}
                    </span>
                  </label>

                  <label className="block text-xs font-black text-stone-500">
                    时间 *
                    <button
                      className={`mt-2 flex h-11 w-full items-center justify-between rounded-2xl border bg-white/82 px-4 text-left text-sm font-bold outline-none transition duration-200 ease-out ${
                        fieldErrors.date ? 'border-rose-300' : tone.accentBorder
                      } ${
                        draft.date ? 'text-stone-800' : 'text-stone-300'
                      } ${tone.focus}`}
                      onClick={() => setIsCalendarOpen((open) => !open)}
                      ref={dateButtonRef}
                      type="button"
                    >
                      {formatDateForDisplay(draft.date)}
                      <svg
                        aria-hidden="true"
                        className={`h-4 w-4 ${tone.accent}`}
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <rect
                          height="16"
                          rx="4"
                          stroke="currentColor"
                          strokeWidth="2.2"
                          width="17"
                          x="3.5"
                          y="4.5"
                        />
                        <path
                          d="M8 3v4M16 3v4M4 9h16"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeWidth="2.2"
                        />
                      </svg>
                    </button>
                    <span className="mt-1 block min-h-[16px] text-xs font-black text-rose-400">
                      {fieldErrors.date || ''}
                    </span>
                  </label>

                  <div>
                    <p className="text-xs font-black text-stone-500">照片 *</p>
                    <button
                      className={`mt-2 flex min-h-[138px] w-full cursor-pointer flex-col items-center justify-center rounded-[22px] border-2 border-dashed bg-white/62 px-4 text-center transition duration-200 ease-out hover:-translate-y-0.5 active:scale-[0.98] ${
                        fieldErrors.image ? 'border-rose-300' : tone.accentBorder
                      } ${tone.hover}`}
                      onClick={() => fileInputRef.current?.click()}
                      onDragOver={(event) => event.preventDefault()}
                      onDrop={handleDrop}
                      type="button"
                    >
                      {draft.image ? (
                        <img
                          alt="时间线照片预览"
                          className="h-[112px] w-full rounded-[18px] object-cover"
                          src={draft.image}
                        />
                      ) : (
                        <>
                          <span
                            className={`flex h-12 w-12 items-center justify-center rounded-2xl ${tone.soft} text-2xl ${tone.accent}`}
                          >
                            +
                          </span>
                          <span className="mt-3 text-sm font-black text-stone-700">
                            点击或拖拽上传照片
                          </span>
                          <span className="mt-1 text-xs font-semibold text-stone-400">
                            支持 JPG、PNG，最多 5MB
                          </span>
                        </>
                      )}
                    </button>
                    <span className="mt-1 block min-h-[16px] text-xs font-black text-rose-400">
                      {fieldErrors.image || ''}
                    </span>
                    <input
                      accept="image/jpeg,image/png"
                      className="hidden"
                      onChange={handleFileChange}
                      ref={fileInputRef}
                      type="file"
                    />
                  </div>

                  <label className="block text-xs font-black text-stone-500">
                    想说的话（可选）
                    <textarea
                      className={`mt-2 h-28 w-full resize-none rounded-2xl border bg-white/82 px-4 py-3 text-sm font-bold leading-6 text-stone-700 outline-none transition duration-200 ease-out placeholder:text-stone-300 ${tone.accentBorder} ${tone.focus}`}
                      maxLength={200}
                      onChange={(event) =>
                        setDraft((current) => ({
                          ...current,
                          note: event.target.value,
                        }))
                      }
                      placeholder="记录下这一刻的心情吧..."
                      value={draft.note}
                    />
                    <span className="mt-1 block text-right text-xs font-bold text-stone-400">
                      {draft.note.length}/200
                    </span>
                  </label>

                  {error ? (
                    <p className={`rounded-2xl px-4 py-3 text-xs font-black ${tone.soft} ${tone.accent}`}>
                      {error}
                    </p>
                  ) : null}
                </div>

                <div className="flex gap-3 border-t border-stone-100 px-6 py-5">
                  <button
                    className="h-11 flex-1 rounded-full border border-stone-200 bg-white/86 text-sm font-black text-stone-600 transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-white active:scale-[0.97]"
                    onClick={closeDrawer}
                    type="button"
                  >
                    取消
                  </button>
                  <button
                    className={`h-11 flex-1 rounded-full text-sm font-black text-white transition duration-200 ease-out hover:-translate-y-0.5 active:scale-[0.97] ${tone.button}`}
                    onClick={handleSave}
                    type="button"
                  >
                    {drawerMode === 'edit' ? '保存修改' : '保存'}
                  </button>
                </div>
              </aside>

              {isCalendarOpen ? (
                <CalendarPopover
                  anchorRef={dateButtonRef}
                  onSelect={(date) => {
                    clearFieldError('date')
                    setDraft((current) => ({ ...current, date }))
                    setIsCalendarOpen(false)
                  }}
                  popoverRef={calendarRef}
                  selectedDate={draft.date || getToday()}
                  tone={tone}
                />
              ) : null}
            </div>,
            document.body,
          )
        : null}
    </div>
  )
}

export default Timeline
