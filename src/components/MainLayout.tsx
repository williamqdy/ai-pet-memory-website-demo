import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import { mockPet } from '../data/mockData'
import type { Pet, PetStatus } from '../types'
import {
  getPetStatus,
  getStorageItem,
  setPetStatus as persistPetStatus,
  setStorageItem,
  STORAGE_KEYS,
} from '../utils/storage'

type MainLayoutProps = {
  children: ReactNode
  currentPath: string
}

type MainTheme = {
  background: string
  header: string
  inactiveNav: string
  mutedText: string
  primary: string
  primaryBg: string
  softBg: string
  switchThumb: string
}

type MainPetContextValue = {
  ageText: string
  pet: Pet
  status: PetStatus
  theme: MainTheme
}

const mainThemes: Record<PetStatus, MainTheme> = {
  active: {
    background: 'bg-[#fff3df]',
    header:
      'from-[#ffd89a] via-[#ffe8b9] to-[#fff6df] text-stone-900',
    inactiveNav: 'text-[#9A6B45] hover:text-orange-500',
    mutedText: 'text-orange-700/70',
    primary: 'text-orange-500',
    primaryBg: 'bg-orange-500',
    softBg: 'bg-orange-50',
    switchThumb: 'bg-orange-500 shadow-[0_10px_22px_rgba(234,88,12,0.22)]',
  },
  memorial: {
    background: 'bg-[#f5efff]',
    header:
      'from-[#e7dcff] via-[#f4edff] to-[#fff9ff] text-stone-900',
    inactiveNav: 'text-[#83739E] hover:text-purple-500',
    mutedText: 'text-purple-700/70',
    primary: 'text-purple-500',
    primaryBg: 'bg-purple-500',
    softBg: 'bg-purple-50',
    switchThumb: 'bg-purple-500 shadow-[0_10px_22px_rgba(126,34,206,0.22)]',
  },
}

const MainPetContext = createContext<MainPetContextValue | null>(null)

const mainHeaderBackgrounds: Record<PetStatus, string> = {
  active: '/images/auth/home-page/background-up-active-.png',
  memorial: '/images/auth/home-page/background-up-memorial.png',
}

const mainContentBackgrounds: Record<PetStatus, string> = {
  active: '/images/auth/home-page/background-active.png',
  memorial: '/images/auth/home-page/background-memorial.png',
}

const mainHeaderImageStyles: Record<
  PetStatus,
  { transform: string; width?: string }
> = {
  active: {
    transform: 'translateX(-50%) translateY(15%) scale(1.08)',
  },
  memorial: {
    transform: 'translateX(-50%) translateY(24%)',
    width: '108%',
  },
}

const avatarImageTypes = new Set(['image/jpeg', 'image/png', 'image/webp'])
const avatarMaxSizeBytes = 10 * 1024 * 1024

class AvatarImageError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'AvatarImageError'
  }
}

const readFileAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader()

    reader.onerror = () =>
      reject(new AvatarImageError('头像处理失败，请换一张图片再试'))
    reader.onload = () => {
      const dataUrl = String(reader.result || '')

      if (!dataUrl) {
        reject(new AvatarImageError('头像处理失败，请换一张图片再试'))
        return
      }

      resolve(dataUrl)
    }
    reader.readAsDataURL(file)
  })

const loadAvatarImage = (dataUrl: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()

    image.onerror = () =>
      reject(new AvatarImageError('头像处理失败，请换一张图片再试'))
    image.onload = () => resolve(image)
    image.src = dataUrl
  })

const compressAvatarImage = async (file: File) => {
  if (!avatarImageTypes.has(file.type)) {
    throw new AvatarImageError('请上传 JPG、PNG 或 WEBP 格式的图片')
  }

  if (file.size > avatarMaxSizeBytes) {
    throw new AvatarImageError('头像图片不能超过 10MB')
  }

  try {
    const dataUrl = await readFileAsDataUrl(file)
    const image = await loadAvatarImage(dataUrl)
    const maxSide = 512
    const sourceWidth = image.naturalWidth || image.width
    const sourceHeight = image.naturalHeight || image.height
    const scale = Math.min(1, maxSide / Math.max(sourceWidth, sourceHeight))
    const width = Math.max(1, Math.round(sourceWidth * scale))
    const height = Math.max(1, Math.round(sourceHeight * scale))
    const canvas = document.createElement('canvas')

    canvas.width = width
    canvas.height = height

    const context = canvas.getContext('2d')

    if (!context) {
      throw new AvatarImageError('头像处理失败，请换一张图片再试')
    }

    context.fillStyle = '#fff'
    context.fillRect(0, 0, width, height)
    context.drawImage(image, 0, 0, width, height)

    return canvas.toDataURL('image/jpeg', 0.82)
  } catch (error) {
    if (error instanceof AvatarImageError) {
      throw error
    }

    throw new AvatarImageError('头像处理失败，请换一张图片再试')
  }
}

const mainNavItems = [
  { path: '/home', label: '首页', icon: '⌂' },
  { path: '/timeline', label: '时间线', icon: '◌' },
  { path: '/album', label: '相册', icon: '▧' },
  { path: '/growth-records', label: '成长记录', icon: '✚' },
]

const getAgeText = (birthday?: string) => {
  if (!birthday) {
    return '2岁1个月'
  }

  const birthDate = new Date(birthday)

  if (Number.isNaN(birthDate.getTime())) {
    return '2岁1个月'
  }

  const today = new Date()
  let years = today.getFullYear() - birthDate.getFullYear()
  let months = today.getMonth() - birthDate.getMonth()

  if (today.getDate() < birthDate.getDate()) {
    months -= 1
  }

  if (months < 0) {
    years -= 1
    months += 12
  }

  if (years <= 0) {
    return `${Math.max(months, 1)}个月`
  }

  return `${years}岁${months}个月`
}

export const useMainPetLayout = () => {
  const context = useContext(MainPetContext)

  if (!context) {
    throw new Error('useMainPetLayout must be used inside MainLayout')
  }

  return context
}

const MainLayout = ({ children, currentPath }: MainLayoutProps) => {
  const [pet, setPet] = useState(() =>
    getStorageItem<Pet>(STORAGE_KEYS.pet, mockPet),
  )
  const [status, setStatus] = useState<PetStatus>(() =>
    getPetStatus(pet.status),
  )
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false)
  const [avatarError, setAvatarError] = useState('')
  const [isAvatarProcessing, setIsAvatarProcessing] = useState(false)
  const [avatarLoadError, setAvatarLoadError] = useState(false)
  const avatarInputRef = useRef<HTMLInputElement | null>(null)
  const theme = mainThemes[status]
  const ageText = useMemo(() => getAgeText(pet.birthday), [pet.birthday])
  const avatarFallback =
    status === 'active'
      ? '/images/auth/create-pet-page/active_upload_avatar_icon.png'
      : '/images/auth/create-pet-page/memorial_upload_avatar_icon.png'
  const hasAvatar = Boolean(pet.avatar) && !avatarLoadError
  const avatarSrc = hasAvatar ? pet.avatar : avatarFallback
  const avatarButtonClass =
    status === 'active'
      ? 'bg-gradient-to-r from-orange-600 to-orange-500 shadow-[0_18px_34px_rgba(234,88,12,0.26)] hover:from-orange-500 hover:to-orange-400'
      : 'bg-gradient-to-r from-purple-600 to-purple-500 shadow-[0_18px_34px_rgba(126,34,206,0.24)] hover:from-purple-500 hover:to-purple-400'

  const handleStatusChange = (nextStatus: PetStatus) => {
    setStatus(nextStatus)
    persistPetStatus(nextStatus)
  }

  const closeAvatarModal = () => {
    setIsAvatarModalOpen(false)
    setAvatarError('')
  }

  const handleAvatarFileChange = async (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0]
    event.target.value = ''

    if (!file) {
      return
    }

    setAvatarError('')
    setIsAvatarProcessing(true)

    try {
      const compressedAvatar = await compressAvatarImage(file)
      const nextPet = {
        ...pet,
        avatar: compressedAvatar,
      }

      setPet(nextPet)
      setStorageItem(STORAGE_KEYS.pet, nextPet)
      setAvatarLoadError(false)
    } catch (error) {
      setAvatarError(
        error instanceof AvatarImageError
          ? error.message
          : '头像处理失败，请换一张图片再试',
      )
    } finally {
      setIsAvatarProcessing(false)
    }
  }

  useEffect(() => {
    ;[
      ...Object.values(mainHeaderBackgrounds),
      ...Object.values(mainContentBackgrounds),
    ].forEach((src) => {
      const image = new Image()
      image.src = src
    })
  }, [])

  useEffect(() => {
    setAvatarLoadError(false)
  }, [pet.avatar, status])

  useEffect(() => {
    closeAvatarModal()
  }, [currentPath, status])

  useEffect(() => {
    if (!isAvatarModalOpen) {
      return undefined
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeAvatarModal()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isAvatarModalOpen])

  const contextValue = useMemo(
    () => ({
      ageText,
      pet,
      status,
      theme,
    }),
    [ageText, pet, status, theme],
  )
  const activeNavIndex = Math.max(
    0,
    mainNavItems.findIndex((item) => item.path === currentPath),
  )

  return (
    <MainPetContext.Provider value={contextValue}>
      <style>
        {`
          @keyframes mainPetPageIn {
            from {
              opacity: 0;
              transform: translateY(6px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes mainAvatarOverlayIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          @keyframes mainAvatarModalIn {
            from {
              opacity: 0;
              transform: translate(-50%, -48%) scale(0.96);
            }
            to {
              opacity: 1;
              transform: translate(-50%, -50%) scale(1);
            }
          }
        `}
      </style>
      <main
        className={`flex min-h-screen items-center justify-center overflow-hidden p-4 text-stone-800 transition-colors duration-300 ${theme.background}`}
      >
        <div className="h-[95vh] w-[80vw] min-w-[min(980px,calc(100vw-32px))] max-w-[1440px] overflow-hidden rounded-[34px] bg-white/82 shadow-[0_28px_80px_rgba(116,72,28,0.18)]">
          <header
            className="relative h-[calc(30%-30px)] min-h-[158px] w-full overflow-hidden text-stone-900 [font-size:0] [line-height:0]"
          >
            {(['active', 'memorial'] as const).map((backgroundStatus) => (
              <img
                alt=""
                aria-hidden="true"
                className={`pointer-events-none absolute -bottom-px left-1/2 z-0 block h-auto min-h-[calc(100%+2px)] w-full min-w-full max-w-none transition-opacity duration-300 ease-out ${
                  status === backgroundStatus ? 'opacity-100' : 'opacity-0'
                }`}
                decoding="async"
                key={backgroundStatus}
                loading="eager"
                src={mainHeaderBackgrounds[backgroundStatus]}
                style={{
                  ...mainHeaderImageStyles[backgroundStatus],
                  transformOrigin: 'bottom center',
                }}
              />
            ))}

            <div className="relative z-10 flex h-full w-full px-8 py-6">
              <div className="flex h-full flex-1 items-center gap-4">
                <button
                  aria-label="查看并切换宠物头像"
                  className="flex h-24 w-24 cursor-pointer items-center justify-center overflow-hidden rounded-full border-4 border-white/75 bg-white/70 shadow-[0_14px_34px_rgba(116,72,28,0.16)] transition duration-200 ease-out hover:-translate-y-0.5 hover:scale-[1.02] hover:bg-white/86 hover:shadow-[0_18px_42px_rgba(116,72,28,0.22)] active:scale-[0.97]"
                  onClick={() => {
                    setAvatarError('')
                    setIsAvatarModalOpen(true)
                  }}
                  type="button"
                >
                  <img
                    alt={pet.name || '奶糖'}
                    className={`h-full w-full ${
                      hasAvatar ? 'object-cover' : 'object-contain p-5'
                    }`}
                    onError={() => setAvatarLoadError(true)}
                    src={avatarSrc}
                  />
                </button>

                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-3xl font-black text-stone-900">
                      {pet.name || '奶糖'}
                    </h1>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-black text-white ${theme.primaryBg}`}
                    >
                      {pet.sex === 'male' ? '♂' : '♀'}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-black text-stone-700">
                      {pet.breed || '布偶猫'}
                    </span>
                    <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-black text-stone-700">
                      {ageText}
                    </span>
                    <span className={`rounded-full bg-white/70 px-3 py-1 text-xs font-black ${theme.primary}`}>
                      {status === 'active' ? '陪伴中' : '纪念中'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex h-full flex-col items-end justify-between">
                <div className="flex gap-2 text-sm font-black text-stone-600">
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

                <div className="relative grid w-[236px] grid-cols-2 rounded-full border border-white/70 bg-white/70 p-1 shadow-[0_14px_34px_rgba(87,66,40,0.12)] backdrop-blur">
                  <span
                    className={`absolute bottom-1 left-1 top-1 w-[calc(50%_-_4px)] rounded-full transition-transform duration-300 ease-out ${
                      theme.switchThumb
                    } ${
                      status === 'memorial'
                        ? 'translate-x-full'
                        : 'translate-x-0'
                    }`}
                  />
                  {[
                    { label: '陪伴中', value: 'active' as const },
                    { label: '纪念中', value: 'memorial' as const },
                  ].map((item) => (
                    <button
                      className={`relative z-10 h-10 rounded-full text-sm font-black transition-colors duration-300 ${
                        status === item.value
                          ? 'text-white'
                          : `${theme.primary} opacity-70 hover:opacity-100`
                      }`}
                      key={item.value}
                      onClick={() => handleStatusChange(item.value)}
                      type="button"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </header>

          <nav
            className="relative -mt-px grid h-12 grid-cols-4 items-center border-b border-t-0 border-stone-100 bg-white/82 px-8 pt-0"
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute bottom-1.5 z-0 transition-transform duration-300 ease-out"
              style={{
                left: '32px',
                transform: `translateX(${activeNavIndex * 100}%)`,
                width: 'calc((100% - 64px) / 4)',
              }}
            >
              <span
                className={`mx-auto block h-[3px] w-14 rounded-full shadow-sm transition-colors duration-200 ${theme.primaryBg}`}
              />
            </span>
            {mainNavItems.map((item) => {
              const isActive = item.path === currentPath

              return (
                <a
                  aria-current={isActive ? 'page' : undefined}
                  className={`relative z-10 flex h-8 items-center justify-center gap-1.5 px-4 text-[13px] transition-colors duration-200 ${
                    isActive
                      ? `${theme.primary} font-black`
                      : `${theme.inactiveNav} font-extrabold`
                  }`}
                  href={item.path}
                  key={item.path}
                >
                  <span className="text-sm transition-colors duration-200">
                    {item.icon}
                  </span>
                  {item.label}
                </a>
              )
            })}
          </nav>

          <section className="relative h-[calc(70%-17px)] overflow-hidden bg-[#fffaf3]">
            {(['active', 'memorial'] as const).map((backgroundStatus) => (
              <img
                alt=""
                aria-hidden="true"
                className={`pointer-events-none absolute inset-0 z-0 h-full w-full object-cover transition-opacity duration-500 ease-out will-change-[opacity] [backface-visibility:hidden] ${
                  status === backgroundStatus ? 'opacity-100' : 'opacity-0'
                }`}
                decoding="async"
                key={backgroundStatus}
                loading="eager"
                src={mainContentBackgrounds[backgroundStatus]}
              />
            ))}
            <div
              className="relative z-10 h-full"
              key={currentPath}
              style={{
                animation:
                  'mainPetPageIn 220ms cubic-bezier(0.22, 1, 0.36, 1) both',
              }}
            >
              {children}
            </div>
          </section>
        </div>
      </main>
      <input
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleAvatarFileChange}
        ref={avatarInputRef}
        type="file"
      />
      {isAvatarModalOpen
        ? createPortal(
            <div className="fixed inset-0 z-[100]" onClick={closeAvatarModal}>
              <div
                className="absolute inset-0 bg-black/38"
                style={{
                  animation: 'mainAvatarOverlayIn 220ms ease-out both',
                }}
              />
              <section
                className="fixed left-1/2 top-1/2 z-[101] flex max-h-[calc(100vh-48px)] w-[min(560px,calc(100vw-44px))] flex-col overflow-hidden rounded-[30px] border border-white/80 bg-white/95 p-5 shadow-[0_28px_80px_rgba(47,28,8,0.24)] backdrop-blur"
                onClick={(event) => event.stopPropagation()}
                style={{
                  animation:
                    'mainAvatarModalIn 260ms cubic-bezier(0.22, 1, 0.36, 1) both',
                }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className={`text-xs font-black ${theme.primary}`}>
                      {status === 'active' ? 'Active Avatar' : 'Memory Avatar'}
                    </p>
                    <h3 className="mt-1 truncate text-2xl font-black text-stone-900">
                      {pet.name || '奶糖'}的头像
                    </h3>
                  </div>
                  <button
                    aria-label="关闭头像查看窗口"
                    className={`flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-white/80 text-lg font-black text-stone-500 shadow-sm transition duration-200 ease-out hover:-translate-y-0.5 hover:scale-105 hover:shadow-md active:scale-95 ${
                      status === 'active'
                        ? 'hover:bg-orange-50 hover:text-orange-600'
                        : 'hover:bg-purple-50 hover:text-purple-600'
                    }`}
                    onClick={closeAvatarModal}
                    type="button"
                  >
                    ×
                  </button>
                </div>

                <div className="mt-5 flex h-[280px] w-full items-center justify-center rounded-[24px] bg-stone-50/80 shadow-inner">
                  <img
                    alt={pet.name || '宠物头像'}
                    className={`h-56 w-56 rounded-full border-4 border-white bg-white/70 shadow-[0_18px_44px_rgba(87,66,40,0.16)] ${
                      hasAvatar ? 'object-cover' : 'object-contain p-10'
                    }`}
                    onError={() => setAvatarLoadError(true)}
                    src={avatarSrc}
                  />
                </div>

                <div className="mt-5 flex flex-col items-center">
                  <button
                    className={`h-11 min-w-[160px] rounded-full bg-gradient-to-r px-8 text-sm font-black text-white transition duration-200 ease-out hover:-translate-y-0.5 active:scale-[0.97] ${avatarButtonClass}`}
                    disabled={isAvatarProcessing}
                    onClick={() => avatarInputRef.current?.click()}
                    type="button"
                  >
                    {isAvatarProcessing ? '处理中...' : '切换头像'}
                  </button>
                  <p
                    aria-live="polite"
                    className={`mt-3 min-h-[18px] text-center text-xs font-black ${
                      avatarError ? 'text-rose-400' : 'text-stone-400'
                    }`}
                  >
                    {avatarError || '支持 JPG、PNG、WEBP，单张不超过 10MB'}
                  </p>
                </div>
              </section>
            </div>,
            document.body,
          )
        : null}
    </MainPetContext.Provider>
  )
}

export default MainLayout
