import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { ChangeEvent, ReactNode, RefObject } from 'react'
import type {
  AiReferenceImageMeta,
  Pet,
  PetNeuteredStatus,
  PetSex,
  PetStatus,
  PetType,
} from '../types'
import AIModelGenerationModal from '../components/AIModelGenerationModal'
import PetModelViewer from '../components/PetModelViewer'
import { navigateTo } from '../utils/navigation'
import type { AiReferenceImageView } from '../utils/aiReferenceImages'
import {
  deleteAiReferenceImagesByMeta,
  getAiReferenceUploadErrorMessage,
  saveAiReferenceFile,
} from '../utils/aiReferenceImages'
import { assignRandomPetModel } from '../utils/petModels'
import { setPetStatus, setStorageItem, STORAGE_KEYS } from '../utils/storage'

type OptionCardProps = {
  arrowOpen?: boolean
  children?: ReactNode
  className?: string
  icon: string
  iconImageClassName?: string
  onClick?: () => void
  showArrow?: boolean
  subtitle: string
  tone: OptionCardTone
  title: string
}

type OptionCardTone = {
  accentText: string
  cardShadow: string
  iconBg: string
}

type DateField = 'birthday' | 'arrival' | 'memorial'

type CreatePetProfile = Pet & {
  aiModelGenerated?: boolean
  aiModelGeneratedAt?: string
  aiModelSpecies?: PetType
  aiModelUrl?: string
  modelReferenceImageUrl?: string
  modelReferenceImages?: AiReferenceImageMeta[]
}

const sexOptions: Array<{ label: string; value: PetSex }> = [
  { label: '男孩', value: 'male' },
  { label: '女孩', value: 'female' },
]

const neuteredStatusOptions: Array<{
  label: string
  value: PetNeuteredStatus
}> = [
  { label: '已绝育', value: 'neutered' },
  { label: '未绝育', value: 'not_neutered' },
]

const allowedImageTypes = new Set(['image/png', 'image/jpeg', 'image/webp'])
const maxModelReferenceImages = 3

type CalendarPopoverProps = {
  anchorRef: RefObject<HTMLDivElement | null>
  onSelect: (date: string) => void
  popoverRef: RefObject<HTMLDivElement | null>
  selectedDate: string
  theme: (typeof createPetThemes)[PetStatus]
}

const catBreeds = [
  '阿比西尼亚猫',
  '埃及猫',
  '奥西猫',
  '巴厘猫',
  '伯曼猫',
  '波斯猫',
  '布偶猫',
  '德文卷毛猫',
  '东方短毛猫',
  '俄罗斯蓝猫',
  '哈瓦那棕猫',
  '加菲猫',
  '柯尼斯卷毛猫',
  '科拉特猫',
  '拉邦猫',
  '狸花猫',
  '临清狮子猫',
  '缅甸猫',
  '缅因猫',
  '曼基康猫',
  '曼岛猫',
  '孟买猫',
  '美国短毛猫',
  '美国卷耳猫',
  '美国短尾猫',
  '挪威森林猫',
  '日本短尾猫',
  '褴褛猫',
  '塞尔凯克卷毛猫',
  '暹罗猫',
  '西伯利亚猫',
  '新加坡猫',
  '苏格兰折耳猫',
  '索马里猫',
  '斯芬克斯猫',
  '土耳其安哥拉猫',
  '土耳其梵猫',
  '英国短毛猫',
  '异国短毛猫',
  '银渐层',
  '金渐层',
  '金吉拉',
  '橘猫',
  '奶牛猫',
  '三花猫',
  '玳瑁猫',
  '中华田园猫',
  '混种猫',
]

const dogBreeds = [
  '阿富汗猎犬',
  '阿拉斯加雪橇犬',
  '澳大利亚牧羊犬',
  '巴哥犬',
  '巴吉度犬',
  '比格犬',
  '比熊犬',
  '边境牧羊犬',
  '博美犬',
  '伯恩山犬',
  '柴犬',
  '茶杯犬',
  '德国牧羊犬',
  '德国短毛指示犬',
  '杜宾犬',
  '大丹犬',
  '大白熊犬',
  '法国斗牛犬',
  '贵宾犬',
  '古代英国牧羊犬',
  '哈士奇',
  '蝴蝶犬',
  '惠比特犬',
  '吉娃娃',
  '金毛寻回犬',
  '杰克罗素梗',
  '卡斯罗犬',
  '柯基犬',
  '可卡犬',
  '拉布拉多寻回犬',
  '腊肠犬',
  '罗威纳犬',
  '马尔济斯犬',
  '马犬',
  '迷你杜宾犬',
  '牛头梗',
  '纽芬兰犬',
  '秋田犬',
  '拳师犬',
  '萨摩耶犬',
  '圣伯纳犬',
  '史宾格犬',
  '松狮犬',
  '泰迪犬',
  '西高地白梗',
  '喜乐蒂牧羊犬',
  '雪纳瑞',
  '寻血猎犬',
  '约克夏',
  '银狐犬',
  '中华田园犬',
  '藏獒',
  '中国冠毛犬',
  '杜高犬',
  '灵缇犬',
  '苏格兰牧羊犬',
  '边境梗',
  '万能梗',
  '混种犬',
]

const createPetCardIcons = {
  active: {
    birthday: '/images/auth/create-pet-page/active_birthday_icon.png',
    breed: '/images/auth/create-pet-page/active_breed_icon.png',
    name: '/images/auth/create-pet-page/active_name_icon.png',
    selectPartner:
      '/images/auth/create-pet-page/active_select_partner_icon.png',
    statusDate: '/images/auth/create-pet-page/active_arrival_date_icon.png',
    uploadAvatar:
      '/images/auth/create-pet-page/active_upload_avatar_icon.png',
  },
  memorial: {
    birthday: '/images/auth/create-pet-page/memorial_birthday_icon.png',
    breed: '/images/auth/create-pet-page/memorial_breed_icon.png',
    name: '/images/auth/create-pet-page/memorial_name_icon.png',
    selectPartner:
      '/images/auth/create-pet-page/memorial_select_partner_icon.png',
    statusDate: '/images/auth/create-pet-page/memorial_death_date_icon.png',
    uploadAvatar:
      '/images/auth/create-pet-page/memorial_upload_avatar_icon.png',
  },
} as const

const getToday = () => new Date().toISOString().slice(0, 10)

const formatDateForValue = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

const formatDateForDisplay = (date: string) =>
  date ? date.replaceAll('-', '/') : '请选择日期'

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

const createPetThemes = {
  active: {
    accentLightText: 'text-orange-400',
    accentText: 'text-orange-500',
    button:
      'from-orange-600 to-orange-500 shadow-[0_18px_34px_rgba(234,88,12,0.26)] hover:from-orange-500 hover:to-orange-400',
    cardShadow: 'shadow-[0_18px_44px_rgba(205,116,35,0.13)]',
    chipActive: 'bg-orange-500 text-white',
    chipInactive: 'bg-orange-50 text-orange-500',
    iconBg: 'bg-orange-100',
    inputAccent:
      'border-orange-100 focus:border-orange-400 focus:ring-orange-100',
    switchThumb: 'bg-orange-500 shadow-[0_10px_20px_rgba(234,88,12,0.22)]',
  },
  memorial: {
    accentLightText: 'text-purple-400',
    accentText: 'text-purple-500',
    button:
      'from-purple-600 to-purple-500 shadow-[0_18px_34px_rgba(126,34,206,0.24)] hover:from-purple-500 hover:to-purple-400',
    cardShadow: 'shadow-[0_18px_44px_rgba(126,34,206,0.12)]',
    chipActive: 'bg-purple-500 text-white',
    chipInactive: 'bg-purple-50 text-purple-500',
    iconBg: 'bg-purple-100',
    inputAccent:
      'border-purple-100 focus:border-purple-400 focus:ring-purple-100',
    switchThumb: 'bg-purple-500 shadow-[0_10px_20px_rgba(126,34,206,0.22)]',
  },
} as const

const OptionCard = ({
  arrowOpen = false,
  children,
  className = '',
  icon,
  iconImageClassName = 'h-9 w-9 select-none object-contain',
  onClick,
  showArrow = true,
  subtitle,
  tone,
  title,
}: OptionCardProps) => (
  <div
    className={`group w-full cursor-pointer rounded-[28px] border border-white/70 bg-white/75 p-3 text-left ${tone.cardShadow} backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/90 ${className}`}
    onClick={onClick}
  >
    <span className="flex items-center gap-2.5">
      <span
        className={`flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl ${tone.iconBg} shadow-inner`}
      >
        <img
          alt=""
          aria-hidden="true"
          className={iconImageClassName}
          src={icon}
        />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-black leading-tight text-stone-900">
          {title}
        </span>
        <span className="mt-0.5 block text-xs font-semibold leading-4 text-stone-500">
          {subtitle}
        </span>
      </span>
      {showArrow ? (
        <span
          className={`text-xl font-black ${tone.accentText} transition duration-300 ease-out group-hover:translate-x-1 ${
            arrowOpen ? 'rotate-90' : ''
          }`}
        >
          ›
        </span>
      ) : null}
    </span>
    {children ? <div className="mt-2">{children}</div> : null}
  </div>
)

const CalendarPopover = ({
  anchorRef,
  onSelect,
  popoverRef,
  selectedDate,
  theme,
}: CalendarPopoverProps) => {
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
    width: number
  } | null>(null)
  const calendarDays = getCalendarDays(viewDate)
  const visibleYears = Array.from({ length: 12 }, (_, index) => yearPageStart + index)
  const weekdays = ['一', '二', '三', '四', '五', '六', '日']
  const hoverSoft =
    theme === createPetThemes.active
      ? 'hover:bg-orange-100 hover:text-orange-700'
      : 'hover:bg-purple-100 hover:text-purple-700'

  useLayoutEffect(() => {
    const updatePosition = () => {
      const anchor = anchorRef.current

      if (!anchor) {
        return
      }

      const cardRect = anchor.getBoundingClientRect()
      const popoverElement = popoverRef.current
      const layoutWidth = popoverElement?.offsetWidth || 320
      const popoverHeight = popoverElement?.offsetHeight || 352
      const safeGap = 24
      const sideGap = 16
      const availableLeftWidth = cardRect.left - sideGap - safeGap
      const popoverWidth = Math.min(
        layoutWidth,
        Math.max(260, availableLeftWidth),
      )
      const safeLeft = cardRect.left - popoverWidth - sideGap
      const desiredTop =
        cardRect.top + cardRect.height / 2 - popoverHeight / 2
      const maxTop = Math.max(
        safeGap,
        window.innerHeight - popoverHeight - safeGap,
      )
      const safeTop = Math.min(Math.max(safeGap, desiredTop), maxTop)

      setPosition({
        left: safeLeft,
        top: safeTop + popoverHeight / 2,
        width: popoverWidth,
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

  const goToYearPage = (offset: number) => {
    setYearPageStart((year) => year + offset * 12)
  }

  const selectYear = (year: number) => {
    setViewDate((date) => new Date(year, date.getMonth(), 1))
    setYearPageStart(getYearPageStart(year))
    setViewMode('date')
  }

  return (
    <div
      className="fixed z-[70] flex h-[352px] w-[320px] max-w-[calc(100vw-32px)] origin-right flex-col overflow-hidden rounded-[24px] border border-white/80 bg-white/90 p-4 shadow-[0_18px_44px_rgba(87,66,40,0.18)] backdrop-blur"
      ref={popoverRef}
      style={{
        animation:
          'createPetDatePopoverIn 380ms cubic-bezier(0.22, 1, 0.36, 1) both',
        left: position ? `${position.left}px` : 0,
        top: position ? `${position.top}px` : 0,
        transformOrigin: 'right center',
        visibility: position ? 'visible' : 'hidden',
        width: position ? `${position.width}px` : undefined,
      }}
    >
      <div className="flex h-9 shrink-0 items-center justify-between">
        <button
          className={`flex h-9 w-9 items-center justify-center rounded-full ${theme.chipInactive} text-lg font-black transition hover:bg-white`}
          onClick={(event) => {
            event.stopPropagation()
            if (viewMode === 'year') {
              goToYearPage(-1)
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
              className={`cursor-pointer rounded-full px-3 py-1 transition duration-200 ease-out ${theme.accentText} ${hoverSoft}`}
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
          className={`flex h-9 w-9 items-center justify-center rounded-full ${theme.chipInactive} text-lg font-black transition hover:bg-white`}
          onClick={(event) => {
            event.stopPropagation()
            if (viewMode === 'year') {
              goToYearPage(1)
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
            'createPetCalendarViewIn 220ms cubic-bezier(0.22, 1, 0.36, 1) both',
        }}
      >
        {viewMode === 'year' ? (
          <div className="grid h-full grid-cols-3 grid-rows-4 gap-2.5">
            {visibleYears.map((year) => (
              <button
                className={`flex h-full min-h-[52px] transform-gpu cursor-pointer items-center justify-center rounded-[18px] text-sm font-black transition duration-150 ease-out active:scale-[0.97] ${
                  year === viewDate.getFullYear()
                    ? theme.chipActive
                    : `text-stone-600 ${hoverSoft}`
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
                        ? theme.chipActive
                        : today.getFullYear() === viewDate.getFullYear() &&
                            today.getMonth() === viewDate.getMonth() &&
                            today.getDate() === day
                          ? `cursor-pointer border ${theme.inputAccent} bg-white/60 ${theme.accentText} ${hoverSoft}`
                          : `cursor-pointer text-stone-600 ${hoverSoft}`
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
    </div>
  )
}

const CreatePet = () => {
  const [status, setStatus] = useState<PetStatus>('active')
  const [petType, setPetType] = useState<PetType>('cat')
  const [selectedBreed, setSelectedBreed] = useState(catBreeds[0])
  const [isBreedDropdownOpen, setIsBreedDropdownOpen] = useState(false)
  const [activeCalendar, setActiveCalendar] = useState<DateField | null>(null)
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [name, setName] = useState('奶糖')
  const [sex, setSex] = useState<PetSex>('female')
  const [neuteredStatus, setNeuteredStatus] =
    useState<PetNeuteredStatus>('not_neutered')
  const [birthday, setBirthday] = useState('2023-05-20')
  const [arrivalDate, setArrivalDate] = useState(getToday())
  const [memorialDate, setMemorialDate] = useState('')
  const [avatarPreview, setAvatarPreview] = useState('')
  const [modelReferenceImages, setModelReferenceImages] = useState<
    AiReferenceImageView[]
  >([])
  const [modelReferenceError, setModelReferenceError] = useState('')
  const [assignedModelUrl, setAssignedModelUrl] = useState('')
  const [assignedModelGeneratedAt, setAssignedModelGeneratedAt] = useState('')
  const [assignedModelSpecies, setAssignedModelSpecies] =
    useState<PetType | null>(null)
  const [isGenerationModalOpen, setIsGenerationModalOpen] = useState(false)
  const [isModelReferencePanelOpen, setIsModelReferencePanelOpen] =
    useState(false)
  const breedDropdownRef = useRef<HTMLDivElement | null>(null)
  const birthdayDateRef = useRef<HTMLDivElement | null>(null)
  const statusDateRef = useRef<HTMLDivElement | null>(null)
  const datePopoverRef = useRef<HTMLDivElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const modelReferencePanelRef = useRef<HTMLDivElement | null>(null)
  const modelReferenceInputRef = useRef<HTMLInputElement | null>(null)

  const breeds = petType === 'cat' ? catBreeds : dogBreeds
  const selectedDate = status === 'active' ? arrivalDate : memorialDate
  const theme = createPetThemes[status]
  const cardIcons = createPetCardIcons[status]

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node
      const targetElement = target instanceof HTMLElement ? target : null

      if (!breedDropdownRef.current?.contains(target)) {
        setIsBreedDropdownOpen(false)
      }

      if (
        !datePopoverRef.current?.contains(target) &&
        !targetElement?.closest('[data-create-pet-date-trigger="true"]')
      ) {
        setActiveCalendar(null)
      }

      if (
        isModelReferencePanelOpen &&
        modelReferencePanelRef.current &&
        !modelReferencePanelRef.current.contains(target)
      ) {
        setIsModelReferencePanelOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsBreedDropdownOpen(false)
        setActiveCalendar(null)
        setIsConfirmModalOpen(false)
        setIsModelReferencePanelOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isModelReferencePanelOpen])

  const handleTypeChange = (type: PetType) => {
    if (type !== petType && (modelReferenceImages.length > 0 || assignedModelUrl)) {
      void deleteAiReferenceImagesByMeta(modelReferenceImages)
      setModelReferenceImages([])
      setModelReferenceError('')
      setAssignedModelUrl('')
      setAssignedModelGeneratedAt('')
      setAssignedModelSpecies(null)
      setIsGenerationModalOpen(false)
      setIsModelReferencePanelOpen(false)
    }

    setPetType(type)
    setIsBreedDropdownOpen(false)
    setActiveCalendar(null)

    const nextBreeds = type === 'cat' ? catBreeds : dogBreeds
    setSelectedBreed((breed) =>
      nextBreeds.includes(breed) ? breed : nextBreeds[0],
    )
  }

  const toggleDateCalendar = (field: DateField) => {
    setIsBreedDropdownOpen(false)
    setActiveCalendar((current) => (current === field ? null : field))
  }

  const handleDateSelect = (field: DateField, date: string) => {
    if (field === 'birthday') {
      setBirthday(date)
    } else if (field === 'arrival') {
      setArrivalDate(date)
    } else {
      setMemorialDate(date)
    }

    setActiveCalendar(null)
  }

  const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    setAvatarPreview(URL.createObjectURL(file))
  }

  const handleModelReferenceChange = async (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const files = Array.from(event.target.files || [])
    event.target.value = ''

    if (files.length === 0) {
      return
    }

    const invalidFile = files.find((file) => !allowedImageTypes.has(file.type))

    if (invalidFile) {
      setModelReferenceError('请上传 JPG、PNG 或 WEBP 格式的图片')
      return
    }

    const remainingSlots = maxModelReferenceImages - modelReferenceImages.length

    if (remainingSlots <= 0) {
      setModelReferenceError('最多上传 3 张参考图')
      return
    }

    try {
      const uploadedImages: AiReferenceImageView[] = []

      for (const file of files.slice(0, remainingSlots)) {
        uploadedImages.push(await saveAiReferenceFile(file))
      }

      setModelReferenceImages((images) => [...images, ...uploadedImages])
      setModelReferenceError(
        files.length > remainingSlots ? '最多上传 3 张参考图' : '',
      )

      if (!assignedModelUrl || assignedModelSpecies !== petType) {
        setIsGenerationModalOpen(true)
      }
    } catch (error) {
      setModelReferenceError(getAiReferenceUploadErrorMessage(error))
    }
  }

  const removeModelReferenceImage = (image: AiReferenceImageView) => {
    setModelReferenceImages((images) => {
      const nextImages = images.filter((item) => item.id !== image.id)

      if (nextImages.length === 0) {
        setAssignedModelUrl('')
        setAssignedModelGeneratedAt('')
        setAssignedModelSpecies(null)
      }

      return nextImages
    })
    setModelReferenceError('')
    void deleteAiReferenceImagesByMeta([image])
  }

  const handleGenerationComplete = () => {
    setAssignedModelUrl((currentModelUrl) =>
      currentModelUrl && assignedModelSpecies === petType
        ? currentModelUrl
        : assignRandomPetModel(petType),
    )
    setAssignedModelGeneratedAt((currentGeneratedAt) =>
      currentGeneratedAt && assignedModelSpecies === petType
        ? currentGeneratedAt
        : new Date().toISOString(),
    )
    setAssignedModelSpecies(petType)
    setIsGenerationModalOpen(false)
    setIsModelReferencePanelOpen(false)
  }

  const buildPet = (): CreatePetProfile => {
    const trimmedName = name.trim()
    const hasValidGeneratedModel = Boolean(
      assignedModelUrl &&
        assignedModelSpecies === petType &&
        modelReferenceImages.length > 0,
    )

    return {
      id: `pet-${Date.now()}`,
      name: trimmedName || '奶糖',
      type: petType,
      breed: selectedBreed,
      sex,
      neuteredStatus,
      avatar: avatarPreview,
      aiModelGenerated: hasValidGeneratedModel,
      aiModelGeneratedAt:
        hasValidGeneratedModel
          ? assignedModelGeneratedAt || new Date().toISOString()
          : undefined,
      aiModelSpecies: hasValidGeneratedModel ? assignedModelSpecies ?? undefined : undefined,
      aiModelUrl: hasValidGeneratedModel ? assignedModelUrl : '',
      modelReferenceImageUrl: '',
      modelReferenceImages: modelReferenceImages.map(
        ({ dataUrl: _dataUrl, ...metadata }) => metadata,
      ),
      status,
      birthday: birthday || getToday(),
      ...(status === 'active'
        ? { arrivalDate: arrivalDate || getToday() }
        : { memorialDate: memorialDate || getToday() }),
    }
  }

  const validatePet = () => {
    if (!name.trim()) {
      return '请先输入名字'
    }

    if (!birthday) {
      return '请选择生日'
    }

    if (status === 'active' && !arrivalDate) {
      return '请选择到家日期'
    }

    if (status === 'memorial' && !memorialDate) {
      return '请选择离世日期'
    }

    return ''
  }

  const handleConfirm = () => {
    const validationMessage = validatePet()

    if (validationMessage) {
      window.alert(validationMessage)
      return
    }

    setIsBreedDropdownOpen(false)
    setActiveCalendar(null)
    setIsConfirmModalOpen(true)
  }

  const handleFinalConfirm = () => {
    const pet = buildPet()

    setStorageItem(STORAGE_KEYS.pet, pet)
    setPetStatus(status)
    navigateTo('/home')
  }

  const petName = name.trim() || '奶糖'
  const petTypeLabel = petType === 'cat' ? '猫咪' : '狗狗'
  const statusLabel = status === 'active' ? '陪伴中' : '纪念中'
  const sexLabel =
    sexOptions.find((option) => option.value === sex)?.label || '女孩'
  const neuteredStatusLabel =
    neuteredStatusOptions.find((option) => option.value === neuteredStatus)
      ?.label || '未绝育'
  const modelReferenceCount = modelReferenceImages.length
  const hasGeneratedModel =
    assignedModelUrl.trim().length > 0 &&
    assignedModelSpecies === petType &&
    modelReferenceCount > 0
  const modalRows = [
    { label: '名字', value: petName },
    { label: '类型', value: petTypeLabel },
    { label: '品种', value: selectedBreed },
    { label: '性别', value: sexLabel },
    { label: '绝育状态', value: neuteredStatusLabel },
    { label: '状态', value: statusLabel, accent: true },
    {
      label: 'AI形象参考图',
      value: modelReferenceCount ? `已上传 ${modelReferenceCount} 张` : '未上传',
    },
    { label: '生日', value: formatDateForDisplay(birthday) },
    {
      label: status === 'active' ? '到家日期' : '离世日期',
      value: formatDateForDisplay(selectedDate),
    },
  ]
  const modalSurface =
    status === 'active'
      ? 'border-orange-100 bg-[#fffaf1]'
      : 'border-purple-100 bg-[#fbf8ff]'
  const modalTitleColor =
    status === 'active' ? 'text-orange-700' : 'text-purple-700'
  const modalAccentText =
    status === 'active' ? 'text-orange-500' : 'text-purple-500'

  return (
    <section className="relative h-[100dvh] w-full overflow-hidden bg-[#fff3df] text-stone-900">
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

          @keyframes createPetDatePopoverIn {
            from {
              opacity: 0;
              transform: translateX(8px) translateY(-50%) scaleX(0.18) scaleY(0.88);
            }
            to {
              opacity: 1;
              transform: translateX(0) translateY(-50%) scaleX(1) scaleY(1);
            }
          }

          @keyframes createPetCalendarViewIn {
            from {
              opacity: 0;
              transform: translateY(8px) scale(0.98);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          @keyframes createPetModalOverlayIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          @keyframes createPetConfirmModalIn {
            from {
              opacity: 0;
              transform: translate(-50%, -50%) scale(0.96);
            }
            to {
              opacity: 1;
              transform: translate(-50%, -50%) scale(1);
            }
          }

          .create-pet-breed-scroll {
            scrollbar-width: thin;
            scrollbar-color: rgba(168, 162, 158, 0.5) transparent;
          }

          .create-pet-breed-scroll::-webkit-scrollbar {
            width: 6px;
          }

          .create-pet-breed-scroll::-webkit-scrollbar-track {
            background: transparent;
          }

          .create-pet-breed-scroll::-webkit-scrollbar-thumb {
            background: rgba(168, 162, 158, 0.45);
            border-radius: 999px;
          }
        `}
      </style>
      <img
        alt=""
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 h-full w-full select-none object-cover object-center transition-opacity duration-500 ease-out ${
          status === 'active' ? 'opacity-100' : 'opacity-0'
        }`}
        src="/images/auth/create-pet-page/background-active.png"
      />
      <img
        alt=""
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 h-full w-full select-none object-cover object-center transition-opacity duration-500 ease-out ${
          status === 'memorial' ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ objectPosition: 'center calc(50% + 15px)' }}
        src="/images/auth/create-pet-page/background-memorial.png"
      />

      <div className="relative z-10 flex h-full flex-col px-[clamp(36px,5vw,86px)] py-[clamp(22px,3vh,34px)]">
        <div className="flex items-center justify-end gap-3 text-sm font-bold text-stone-600">
          <button
            className="rounded-full bg-white/60 px-4 py-2 shadow-sm transition hover:bg-white"
            type="button"
          >
            通知
          </button>
          <button
            className="rounded-full bg-white/60 px-4 py-2 shadow-sm transition hover:bg-white"
            type="button"
          >
            我的
          </button>
        </div>

        <header className="mx-auto mt-1 -translate-y-[18px] text-center">
          <p className={`text-sm font-black tracking-[0.18em] transition-colors duration-300 ${theme.accentLightText}`}>
            AI宠物记忆空间
          </p>
          <h1 className="mt-2 text-[clamp(28px,2.8vw,42px)] font-black text-stone-950">
            创建 TA 的专属空间
          </h1>
          <p className="mt-2 text-base font-semibold text-stone-600">
            从名字开始，慢慢写下你们的故事
          </p>
        </header>

        <div className="relative mx-auto mt-5 grid w-[244px] -translate-y-[22px] grid-cols-2 rounded-full border border-white/70 bg-white/70 p-1 shadow-[0_14px_34px_rgba(205,116,35,0.12)] backdrop-blur">
          <span
            className={`absolute bottom-1 left-1 top-1 w-[calc(50%_-_4px)] rounded-full transition-all duration-300 ease-out ${
              theme.switchThumb
            } ${status === 'memorial' ? 'translate-x-full' : 'translate-x-0'}`}
          />
          {[
            { label: '陪伴中', value: 'active' as const },
            { label: '纪念中', value: 'memorial' as const },
          ].map((item) => (
            <button
              className={`relative z-10 h-10 rounded-full text-sm font-black transition-colors duration-300 ${
                status === item.value
                  ? 'text-white'
                  : `${theme.accentText} opacity-70 hover:opacity-100`
              }`}
              key={item.value}
              onClick={() => {
                setStatus(item.value)
                setIsBreedDropdownOpen(false)
                setActiveCalendar(null)
              }}
              type="button"
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-[minmax(260px,330px)_1fr_minmax(260px,330px)] items-center gap-[clamp(22px,3vw,44px)]">
          <div className="relative -top-[60px] space-y-3">
            <OptionCard
              icon={cardIcons.selectPartner}
              showArrow={false}
              subtitle={`当前选择：${petType === 'cat' ? '猫咪' : '狗狗'}`}
              tone={theme}
              title="选择小伙伴"
            >
              <span className="relative grid grid-cols-2 rounded-full bg-white/70 p-1 shadow-inner">
                <span
                  className={`absolute bottom-1 left-1 top-1 w-[calc(50%_-_4px)] rounded-full shadow-sm transition-all duration-300 ease-out ${
                    status === 'active' ? 'bg-orange-500' : 'bg-purple-500'
                  } ${petType === 'dog' ? 'translate-x-full' : 'translate-x-0'}`}
                />
                {[
                  { label: '猫咪', value: 'cat' as const },
                  { label: '狗狗', value: 'dog' as const },
                ].map((item) => (
                  <button
                    className={`relative z-10 rounded-full px-3 py-1.5 text-center text-xs font-black transition-colors duration-300 ease-out ${
                      petType === item.value
                        ? 'text-white'
                        : `${theme.accentText} opacity-75 hover:opacity-100`
                    }`}
                    key={item.value}
                    onClick={(event) => {
                      event.stopPropagation()
                      handleTypeChange(item.value)
                    }}
                    type="button"
                  >
                    {item.label}
                  </button>
                ))}
              </span>
            </OptionCard>

            <div className="relative" ref={breedDropdownRef}>
              <OptionCard
                arrowOpen={isBreedDropdownOpen}
                icon={cardIcons.breed}
                onClick={() => {
                  setActiveCalendar(null)
                  setIsBreedDropdownOpen((open) => !open)
                }}
                subtitle={`当前品种：${selectedBreed}`}
                tone={theme}
                title="品种"
              />

              {isBreedDropdownOpen ? (
                <div
                  className="absolute left-[calc(100%+16px)] top-1/2 z-50 w-[280px] max-w-[calc(100vw-32px)] origin-left overflow-hidden rounded-[24px] border border-white/80 bg-white/90 p-2 shadow-[0_18px_44px_rgba(87,66,40,0.18)] backdrop-blur"
                  style={{
                    animation:
                      'createPetBreedPopoverIn 380ms cubic-bezier(0.22, 1, 0.36, 1) both',
                    transformOrigin: 'left center',
                  }}
                >
                  <div
                    className="create-pet-breed-scroll max-h-[300px] overflow-y-auto pr-1"
                    style={{ maxHeight: 'min(300px, calc(100vh - 48px))' }}
                  >
                    {breeds.map((breed) => (
                      <button
                        className={`block h-10 w-full rounded-2xl px-4 text-left text-sm font-bold transition duration-200 ease-out ${
                          selectedBreed === breed
                            ? theme.chipActive
                            : 'text-stone-600 hover:bg-white hover:text-stone-900'
                        }`}
                        key={breed}
                        onClick={(event) => {
                          event.stopPropagation()
                          setSelectedBreed(breed)
                          setIsBreedDropdownOpen(false)
                        }}
                        type="button"
                      >
                        {breed}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>

            <OptionCard
              icon={cardIcons.name}
              showArrow={false}
              subtitle="给 TA 起个名字吧"
              tone={theme}
              title="输入名字"
            >
              <div className="space-y-2.5">
                <input
                  className={`h-9 w-full rounded-2xl border bg-white/80 px-4 text-sm font-bold outline-none transition placeholder:text-stone-300 focus:ring-4 ${theme.inputAccent}`}
                  onChange={(event) => setName(event.target.value)}
                  onClick={(event) => event.stopPropagation()}
                  placeholder="奶糖"
                  value={name}
                />

                <div className="flex items-center gap-3">
                  <span className="w-[58px] shrink-0 whitespace-nowrap text-xs font-black text-stone-500">
                    性别
                  </span>
                  <span className="relative grid flex-1 grid-cols-2 rounded-full bg-white/70 p-1 shadow-inner">
                    <span
                      className={`absolute bottom-1 left-1 top-1 w-[calc(50%_-_4px)] rounded-full shadow-sm transition-all duration-300 ease-out ${
                        status === 'active' ? 'bg-orange-500' : 'bg-purple-500'
                      } ${
                        sex === 'female' ? 'translate-x-full' : 'translate-x-0'
                      }`}
                    />
                    {sexOptions.map((item) => (
                      <button
                        className={`relative z-10 rounded-full px-3 py-1.5 text-center text-xs font-black transition-colors duration-300 ease-out ${
                          sex === item.value
                            ? 'text-white'
                            : `${theme.accentText} opacity-75 hover:opacity-100`
                        }`}
                        key={item.value}
                        onClick={(event) => {
                          event.stopPropagation()
                          setSex(item.value)
                        }}
                        type="button"
                      >
                        {item.label}
                      </button>
                    ))}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="w-[58px] shrink-0 whitespace-nowrap text-xs font-black text-stone-500">
                    绝育状态
                  </span>
                  <span className="relative grid flex-1 grid-cols-2 rounded-full bg-white/70 p-1 shadow-inner">
                    <span
                      className={`absolute bottom-1 left-1 top-1 w-[calc(50%_-_4px)] rounded-full shadow-sm transition-all duration-300 ease-out ${
                        status === 'active' ? 'bg-orange-500' : 'bg-purple-500'
                      }`}
                      style={{
                        transform: `translateX(${
                          neuteredStatusOptions.findIndex(
                            (item) => item.value === neuteredStatus,
                          ) * 100
                        }%)`,
                      }}
                    />
                    {neuteredStatusOptions.map((item) => (
                      <button
                        className={`relative z-10 rounded-full px-3 py-1.5 text-center text-xs font-black transition-colors duration-300 ease-out ${
                          neuteredStatus === item.value
                            ? 'text-white'
                            : `${theme.accentText} opacity-75 hover:opacity-100`
                        }`}
                        key={item.value}
                        onClick={(event) => {
                          event.stopPropagation()
                          setNeuteredStatus(item.value)
                        }}
                        type="button"
                      >
                        {item.label}
                      </button>
                    ))}
                  </span>
                </div>
              </div>
            </OptionCard>
          </div>

          <div className="relative mx-auto flex h-[min(52vh,440px)] w-full max-w-[560px] items-center justify-center">
            <div className="group relative h-[min(48vh,420px)] w-[clamp(360px,34vw,560px)] -translate-y-[38px] scale-[0.93]">
              {!hasGeneratedModel ? (
                <>
                  <img
                    alt=""
                    aria-hidden="true"
                    className={`pointer-events-none absolute inset-0 h-full w-full select-none object-contain transition duration-300 ease-out group-hover:scale-[1.015] ${
                      status === 'active' ? 'opacity-100' : 'opacity-0'
                    }`}
                    src="/images/auth/create-pet-page/dashed-active.png"
                  />
                  <img
                    alt=""
                    aria-hidden="true"
                    className={`pointer-events-none absolute inset-0 h-full w-full select-none object-contain transition duration-300 ease-out group-hover:scale-[1.015] ${
                      status === 'memorial' ? 'opacity-100' : 'opacity-0'
                    }`}
                    src="/images/auth/create-pet-page/dashed-memorial.png"
                  />
                </>
              ) : null}
              {hasGeneratedModel ? (
                <PetModelViewer
                  alt={`${petName} 的 AI 3D 宠物形象`}
                  className="absolute left-1/2 top-[calc(43%+1cm)] z-[6] h-[min(57.33vh,492px)] w-[min(45.864vw,540px)] -translate-x-1/2 -translate-y-1/2 transition duration-300 ease-out"
                  modelUrl={assignedModelUrl}
                />
              ) : modelReferenceCount > 0 ? (
                <div className="pointer-events-none absolute left-1/2 top-[43%] z-[5] flex -translate-x-1/2 -translate-y-1/2 gap-2 rounded-[26px] bg-white/45 p-2 shadow-[0_18px_42px_rgba(74,48,20,0.16)] backdrop-blur-sm transition duration-300 ease-out group-hover:scale-[1.015]">
                  {modelReferenceImages.map((image, index) => (
                    <img
                      alt={`AI宠物形象参考图 ${index + 1}`}
                      className={`rounded-[20px] border border-white/80 object-cover shadow-sm ${
                        modelReferenceCount === 1 ? 'h-40 w-40' : 'h-24 w-24'
                      }`}
                      key={image.id}
                      src={image.dataUrl}
                    />
                  ))}
                </div>
              ) : null}
              {!hasGeneratedModel ? (
                <button
                  aria-label="上传参考照片用于生成 AI 宠物形象"
                  className={`absolute inset-0 z-10 flex cursor-pointer justify-center rounded-[34px] text-center outline-none transition duration-300 ease-out focus-visible:ring-4 focus-visible:ring-white/80 ${
                    modelReferenceCount > 0 ? 'items-end pb-12' : 'items-center'
                  }`}
                  onClick={() => {
                    if (!isModelReferencePanelOpen) {
                      setIsModelReferencePanelOpen(true)
                    }
                  }}
                  type="button"
                >
                  <span
                    className={`rounded-full border border-white/80 bg-white/76 px-5 py-3 shadow-[0_14px_34px_rgba(87,66,40,0.16)] backdrop-blur transition duration-300 ease-out group-hover:-translate-y-1 group-hover:bg-white/92 ${
                      status === 'active'
                        ? 'group-hover:shadow-[0_16px_38px_rgba(234,88,12,0.22)]'
                        : 'group-hover:shadow-[0_16px_38px_rgba(126,34,206,0.20)]'
                    }`}
                  >
                    <span className={`block text-sm font-black ${theme.accentText}`}>
                      {modelReferenceCount > 0
                        ? `已上传 ${modelReferenceCount} 张参考图`
                        : '点击生成 AI 宠物形象'}
                    </span>
                    <span className="mt-1 block text-xs font-bold text-stone-500">
                      {modelReferenceCount === 0
                        ? '建议上传 2–3 张清晰照片'
                        : modelReferenceCount >= maxModelReferenceImages
                          ? '管理照片'
                          : '继续添加 / 管理照片'}
                    </span>
                  </span>
                </button>
              ) : null}
              <div
                className={`absolute left-1/2 top-1/2 z-30 w-[min(372px,90%)] -translate-x-1/2 -translate-y-1/2 ${
                  isModelReferencePanelOpen
                    ? 'pointer-events-auto'
                    : 'pointer-events-none'
                }`}
              >
                <div
                  ref={modelReferencePanelRef}
                  className={`origin-bottom rounded-[28px] border border-white/80 bg-white/92 p-5 text-left shadow-[0_24px_64px_rgba(74,48,20,0.22)] backdrop-blur-md transition-all duration-300 ease-out ${
                    isModelReferencePanelOpen
                      ? 'translate-y-0 scale-100 opacity-100'
                      : 'translate-y-3 scale-95 opacity-0'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className={`text-lg font-black ${theme.accentText}`}>
                        AI 模型形象参考图
                      </p>
                    </div>
                    <button
                      aria-label="关闭上传说明面板"
                      className={`flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full bg-white/80 text-base font-black text-stone-500 shadow-sm transition duration-200 ease-out hover:-translate-y-0.5 hover:scale-105 hover:shadow-md active:scale-95 ${
                        status === 'active'
                          ? 'hover:bg-orange-50 hover:text-orange-600'
                          : 'hover:bg-purple-50 hover:text-purple-600'
                      }`}
                      onClick={() => setIsModelReferencePanelOpen(false)}
                      type="button"
                    >
                      <span aria-hidden="true">×</span>
                    </button>
                  </div>

                  <div className="mt-3 space-y-3">
                    <p className="text-sm font-semibold leading-6 text-stone-600">
                      上传 2–3 张清晰照片，AI 形象会更接近 TA。
                    </p>

                    <div>
                      <p className="text-xs font-black tracking-[0.08em] text-stone-400">
                        建议包含
                      </p>
                      <div className="mt-2 grid gap-2.5 text-sm font-bold leading-5 text-stone-600">
                        {[
                          '正脸清晰照',
                          '侧脸或全身照',
                          '有代表性的表情或姿势照',
                        ].map((tip) => (
                          <span className="flex items-center gap-2" key={tip}>
                            <span
                              className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                                status === 'active'
                                  ? 'bg-orange-500'
                                  : 'bg-purple-500'
                              }`}
                            />
                            <span>{tip}</span>
                          </span>
                        ))}
                      </div>
                    </div>

                    <p
                      className={`rounded-2xl px-3 py-2 text-left text-sm font-semibold leading-6 ${
                        status === 'active'
                          ? 'bg-orange-50 text-orange-700'
                          : 'bg-purple-50 text-purple-700'
                      }`}
                    >
                      照片越清晰，生成效果越稳定。
                    </p>
                  </div>

                  {modelReferenceCount > 0 ? (
                    <div className="mt-3 grid grid-cols-3 gap-2">
                      {modelReferenceImages.map((image, index) => (
                        <div
                          className="group/thumb relative overflow-hidden rounded-2xl border border-white/80 bg-white shadow-inner"
                          key={image.id}
                        >
                          <img
                            alt={`AI形象参考图 ${index + 1}`}
                            className="h-20 w-full object-cover"
                            src={image.dataUrl}
                          />
                          <button
                            className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/50 text-xs font-black text-white opacity-90 transition hover:bg-black/65"
                            onClick={() => removeModelReferenceImage(image)}
                            type="button"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : null}

                  <div className="mt-4 flex items-center justify-between gap-3">
                    <p
                      className={`min-w-0 text-xs font-bold leading-5 ${
                        modelReferenceError ? 'text-rose-400' : 'text-stone-400'
                      }`}
                    >
                      {modelReferenceError ||
                        '最多上传 3 张，支持 JPG / PNG / WEBP，单张不超过 20MB'}
                    </p>
                    <button
                      className={`h-10 shrink-0 rounded-full px-5 text-sm font-black text-white shadow-sm transition hover:-translate-y-0.5 ${
                        modelReferenceCount >= maxModelReferenceImages
                          ? 'cursor-not-allowed bg-stone-300'
                          : status === 'active'
                            ? 'bg-orange-500 hover:bg-orange-400'
                            : 'bg-purple-500 hover:bg-purple-400'
                      }`}
                      disabled={modelReferenceCount >= maxModelReferenceImages}
                      onClick={() => modelReferenceInputRef.current?.click()}
                      type="button"
                    >
                      选择照片
                    </button>
                  </div>
                </div>
              </div>
              <input
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                multiple
                onChange={handleModelReferenceChange}
                ref={modelReferenceInputRef}
                type="file"
              />
            </div>
          </div>

          <div className="relative -top-[60px] space-y-3">
            <OptionCard
              className="flex min-h-[76px] flex-col justify-center"
              icon={avatarPreview || cardIcons.uploadAvatar}
              iconImageClassName={
                avatarPreview
                  ? 'h-full w-full select-none rounded-2xl object-cover'
                  : undefined
              }
              onClick={() => fileInputRef.current?.click()}
              subtitle={avatarPreview ? '已选择一张头像' : '记录可爱的模样'}
              tone={theme}
              title="上传头像"
            />
            <input
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
              ref={fileInputRef}
              type="file"
            />

            <div
              className="relative"
              data-create-pet-date-trigger="true"
              ref={birthdayDateRef}
            >
              <OptionCard
                arrowOpen={activeCalendar === 'birthday'}
                className="flex min-h-[150px] flex-col justify-center"
                icon={cardIcons.birthday}
                onClick={() => toggleDateCalendar('birthday')}
                subtitle="选择生日日期"
                tone={theme}
                title="生日"
              >
                <button
                  className={`h-11 w-full rounded-2xl border bg-white/80 px-4 text-left text-[15px] font-black outline-none transition focus:ring-4 ${theme.inputAccent}`}
                  onClick={(event) => {
                    event.stopPropagation()
                    toggleDateCalendar('birthday')
                  }}
                  type="button"
                >
                  {formatDateForDisplay(birthday)}
                </button>
              </OptionCard>

              {activeCalendar === 'birthday' ? (
                <CalendarPopover
                  anchorRef={birthdayDateRef}
                  onSelect={(date) => handleDateSelect('birthday', date)}
                  popoverRef={datePopoverRef}
                  selectedDate={birthday}
                  theme={theme}
                />
              ) : null}
            </div>

            <div
              className="relative"
              data-create-pet-date-trigger="true"
              ref={statusDateRef}
            >
              <OptionCard
                arrowOpen={activeCalendar === (status === 'active' ? 'arrival' : 'memorial')}
                className="flex min-h-[150px] flex-col justify-center"
                icon={cardIcons.statusDate}
                onClick={() =>
                  toggleDateCalendar(status === 'active' ? 'arrival' : 'memorial')
                }
                subtitle={
                  status === 'active' ? '选择到家日期' : '选择离世日期'
                }
                tone={theme}
                title={status === 'active' ? '到家日期' : '离世日期'}
              >
                <button
                  className={`h-11 w-full rounded-2xl border bg-white/80 px-4 text-left text-[15px] font-black outline-none transition focus:ring-4 ${theme.inputAccent}`}
                  onClick={(event) => {
                    event.stopPropagation()
                    toggleDateCalendar(
                      status === 'active' ? 'arrival' : 'memorial',
                    )
                  }}
                  type="button"
                >
                  {formatDateForDisplay(selectedDate)}
                </button>
              </OptionCard>

              {activeCalendar === (status === 'active' ? 'arrival' : 'memorial') ? (
                <CalendarPopover
                  anchorRef={statusDateRef}
                  onSelect={(date) =>
                    handleDateSelect(
                      status === 'active' ? 'arrival' : 'memorial',
                      date,
                    )
                  }
                  popoverRef={datePopoverRef}
                  selectedDate={selectedDate}
                  theme={theme}
                />
              ) : null}
            </div>
          </div>
        </div>

        <div className="relative z-[60] flex justify-center pb-1">
          <button
            className={`relative z-[60] h-14 min-w-[260px] cursor-pointer rounded-full bg-gradient-to-r px-10 text-lg font-black text-white transition hover:-translate-y-0.5 ${theme.button}`}
            onClick={handleConfirm}
            type="button"
          >
            确认创建
          </button>
        </div>
      </div>

      {isConfirmModalOpen ? (
        <div
          className="fixed inset-0 z-[80]"
          onClick={() => setIsConfirmModalOpen(false)}
        >
          <div
            className="absolute inset-0 bg-black/50"
            style={{ animation: 'createPetModalOverlayIn 220ms ease-out both' }}
          />
          <div
            className={`fixed left-1/2 top-1/2 max-h-[calc(100vh-48px)] w-[540px] max-w-[calc(100vw-48px)] overflow-y-auto rounded-[26px] border p-4 shadow-[0_28px_80px_rgba(60,38,18,0.22)] ${modalSurface}`}
            onClick={(event) => event.stopPropagation()}
            style={{
              animation:
                'createPetConfirmModalIn 220ms cubic-bezier(0.22, 1, 0.36, 1) both',
            }}
          >
            <h2
              className={`text-center text-[clamp(22px,2.4vw,30px)] font-black ${modalTitleColor}`}
            >
              确认创建 TA 的专属空间吗？
            </h2>

            <div className="mt-4 grid grid-cols-[116px_1fr] items-center gap-4 rounded-[22px] border border-white/70 bg-white/70 p-3 shadow-inner">
              <div
                className={`mx-auto flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 ${
                  status === 'active'
                    ? 'border-orange-100 bg-orange-50'
                    : 'border-purple-100 bg-purple-50'
                }`}
              >
                <img
                  alt={petName}
                  className={`h-full w-full ${
                    avatarPreview ? 'object-cover' : 'object-contain p-5'
                  }`}
                  src={avatarPreview || cardIcons.uploadAvatar}
                />
              </div>

              <div className="space-y-1">
                {modalRows.map((row) => (
                  <div
                    className="flex items-center justify-between gap-4 border-b border-dashed border-stone-200 py-1.5 text-sm last:border-b-0"
                    key={row.label}
                  >
                    <span className="font-bold text-stone-500">
                      {row.label}
                    </span>
                    <span
                      className={`text-right font-black ${
                        row.accent ? modalAccentText : 'text-stone-800'
                      }`}
                    >
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <p className="mt-3 text-center text-sm font-semibold text-stone-500">
              创建后将进入 TA 的专属主页，你可以之后再继续完善信息哦
            </p>

            <div className="mt-4 flex justify-center gap-3">
              <button
                className="h-10 min-w-[132px] rounded-full border border-stone-200 bg-white/80 px-6 text-sm font-black text-stone-600 transition hover:-translate-y-0.5 hover:bg-white"
                onClick={() => setIsConfirmModalOpen(false)}
                type="button"
              >
                再看看
              </button>
              <button
                className={`h-10 min-w-[150px] rounded-full bg-gradient-to-r px-6 text-sm font-black text-white transition hover:-translate-y-0.5 ${theme.button}`}
                onClick={handleFinalConfirm}
                type="button"
              >
                确认创建
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <AIModelGenerationModal
        isOpen={isGenerationModalOpen}
        onComplete={handleGenerationComplete}
        status={status}
      />
    </section>
  )
}

export default CreatePet
