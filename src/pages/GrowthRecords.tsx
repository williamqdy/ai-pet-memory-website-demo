import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useMainPetLayout } from '../components/MainLayout'
import type { GrowthRecord, Pet, PetStatus, PetType } from '../types'
import { createDemoGrowthRecords } from '../utils/demoSeedData'
import { getStorageItem, setStorageItem, STORAGE_KEYS } from '../utils/storage'

type GrowthTone = {
  accent: string
  accentBg: string
  border: string
  button: string
  chipActive: string
  chipInactive: string
  glow: string
  hover: string
  iconBg: string
  soft: string
}

type GrowthDraft = {
  category: string
  description: string
  location: string
  nextReminder: string
  note: string
  recordDate: string
  title: string
}

type GrowthErrors = Partial<Record<'category' | 'recordDate' | 'title', string>>

type DrawerMode = 'add' | 'edit'

type GrowthMenuState = {
  left: number
  recordId: string
  top: number
}

type ProjectPickerState = {
  kind: 'deworming' | 'vaccine'
  left: number
  top: number
}

type GrowthDateField = 'nextReminder' | 'recordDate'

type DatePickerState = {
  field: GrowthDateField
  left: number
  top: number
}

type IconProps = {
  className?: string
}

const growthTones: Record<PetStatus, GrowthTone> = {
  active: {
    accent: 'text-orange-500',
    accentBg: 'bg-orange-500',
    border: 'border-orange-100',
    button:
      'bg-gradient-to-r from-orange-600 to-orange-500 shadow-[0_18px_34px_rgba(234,88,12,0.26)] hover:from-orange-500 hover:to-orange-400',
    chipActive: 'bg-orange-500 text-white shadow-[0_12px_24px_rgba(234,88,12,0.20)]',
    chipInactive: 'bg-white/72 text-orange-600 hover:bg-orange-50',
    glow: 'shadow-[0_18px_44px_rgba(205,116,35,0.12)]',
    hover: 'hover:bg-orange-50 hover:text-orange-700',
    iconBg: 'bg-orange-50 text-orange-500',
    soft: 'bg-orange-50/72',
  },
  memorial: {
    accent: 'text-purple-500',
    accentBg: 'bg-purple-500',
    border: 'border-purple-100',
    button:
      'bg-gradient-to-r from-purple-600 to-purple-500 shadow-[0_18px_34px_rgba(126,34,206,0.24)] hover:from-purple-500 hover:to-purple-400',
    chipActive: 'bg-purple-500 text-white shadow-[0_12px_24px_rgba(126,34,206,0.18)]',
    chipInactive: 'bg-white/72 text-purple-600 hover:bg-purple-50',
    glow: 'shadow-[0_18px_44px_rgba(126,34,206,0.11)]',
    hover: 'hover:bg-purple-50 hover:text-purple-700',
    iconBg: 'bg-purple-50 text-purple-500',
    soft: 'bg-purple-50/74',
  },
}

const categoriesByStatus: Record<PetStatus, string[]> = {
  active: ['全部', '疫苗', '驱虫', '体检', '绝育', '护理', '其他'],
  memorial: ['全部', '健康', '就诊', '护理', '体检', '疫苗/绝育', '其他'],
}

const growthRecordsSeedKey = 'petMemory:growthRecordsSeedVersion'
const growthRecordsSeedVersion = '2026-06-growth-records-species-demo-v1'
const previousPendingSeedVersion = '2026-06-growth-records-pending-demo-v2'

const vaccineOptionsByPetType: Record<PetType, string[]> = {
  cat: [
    '猫三联疫苗',
    '猫四联疫苗',
    '狂犬疫苗',
    '猫瘟疫苗',
    '猫鼻支疫苗',
    '猫杯状病毒疫苗',
    '加强针',
    '其他',
  ],
  dog: [
    '犬二联疫苗',
    '犬四联疫苗',
    '犬五联疫苗',
    '犬六联疫苗',
    '犬八联疫苗',
    '狂犬疫苗',
    '犬瘟热疫苗',
    '犬细小病毒疫苗',
    '犬冠状病毒疫苗',
    '加强针',
    '其他',
  ],
}

const dewormingOptionsByPetType: Record<PetType, string[]> = {
  cat: [
    '大宠爱',
    '爱沃克',
    '海乐妙',
    '博来恩',
    '福来恩',
    '拜耳内虫逃',
    '内驱药',
    '外驱药',
    '体内外同驱',
    '其他',
  ],
  dog: [
    '大宠爱犬用',
    '爱沃克犬用',
    '拜宠清',
    '福来恩犬用',
    '超可信',
    '尼可信',
    '犬心保',
    '海乐宠',
    '内驱药',
    '外驱药',
    '体内外同驱',
    '其他',
  ],
}

const vaccineManufacturerOptions = [
  '英特威 / Nobivac',
  '硕腾 / Zoetis',
  '梅里亚 / Boehringer Ingelheim',
  '维克 / Virbac',
  '辉瑞 / Pfizer',
  '国产品牌',
  '其他',
]

const getGrowthMenuPosition = (element: HTMLElement) => {
  const rect = element.getBoundingClientRect()
  const width = 164
  const height = 136
  const gap = 8
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight
  const left = Math.min(
    Math.max(12, rect.right - width),
    viewportWidth - width - 12,
  )
  const hasRoomBelow = rect.bottom + gap + height <= viewportHeight - 12
  const top = hasRoomBelow
    ? rect.bottom + gap
    : Math.max(12, rect.top - height - gap)

  return { left, top }
}

const getProjectPickerPosition = (
  element: HTMLElement,
  kind: ProjectPickerState['kind'],
) => {
  const rect = element.getBoundingClientRect()
  const width = 330
  const height = kind === 'vaccine' ? 420 : 330
  const gap = 8
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight
  const left = Math.min(
    Math.max(12, rect.left),
    viewportWidth - width - 12,
  )
  const hasRoomBelow = rect.bottom + gap + height <= viewportHeight - 12
  const top = hasRoomBelow
    ? rect.bottom + gap
    : Math.max(12, rect.top - height - gap)

  return { left, top }
}

const getDatePickerPosition = (element: HTMLElement) => {
  const rect = element.getBoundingClientRect()
  const width = 320
  const height = 352
  const gap = 8
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight
  const left = Math.min(
    Math.max(12, rect.left),
    viewportWidth - width - 12,
  )
  const hasRoomBelow = rect.bottom + gap + height <= viewportHeight - 12
  const top = hasRoomBelow
    ? rect.bottom + gap
    : Math.max(12, rect.top - height - gap)

  return { left, top }
}

const isVaccineCategory = (category: string) => category.includes('疫苗')

const isDewormingCategory = (category: string) => category === '驱虫'

const getProjectKind = (category: string): ProjectPickerState['kind'] | null => {
  if (isVaccineCategory(category)) {
    return 'vaccine'
  }

  if (isDewormingCategory(category)) {
    return 'deworming'
  }

  return null
}

const getPetType = (pet: Pet): PetType => {
  const rawType = String((
    pet as Pet & {
      petType?: string
      species?: string
    }
  ).type || (pet as Pet & { petType?: string }).petType || (pet as Pet & { species?: string }).species)

  return rawType === 'dog' || rawType === '狗狗' || rawType === '犬' ? 'dog' : 'cat'
}

const parseVaccineDescription = (description: string) => {
  const [vaccineName = '', manufacturer = ''] = description
    .split('｜')
    .map((part) => part.trim())

  return { manufacturer, vaccineName }
}

const buildVaccineDescription = (vaccineName: string, manufacturer: string) => {
  const normalizedVaccineName = vaccineName.trim()
  const normalizedManufacturer = manufacturer.trim()

  if (!normalizedVaccineName) {
    return normalizedManufacturer
  }

  return normalizedManufacturer
    ? `${normalizedVaccineName}｜${normalizedManufacturer}`
    : normalizedVaccineName
}

const getProjectFieldCopy = (category: string, isMemorial: boolean) => {
  if (isVaccineCategory(category)) {
    return {
      label: isMemorial ? '疫苗 / 绝育项目' : '疫苗种类 / 生产厂商',
      placeholder: '请输入其他疫苗名称或厂商',
    }
  }

  if (isDewormingCategory(category)) {
    return {
      label: '驱虫药 / 项目',
      placeholder: '请输入其他驱虫药或项目名称',
    }
  }

  if (category === '体检') {
    return {
      label: '体检项目',
      placeholder: '例如：基础体检、血常规、生化检查',
    }
  }

  if (category === '护理') {
    return {
      label: '护理项目',
      placeholder: '例如：洗澡、美容、剪指甲',
    }
  }

  if (category === '绝育') {
    return {
      label: '手术 / 项目',
      placeholder: '例如：绝育手术',
    }
  }

  return {
    label: isMemorial ? '项目说明 / 检查项目' : '项目说明',
    placeholder: isMemorial
      ? '基础体检（血常规、生化等）'
      : '请输入项目说明',
  }
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

const getGrowthRecordSeeds = (petType: PetType, petId: string): GrowthRecord[] => {
  return createDemoGrowthRecords(petType, petId)
}

const getGrowthSeedVersion = (petType: PetType) =>
  `${growthRecordsSeedVersion}:${petType}`

const readGrowthRecords = (petType: PetType, petId: string) => {
  const seedRecords = getGrowthRecordSeeds(petType, petId)
  const records = getStorageItem<GrowthRecord[] | null>(
    STORAGE_KEYS.growthRecords,
    null,
  )

  if (typeof window === 'undefined') {
    return records && records.length > 0 ? records : seedRecords
  }

  const currentSeedVersion = window.localStorage.getItem(growthRecordsSeedKey)
  const nextSeedVersion = getGrowthSeedVersion(petType)

  if (!records || records.length === 0) {
    setStorageItem(STORAGE_KEYS.growthRecords, seedRecords)
    window.localStorage.setItem(growthRecordsSeedKey, nextSeedVersion)
    return seedRecords
  }

  if (currentSeedVersion !== nextSeedVersion) {
    const existingIds = new Set(records.map((record) => record.id))
    const mockRecordsById = new Map(
      seedRecords.map((record) => [record.id, record]),
    )
    const nextRecords = [
      ...records.map((record) => {
        const mockRecord = mockRecordsById.get(record.id)

        if (!mockRecord) {
          return record
        }

        return {
          ...mockRecord,
          completed:
            currentSeedVersion === previousPendingSeedVersion &&
            record.completed === true
              ? true
              : mockRecord.completed,
        }
      }),
      ...seedRecords.filter((record) => !existingIds.has(record.id)),
    ]

    setStorageItem(STORAGE_KEYS.growthRecords, nextRecords)
    window.localStorage.setItem(growthRecordsSeedKey, nextSeedVersion)
    return nextRecords
  }

  return records
}

const formatDate = (date: string) => date || '未填写'

const sortRecordsByDate = (records: GrowthRecord[]) =>
  [...records].sort(
    (firstRecord, secondRecord) =>
      new Date(secondRecord.recordDate).getTime() -
      new Date(firstRecord.recordDate).getTime(),
  )

const getInitialDraft = (status: PetStatus): GrowthDraft => ({
  category: status === 'active' ? '疫苗' : '健康',
  description: '',
  location: '',
  nextReminder: '',
  note: '',
  recordDate: getToday(),
  title: '',
})

const IconShell = ({ children, className = '' }: IconProps & { children: React.ReactNode }) => (
  <svg
    aria-hidden="true"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
  >
    {children}
  </svg>
)

const ShieldIcon = ({ className = '' }: IconProps) => (
  <IconShell className={className}>
    <path
      d="M12 3.5 5.5 6.1v5.5c0 4.1 2.6 7.5 6.5 8.9 3.9-1.4 6.5-4.8 6.5-8.9V6.1L12 3.5Z"
      stroke="currentColor"
      strokeLinejoin="round"
      strokeWidth="2"
    />
    <path d="m9 12 2 2 4-4" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
  </IconShell>
)

const PlusIcon = ({ className = '' }: IconProps) => (
  <IconShell className={className}>
    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeLinecap="round" strokeWidth="2.4" />
  </IconShell>
)

const CalendarIcon = ({ className = '' }: IconProps) => (
  <IconShell className={className}>
    <rect height="16" rx="4" stroke="currentColor" strokeWidth="2" width="17" x="3.5" y="4.5" />
    <path d="M8 3v4M16 3v4M4 9h16" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
  </IconShell>
)

const MoreIcon = ({ className = '' }: IconProps) => (
  <IconShell className={className}>
    <path
      d="M7 12h.01M12 12h.01M17 12h.01"
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth="3.2"
    />
  </IconShell>
)

const GrowthCalendarPopover = ({
  onSelect,
  position,
  selectedDate,
  tone,
}: {
  onSelect: (date: string) => void
  position: DatePickerState
  selectedDate: string
  tone: GrowthTone
}) => {
  const selected = parseDateValue(selectedDate)
  const today = new Date()
  const [viewDate, setViewDate] = useState(
    () => new Date(selected.getFullYear(), selected.getMonth(), 1),
  )
  const [viewMode, setViewMode] = useState<'date' | 'year'>('date')
  const [yearPageStart, setYearPageStart] = useState(() =>
    getYearPageStart(selected.getFullYear()),
  )
  const calendarDays = getCalendarDays(viewDate)
  const visibleYears = Array.from(
    { length: 12 },
    (_, index) => yearPageStart + index,
  )
  const weekdays = ['一', '二', '三', '四', '五', '六', '日']

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
      className="fixed z-[110] flex h-[352px] w-[320px] max-w-[calc(100vw-32px)] origin-top flex-col overflow-hidden rounded-[24px] border border-white/80 bg-white/94 p-4 shadow-[0_18px_44px_rgba(87,66,40,0.18)] backdrop-blur"
      data-growth-date-picker
      onClick={(event) => event.stopPropagation()}
      style={{
        animation: 'growthMenuIn 220ms cubic-bezier(0.22, 1, 0.36, 1) both',
        left: position.left,
        top: position.top,
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
          animation: 'growthMenuIn 180ms cubic-bezier(0.22, 1, 0.36, 1) both',
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
                          ? `border ${tone.border} bg-white/60 ${tone.accent} ${tone.hover}`
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

const RecordTypeIcon = ({
  category,
  className = '',
}: IconProps & { category: string }) => {
  if (category.includes('疫苗')) {
    return (
      <IconShell className={className}>
        <path d="m14 4 6 6M4 20l6.5-6.5M9 7l8 8" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
        <path d="m7 9 8 8-3 3-8-8 3-3Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" />
        <path d="m15 4 5 5-2.5 2.5-5-5L15 4Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" />
      </IconShell>
    )
  }

  if (category === '驱虫') {
    return (
      <IconShell className={className}>
        <path d="M12 6c3 0 5 2.7 5 6s-2 6-5 6-5-2.7-5-6 2-6 5-6Z" stroke="currentColor" strokeWidth="2" />
        <path d="M12 6V3M12 21v-3M7 10H4M20 10h-3M7 14H4M20 14h-3M9 8l-2-2M15 8l2-2" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
      </IconShell>
    )
  }

  if (category === '体检' || category === '健康') {
    return (
      <IconShell className={className}>
        <path d="M6 4v6a4 4 0 0 0 8 0V4" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
        <path d="M14 10v3a4 4 0 0 0 8 0v-1" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
        <circle cx="20" cy="11" r="2" stroke="currentColor" strokeWidth="2" />
      </IconShell>
    )
  }

  if (category === '绝育') {
    return (
      <IconShell className={className}>
        <path d="m5 5 14 14M19 5 5 19" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
        <circle cx="7" cy="7" r="2" stroke="currentColor" strokeWidth="2" />
        <circle cx="17" cy="17" r="2" stroke="currentColor" strokeWidth="2" />
      </IconShell>
    )
  }

  if (category === '护理') {
    return (
      <IconShell className={className}>
        <path d="M12 20s7-4.1 7-10a4 4 0 0 0-7-2.6A4 4 0 0 0 5 10c0 5.9 7 10 7 10Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" />
        <path d="M8.5 12h7M12 8.5v7" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
      </IconShell>
    )
  }

  if (category === '就诊') {
    return (
      <IconShell className={className}>
        <path d="M7 4h10a2 2 0 0 1 2 2v14H5V6a2 2 0 0 1 2-2Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" />
        <path d="M9 10h6M12 7v6M8 20v-3h8v3" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
      </IconShell>
    )
  }

  return (
    <IconShell className={className}>
      <path d="M6 8h12M6 12h12M6 16h8" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
    </IconShell>
  )
}

const GrowthRecords = () => {
  const { pet, status } = useMainPetLayout()
  const isMemorial = status === 'memorial'
  const petType = getPetType(pet)
  const tone = growthTones[status]
  const categories = categoriesByStatus[status]
  const [records, setRecords] = useState<GrowthRecord[]>(() =>
    readGrowthRecords(petType, pet.id),
  )
  const [selectedCategory, setSelectedCategory] = useState('全部')
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isClosingDrawer, setIsClosingDrawer] = useState(false)
  const [drawerMode, setDrawerMode] = useState<DrawerMode>('add')
  const [editingRecordId, setEditingRecordId] = useState<string | null>(null)
  const [draft, setDraft] = useState<GrowthDraft>(() => getInitialDraft(status))
  const [errors, setErrors] = useState<GrowthErrors>({})
  const [openMenu, setOpenMenu] = useState<GrowthMenuState | null>(null)
  const [projectPicker, setProjectPicker] = useState<ProjectPickerState | null>(
    null,
  )
  const [datePicker, setDatePicker] = useState<DatePickerState | null>(null)
  const [deleteConfirmRecordId, setDeleteConfirmRecordId] = useState<string | null>(null)
  const projectInputRef = useRef<HTMLInputElement | null>(null)
  const suppressProjectPickerFocusRef = useRef(false)

  const currentRecords = useMemo(
    () => sortRecordsByDate(records.filter((record) => record.status === status)),
    [records, status],
  )
  const openMenuRecordId = openMenu?.recordId ?? null
  const openMenuRecord = useMemo(
    () =>
      openMenuRecordId
        ? records.find((record) => record.id === openMenuRecordId) ?? null
        : null,
    [openMenuRecordId, records],
  )
  const visibleRecords = useMemo(
    () =>
      selectedCategory === '全部'
        ? currentRecords
        : currentRecords.filter((record) => record.category === selectedCategory),
    [currentRecords, selectedCategory],
  )
  const recentRecord = currentRecords[0]?.title || '暂无记录'
  void currentRecords.filter(
    (record) =>
      !record.completed &&
      record.nextReminder &&
      record.nextReminder !== '无需提醒' &&
      new Date(record.nextReminder).getTime() >= new Date(getToday()).getTime(),
  ).length

  useEffect(() => {
    setRecords(readGrowthRecords(petType, pet.id))
    setOpenMenu(null)
    setProjectPicker(null)
    setDatePicker(null)
    setDeleteConfirmRecordId(null)
  }, [pet.id, petType])

  useEffect(() => {
    setSelectedCategory('全部')
    setOpenMenu(null)
    setProjectPicker(null)
    setDatePicker(null)
    setDeleteConfirmRecordId(null)
    closeDrawer()
    setDraft(getInitialDraft(status))
    setErrors({})
  }, [status])

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Element | null

      if (
        target?.closest('[data-growth-menu]') ||
        target?.closest('[data-growth-project-picker]') ||
        target?.closest('[data-growth-project-trigger]') ||
        target?.closest('[data-growth-date-picker]') ||
        target?.closest('[data-growth-date-trigger]') ||
        target?.closest('[data-growth-menu-trigger]')
      ) {
        return
      }

      setOpenMenu(null)
      setProjectPicker(null)
      setDatePicker(null)
      setDeleteConfirmRecordId(null)
    }

    document.addEventListener('mousedown', handlePointerDown)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
    }
  }, [])

  const persistRecords = (nextRecords: GrowthRecord[]) => {
    setRecords(nextRecords)
    setStorageItem(STORAGE_KEYS.growthRecords, nextRecords)
  }

  const openAddDrawer = () => {
    setDrawerMode('add')
    setEditingRecordId(null)
    setDraft(getInitialDraft(status))
    setErrors({})
    setOpenMenu(null)
    setProjectPicker(null)
    setDatePicker(null)
    setDeleteConfirmRecordId(null)
    setIsClosingDrawer(false)
    setIsDrawerOpen(true)
  }

  function closeDrawer() {
    if (!isDrawerOpen) {
      setIsClosingDrawer(false)
      return
    }

    setIsClosingDrawer(true)
    setProjectPicker(null)
    setDatePicker(null)
    window.setTimeout(() => {
      setIsDrawerOpen(false)
      setIsClosingDrawer(false)
      setDrawerMode('add')
      setEditingRecordId(null)
      setDraft(getInitialDraft(status))
      setErrors({})
    }, 260)
  }

  const openEditDrawer = (record: GrowthRecord) => {
    setDrawerMode('edit')
    setEditingRecordId(record.id)
    setDraft({
      category: record.category,
      description: record.description,
      location: record.location || '',
      nextReminder: record.nextReminder || '',
      note: record.note || '',
      recordDate: record.recordDate,
      title: record.title,
    })
    setErrors({})
    setOpenMenu(null)
    setProjectPicker(null)
    setDatePicker(null)
    setDeleteConfirmRecordId(null)
    setIsClosingDrawer(false)
    setIsDrawerOpen(true)
  }

  const clearError = (field: keyof GrowthErrors) => {
    setErrors((currentErrors) => {
      const nextErrors = { ...currentErrors }
      delete nextErrors[field]
      return nextErrors
    })
  }

  const updateDraft = <Key extends keyof GrowthDraft>(
    key: Key,
    value: GrowthDraft[Key],
  ) => {
    if (key === 'category' || key === 'recordDate' || key === 'title') {
      clearError(key)
    }

    setDraft((currentDraft) => ({
      ...currentDraft,
      [key]: value,
    }))
  }

  const selectCategory = (category: string) => {
    const currentProjectKind = getProjectKind(draft.category)
    const nextProjectKind = getProjectKind(category)

    clearError('category')
    setDraft((currentDraft) => ({
      ...currentDraft,
      category,
      description:
        currentProjectKind === nextProjectKind ? currentDraft.description : '',
    }))
    setProjectPicker(null)
  }

  const openProjectPicker = (
    kind: ProjectPickerState['kind'],
    element: HTMLElement,
  ) => {
    const position = getProjectPickerPosition(element, kind)

    setDatePicker(null)
    setOpenMenu(null)
    setProjectPicker((currentPicker) =>
      currentPicker?.kind === kind
        ? null
        : {
            kind,
            ...position,
          },
    )
  }

  const handleDateFieldClick = (
    field: GrowthDateField,
    element: HTMLElement,
  ) => {
    setProjectPicker(null)
    setOpenMenu(null)
    setDatePicker((currentPicker) => {
      if (!currentPicker) {
        return {
          field,
          ...getDatePickerPosition(element),
        }
      }

      return null
    })
  }

  const focusProjectInputForCustomValue = () => {
    suppressProjectPickerFocusRef.current = true
    window.setTimeout(() => {
      projectInputRef.current?.focus()
      window.setTimeout(() => {
        suppressProjectPickerFocusRef.current = false
      }, 0)
    }, 0)
  }

  const selectVaccineName = (vaccineName: string) => {
    const currentSelection = parseVaccineDescription(draft.description)
    const isOther = vaccineName === '其他'

    updateDraft(
      'description',
      buildVaccineDescription(
        isOther ? '' : vaccineName,
        isOther ? '' : currentSelection.manufacturer,
      ),
    )

    if (isOther) {
      setProjectPicker(null)
      focusProjectInputForCustomValue()
    }
  }

  const selectVaccineManufacturer = (manufacturer: string) => {
    const currentSelection = parseVaccineDescription(draft.description)
    const isOther = manufacturer === '其他'

    updateDraft(
      'description',
      buildVaccineDescription(
        currentSelection.vaccineName,
        isOther ? '' : manufacturer,
      ),
    )

    if (isOther) {
      setProjectPicker(null)
      focusProjectInputForCustomValue()
    }
  }

  const selectDewormingProject = (projectName: string) => {
    const isOther = projectName === '其他'

    updateDraft('description', isOther ? '' : projectName)

    if (isOther) {
      setProjectPicker(null)
      focusProjectInputForCustomValue()
    }
  }

  const validateDraft = () => {
    const nextErrors: GrowthErrors = {}

    if (!draft.category) {
      nextErrors.category = '请选择记录类型'
    }

    if (!draft.title.trim()) {
      nextErrors.title = '请输入记录名称'
    }

    if (!draft.recordDate) {
      nextErrors.recordDate = '请选择记录日期'
    }

    setErrors(nextErrors)

    return Object.keys(nextErrors).length === 0
  }

  const saveRecord = () => {
    setDatePicker(null)

    if (!validateDraft()) {
      return
    }

    const nextRecord: GrowthRecord = {
      id: editingRecordId || `growth-${Date.now()}`,
      petId: pet.id,
      category: draft.category,
      title: draft.title.trim(),
      description: draft.description.trim() || draft.title.trim(),
      recordDate: draft.recordDate,
      nextReminder: isMemorial ? undefined : draft.nextReminder || undefined,
      location: draft.location.trim() || undefined,
      note: draft.note.trim() || undefined,
      completed: true,
      status,
    }

    const nextRecords =
      drawerMode === 'edit' && editingRecordId
        ? records.map((record) =>
            record.id === editingRecordId ? nextRecord : record,
          )
        : [nextRecord, ...records]

    persistRecords(nextRecords)
    setSelectedCategory('全部')
    closeDrawer()
  }

  const deleteRecord = (recordId: string) => {
    persistRecords(records.filter((record) => record.id !== recordId))
    setOpenMenu(null)
    setDeleteConfirmRecordId(null)

    if (editingRecordId === recordId) {
      closeDrawer()
    }
  }

  const inputBaseClass = `mt-2 h-11 w-full rounded-2xl border bg-white/82 px-4 text-sm font-bold text-stone-700 outline-none transition duration-200 ease-out placeholder:text-stone-300 ${tone.border} focus:border-current focus:bg-white focus:ring-4 ${
    isMemorial ? 'focus:ring-purple-100' : 'focus:ring-orange-100'
  }`
  const projectKind = getProjectKind(draft.category)
  const projectFieldCopy = getProjectFieldCopy(draft.category, isMemorial)
  const vaccineOptions = vaccineOptionsByPetType[petType]
  const dewormingOptions = dewormingOptionsByPetType[petType]
  const selectedVaccine = parseVaccineDescription(draft.description)

  return (
    <section className="relative h-full overflow-hidden px-8 py-7 text-stone-800">
      <style>
        {`
          @keyframes growthDrawerOverlayIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          @keyframes growthDrawerIn {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
          }

          @keyframes growthDrawerOut {
            from { transform: translateX(0); }
            to { transform: translateX(100%); }
          }

          @keyframes growthDrawerOverlayOut {
            from { opacity: 1; }
            to { opacity: 0; }
          }

          @keyframes growthMenuIn {
            from { opacity: 0; transform: translateY(-4px) scale(0.98); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }

          .growth-record-scroll::-webkit-scrollbar {
            width: 6px;
          }

          .growth-record-scroll {
            scrollbar-color: rgba(156, 122, 88, 0.18) transparent;
            scrollbar-width: thin;
          }

          .growth-record-scroll::-webkit-scrollbar-track {
            background: transparent;
          }

          .growth-record-scroll::-webkit-scrollbar-thumb {
            background: rgba(156, 122, 88, 0.20);
            border-radius: 999px;
          }

          .growth-record-scroll:hover::-webkit-scrollbar-thumb {
            background: rgba(156, 122, 88, 0.34);
          }
        `}
      </style>

      <div className="grid h-full min-h-0 grid-cols-[260px_minmax(0,1fr)] gap-5">
        <aside className={`h-fit rounded-[30px] border border-white/76 bg-white/80 p-5 ${tone.glow} backdrop-blur`}>
          <div className="flex items-center gap-3">
            <span className={`flex h-11 w-11 items-center justify-center rounded-2xl ${tone.iconBg} shadow-inner`}>
              <ShieldIcon className="h-6 w-6" />
            </span>
            <div>
              <p className={`text-xs font-black ${tone.accent}`}>
                {isMemorial ? 'Memory Health' : 'Health Overview'}
              </p>
              <h2 className="text-xl font-black text-stone-900">健康概览</h2>
            </div>
          </div>

          <div className="mt-5 divide-y divide-stone-100">
            {[
              { label: '总记录', value: `${currentRecords.length} 条`, icon: '01' },
              { label: '最近记录', value: recentRecord, icon: '02' },
            ].map((item) => (
              <div className="flex items-center gap-3 py-3" key={item.label}>
                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[15px] font-black ${tone.soft} ${tone.accent}`}>
                  {item.icon}
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-stone-400">{item.label}</p>
                  <p className="mt-1 truncate text-sm font-black text-stone-800">
                    {item.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </aside>

        <main className="flex min-h-0 min-w-0 flex-col">
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const isSelected = category === selectedCategory

                return (
                  <button
                    className={`h-9 rounded-full px-4 text-sm font-black transition duration-200 ease-out hover:-translate-y-0.5 active:scale-[0.97] ${
                      isSelected ? tone.chipActive : tone.chipInactive
                    }`}
                    key={category}
                    onClick={() => {
                      setSelectedCategory(category)
                      setOpenMenu(null)
                      setDeleteConfirmRecordId(null)
                    }}
                    type="button"
                  >
                    {category}
                  </button>
                )
              })}
            </div>

            <button
              className={`flex h-11 shrink-0 items-center gap-2 rounded-full px-5 text-sm font-black text-white transition duration-200 ease-out hover:-translate-y-0.5 active:scale-[0.97] ${tone.button}`}
              onClick={openAddDrawer}
              type="button"
            >
              <PlusIcon className="h-4 w-4" />
              {isMemorial ? '补充生前记录' : '添加记录'}
            </button>
          </div>

          <div className="growth-record-scroll mt-4 min-h-0 flex-1 space-y-3 overflow-y-auto pb-6 pr-2">
            {visibleRecords.length > 0 ? (
              visibleRecords.map((record) => (
                <article
                  className={`group relative flex items-center gap-4 rounded-[28px] border border-white/78 bg-white/84 p-4 ${tone.glow} backdrop-blur transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-white/94`}
                  key={record.id}
                >
                  <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-[22px] ${tone.iconBg} shadow-inner`}>
                    <RecordTypeIcon category={record.category} className="h-7 w-7" />
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="truncate text-base font-black text-stone-900">
                        {record.title}
                      </h3>
                      <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-black ${tone.soft} ${tone.accent}`}>
                        {record.category}
                      </span>
                    </div>
                    <p className="mt-1 line-clamp-1 text-sm font-semibold text-stone-500">
                      {record.description}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs font-bold text-stone-400">
                      <span>记录日期：{formatDate(record.recordDate)}</span>
                      {record.location ? <span>地点：{record.location}</span> : null}
                    </div>
                  </div>

                  <div className="flex w-[150px] shrink-0 flex-col items-end gap-2 text-right">
                    {isMemorial ? (
                      <>
                        <span className={`rounded-full px-3 py-1 text-xs font-black ${tone.soft} ${tone.accent}`}>
                          {formatDate(record.recordDate)}
                        </span>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-black ${
                            record.completed
                              ? 'bg-emerald-50 text-emerald-600'
                              : `${tone.soft} ${tone.accent}`
                          }`}
                        >
                          {record.completed ? '已完成' : '未完成'}
                        </span>
                      </>
                    ) : (
                      <>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-black ${
                            record.completed
                              ? 'bg-emerald-50 text-emerald-600'
                              : `${tone.soft} ${tone.accent}`
                          }`}
                        >
                          {record.completed ? '已完成' : '未完成'}
                        </span>
                        <span className="text-xs font-bold text-stone-400">
                          下次提醒：{record.nextReminder || '无需提醒'}
                        </span>
                      </>
                    )}
                  </div>

                  <button
                    aria-label="更多操作"
                    className={`flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-white/80 text-stone-400 shadow-sm transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md active:scale-95 ${tone.hover}`}
                    data-growth-menu-trigger
                    onClick={(event) => {
                      event.stopPropagation()
                      setDeleteConfirmRecordId(null)
                      const position = getGrowthMenuPosition(event.currentTarget)

                      setOpenMenu((currentMenu) =>
                        currentMenu?.recordId === record.id
                          ? null
                          : { recordId: record.id, ...position },
                      )
                    }}
                    type="button"
                  >
                    <MoreIcon className="h-5 w-5" />
                  </button>
                </article>
              ))
            ) : (
              <div className={`flex h-full min-h-[220px] items-center justify-center rounded-[30px] border border-dashed ${tone.border} bg-white/62 px-6 text-center`}>
                <p className="text-sm font-black text-stone-500">
                  当前分类还没有记录。
                </p>
              </div>
            )}
          </div>
        </main>
      </div>

      {openMenu && openMenuRecord
        ? createPortal(
            <div
              className="fixed z-[95] w-[164px] rounded-[18px] border border-white/80 bg-white/96 p-3 shadow-[0_18px_42px_rgba(47,28,8,0.18)] backdrop-blur"
              data-growth-menu
              onClick={(event) => event.stopPropagation()}
              style={{
                animation: 'growthMenuIn 160ms ease-out both',
                left: openMenu.left,
                top: openMenu.top,
              }}
            >
              {deleteConfirmRecordId === openMenuRecord.id ? (
                <>
                  <p className="text-sm font-black text-stone-700">
                    确认删除？
                  </p>
                  <div className="mt-3 flex gap-2">
                    <button
                      className="h-8 flex-1 rounded-full bg-stone-100 text-xs font-black text-stone-500 transition hover:bg-stone-200 active:scale-[0.97]"
                      onClick={() => setDeleteConfirmRecordId(null)}
                      type="button"
                    >
                      取消
                    </button>
                    <button
                      className={`h-8 flex-1 rounded-full text-xs font-black text-white transition hover:-translate-y-0.5 active:scale-[0.97] ${tone.button}`}
                      onClick={() => deleteRecord(openMenuRecord.id)}
                      type="button"
                    >
                      删除
                    </button>
                  </div>
                </>
              ) : (
                <div className="space-y-2">
                  <button
                    className={`flex h-9 w-full items-center justify-center rounded-full text-sm font-black transition hover:-translate-y-0.5 active:scale-[0.97] ${tone.hover} ${tone.accent}`}
                    onClick={() => openEditDrawer(openMenuRecord)}
                    type="button"
                  >
                    编辑
                  </button>
                  <button
                    className="flex h-9 w-full items-center justify-center rounded-full bg-rose-50 text-sm font-black text-rose-500 transition hover:-translate-y-0.5 hover:bg-rose-100 active:scale-[0.97]"
                    onClick={() => setDeleteConfirmRecordId(openMenuRecord.id)}
                    type="button"
                  >
                    删除
                  </button>
                </div>
              )}
            </div>,
            document.body,
          )
        : null}

      {projectPicker
        ? createPortal(
            <div
              className="fixed z-[110] w-[330px] rounded-[24px] border border-white/80 bg-white/96 p-4 shadow-[0_22px_54px_rgba(47,28,8,0.20)] backdrop-blur"
              data-growth-project-picker
              onClick={(event) => event.stopPropagation()}
              style={{
                animation: 'growthMenuIn 180ms ease-out both',
                left: projectPicker.left,
                top: projectPicker.top,
              }}
            >
              {projectPicker.kind === 'vaccine' ? (
                <>
                  <div>
                    <p className={`text-xs font-black ${tone.accent}`}>
                      疫苗类型
                    </p>
                    <div className="mt-2 grid max-h-[144px] grid-cols-2 gap-2 overflow-y-auto pr-1">
                      {vaccineOptions.map((option) => {
                        const isSelected =
                          selectedVaccine.vaccineName === option

                        return (
                          <button
                            className={`min-h-8 rounded-full px-3 py-1.5 text-xs font-black transition duration-200 ease-out hover:-translate-y-0.5 active:scale-[0.97] ${
                              isSelected ? tone.chipActive : tone.chipInactive
                            }`}
                            key={option}
                            onClick={() => selectVaccineName(option)}
                            type="button"
                          >
                            {option}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <div className="mt-4 border-t border-stone-100 pt-3">
                    <p className={`text-xs font-black ${tone.accent}`}>
                      生产厂商
                    </p>
                    <div className="mt-2 grid max-h-[126px] grid-cols-1 gap-2 overflow-y-auto pr-1">
                      {vaccineManufacturerOptions.map((option) => {
                        const isSelected =
                          selectedVaccine.manufacturer === option

                        return (
                          <button
                            className={`min-h-8 rounded-full px-3 py-1.5 text-left text-xs font-black transition duration-200 ease-out hover:-translate-y-0.5 active:scale-[0.97] ${
                              isSelected ? tone.chipActive : tone.chipInactive
                            }`}
                            key={option}
                            onClick={() => selectVaccineManufacturer(option)}
                            type="button"
                          >
                            {option}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </>
              ) : (
                <div>
                  <p className={`text-xs font-black ${tone.accent}`}>
                    驱虫药 / 项目
                  </p>
                  <div className="mt-2 grid max-h-[228px] grid-cols-2 gap-2 overflow-y-auto pr-1">
                    {dewormingOptions.map((option) => {
                      const isSelected = draft.description === option

                      return (
                        <button
                          className={`min-h-8 rounded-full px-3 py-1.5 text-xs font-black transition duration-200 ease-out hover:-translate-y-0.5 active:scale-[0.97] ${
                            isSelected ? tone.chipActive : tone.chipInactive
                          }`}
                          key={option}
                          onClick={() => selectDewormingProject(option)}
                          type="button"
                        >
                          {option}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              <div className="mt-4 flex items-center justify-between gap-3 border-t border-stone-100 pt-3">
                <p className="text-xs font-bold leading-5 text-stone-400">
                  也可以直接在主框中输入自定义内容
                </p>
                <button
                  className={`h-8 shrink-0 rounded-full px-4 text-xs font-black text-white transition hover:-translate-y-0.5 active:scale-[0.97] ${tone.button}`}
                  onClick={() => setProjectPicker(null)}
                  type="button"
                >
                  完成
                </button>
              </div>
            </div>,
            document.body,
          )
        : null}

      {datePicker ? (
        <GrowthCalendarPopover
          onSelect={(date) => {
            updateDraft(datePicker.field, date)
            setDatePicker(null)
          }}
          position={datePicker}
          selectedDate={draft[datePicker.field] || getToday()}
          tone={tone}
        />
      ) : null}

      {isDrawerOpen
        ? createPortal(
            <div className="fixed inset-0 z-[80]" onClick={closeDrawer}>
              <div
                className="absolute inset-0 bg-black/42"
                style={{
                  animation: `${
                    isClosingDrawer
                      ? 'growthDrawerOverlayOut'
                      : 'growthDrawerOverlayIn'
                  } 260ms ease-out both`,
                }}
              />
              <aside
                className="fixed right-0 top-0 z-[90] flex h-screen w-[31vw] min-w-[370px] max-w-[480px] flex-col overflow-hidden border-l border-white/70 bg-white/94 shadow-[0_0_80px_rgba(47,28,8,0.28)] backdrop-blur"
                onClick={(event) => event.stopPropagation()}
                style={{
                  animation: `${
                    isClosingDrawer ? 'growthDrawerOut' : 'growthDrawerIn'
                  } 300ms cubic-bezier(0.22, 1, 0.36, 1) both`,
                }}
              >
                <div className="flex items-start justify-between border-b border-stone-100 px-6 py-5">
                  <div>
                    <p className={`text-xs font-black ${tone.accent}`}>
                      {isMemorial ? 'Memory Record' : 'Growth Record'}
                    </p>
                    <h3 className="mt-1 text-2xl font-black text-stone-900">
                      {drawerMode === 'edit'
                        ? '编辑成长记录'
                        : isMemorial
                          ? '补充一条记录'
                          : '添加成长记录'}
                    </h3>
                    <p className="mt-2 text-xs font-semibold leading-5 text-stone-500">
                      {isMemorial
                        ? `记录${pet.name || 'TA'}曾经的一次健康或护理事项`
                        : `记录${pet.name || 'TA'}的一次健康或护理事项`}
                    </p>
                  </div>
                  <button
                    aria-label="关闭成长记录抽屉"
                    className={`flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-white/80 text-lg font-black text-stone-500 shadow-sm transition duration-200 ease-out hover:-translate-y-0.5 hover:scale-105 hover:shadow-md active:scale-95 ${tone.hover}`}
                    onClick={closeDrawer}
                    type="button"
                  >
                    ×
                  </button>
                </div>

                <div
                  className="min-h-0 flex-1 space-y-4 overflow-y-auto px-6 py-5"
                  onScroll={() => {
                    setProjectPicker(null)
                    setDatePicker(null)
                  }}
                >
                  <div>
                    <p className="text-xs font-black text-stone-500">
                      记录类型 *
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {categories.filter((category) => category !== '全部').map((category) => {
                        const isSelected = draft.category === category

                        return (
                          <button
                            className={`h-9 rounded-full px-4 text-sm font-black transition duration-200 ease-out hover:-translate-y-0.5 active:scale-[0.97] ${
                              isSelected ? tone.chipActive : tone.chipInactive
                            }`}
                            key={category}
                            onClick={() => selectCategory(category)}
                            type="button"
                          >
                            {isSelected ? '✓ ' : ''}
                            {category}
                          </button>
                        )
                      })}
                    </div>
                    <span className="mt-1 block min-h-[16px] text-xs font-black text-rose-400">
                      {errors.category || ''}
                    </span>
                  </div>

                  <label className="block text-xs font-black text-stone-500">
                    记录名称 *
                    <input
                      className={`${inputBaseClass} ${
                        errors.title ? 'border-rose-300' : ''
                      }`}
                      onChange={(event) => updateDraft('title', event.target.value)}
                      placeholder={
                        isMemorial
                          ? '例如：年度体检'
                          : petType === 'dog'
                            ? '例如：犬六联疫苗（第二针）'
                            : '例如：猫三联疫苗（第二针）'
                      }
                      value={draft.title}
                    />
                    <span className="mt-1 block min-h-[16px] text-xs font-black text-rose-400">
                      {errors.title || ''}
                    </span>
                  </label>

                  <div className="block text-xs font-black text-stone-500">
                    <p>{projectFieldCopy.label}</p>
                    <span className="relative mt-2 block">
                      <input
                        className={`${inputBaseClass} mt-0 ${
                          projectKind ? 'pr-11' : ''
                        }`}
                        onChange={(event) =>
                          updateDraft('description', event.target.value)
                        }
                        onFocus={(event) => {
                          if (projectKind) {
                            if (suppressProjectPickerFocusRef.current) {
                              return
                            }

                            openProjectPicker(
                              projectKind,
                              projectInputRef.current || event.currentTarget,
                            )
                          }
                        }}
                        placeholder={
                          draft.description
                            ? projectFieldCopy.placeholder
                            : projectKind === 'vaccine'
                              ? '选择疫苗类型和生产厂商'
                              : projectKind === 'deworming'
                                ? '选择驱虫药或项目'
                                : projectFieldCopy.placeholder
                        }
                        ref={projectInputRef}
                        value={draft.description}
                      />
                      {projectKind ? (
                        <button
                          aria-label="打开项目选择面板"
                          className={`absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-base font-black transition duration-200 ease-out ${tone.accent} ${tone.hover} active:scale-[0.97]`}
                          data-growth-project-trigger
                          onClick={(event) => {
                            event.preventDefault()
                            event.stopPropagation()
                            openProjectPicker(projectKind, event.currentTarget)
                          }}
                          type="button"
                        >
                          ▾
                        </button>
                      ) : null}
                    </span>
                  </div>

                  <label className="block text-xs font-black text-stone-500">
                    记录日期 *
                    <span className="mt-2 block">
                      <button
                        className={`${inputBaseClass} mt-0 flex items-center justify-between pr-4 text-left ${
                          errors.recordDate ? 'border-rose-300' : ''
                        }`}
                        data-growth-date-trigger
                        onClick={(event) => {
                          event.stopPropagation()
                          handleDateFieldClick(
                            'recordDate',
                            event.currentTarget,
                          )
                        }}
                        type="button"
                      >
                        <span
                          className={
                            draft.recordDate ? 'text-stone-700' : 'text-stone-300'
                          }
                        >
                          {formatDateForDisplay(draft.recordDate)}
                        </span>
                        <CalendarIcon className={`h-4 w-4 ${tone.accent}`} />
                      </button>
                    </span>
                    <span className="mt-1 block min-h-[16px] text-xs font-black text-rose-400">
                      {errors.recordDate || ''}
                    </span>
                  </label>

                  {!isMemorial ? (
                    <label className="block text-xs font-black text-stone-500">
                      下次提醒
                      <button
                        className={`${inputBaseClass} flex items-center justify-between pr-4 text-left`}
                        data-growth-date-trigger
                        onClick={(event) => {
                          event.stopPropagation()
                          handleDateFieldClick(
                            'nextReminder',
                            event.currentTarget,
                          )
                        }}
                        type="button"
                      >
                        <span
                          className={
                            draft.nextReminder
                              ? 'text-stone-700'
                              : 'text-stone-300'
                          }
                        >
                          {draft.nextReminder
                            ? formatDateForDisplay(draft.nextReminder)
                            : '无需提醒'}
                        </span>
                        <CalendarIcon className={`h-4 w-4 ${tone.accent}`} />
                      </button>
                    </label>
                  ) : null}

                  <label className="block text-xs font-black text-stone-500">
                    地点（可选）
                    <input
                      className={inputBaseClass}
                      onChange={(event) => updateDraft('location', event.target.value)}
                      placeholder="例如：喵星宠物医院（和平路分院）"
                      value={draft.location}
                    />
                  </label>

                  <label className="block text-xs font-black text-stone-500">
                    备注（可选）
                    <textarea
                      className={`mt-2 h-24 w-full resize-none rounded-2xl border bg-white/82 px-4 py-3 text-sm font-bold leading-6 text-stone-700 outline-none transition duration-200 ease-out placeholder:text-stone-300 ${tone.border} focus:bg-white focus:ring-4 ${
                        isMemorial ? 'focus:ring-purple-100' : 'focus:ring-orange-100'
                      }`}
                      onChange={(event) => updateDraft('note', event.target.value)}
                      placeholder="请输入备注信息"
                      value={draft.note}
                    />
                  </label>
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
                    onClick={saveRecord}
                    type="button"
                  >
                    保存记录
                  </button>
                </div>
              </aside>
            </div>,
            document.body,
          )
        : null}
    </section>
  )
}

export default GrowthRecords
