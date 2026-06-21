import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { mockPet } from '../data/mockData'
import type { Pet, PetStatus } from '../types'
import {
  getPetStatus,
  getStorageItem,
  setPetStatus as persistPetStatus,
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

const mainNavItems = [
  { path: '/home', label: '首页', icon: '⌂' },
  { path: '/timeline', label: '时间线', icon: '◌' },
  { path: '/album', label: '相册', icon: '▧' },
  { path: '/diary', label: '日记', icon: '✎' },
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
  const [pet] = useState(() => getStorageItem<Pet>(STORAGE_KEYS.pet, mockPet))
  const [status, setStatus] = useState<PetStatus>(() =>
    getPetStatus(pet.status),
  )
  const theme = mainThemes[status]
  const ageText = useMemo(() => getAgeText(pet.birthday), [pet.birthday])
  const avatarFallback =
    status === 'active'
      ? '/images/auth/create-pet-page/active_upload_avatar_icon.png'
      : '/images/auth/create-pet-page/memorial_upload_avatar_icon.png'

  const handleStatusChange = (nextStatus: PetStatus) => {
    setStatus(nextStatus)
    persistPetStatus(nextStatus)
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
                <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-white/75 bg-white/70 shadow-[0_14px_34px_rgba(116,72,28,0.16)]">
                  <img
                    alt={pet.name || '奶糖'}
                    className={`h-full w-full ${
                      pet.avatar ? 'object-cover' : 'object-contain p-5'
                    }`}
                    src={pet.avatar || avatarFallback}
                  />
                </div>

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
            className="relative -mt-px grid h-12 grid-cols-5 items-center border-b border-t-0 border-stone-100 bg-white/82 px-8 pt-0"
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute bottom-1.5 z-0 transition-transform duration-300 ease-out"
              style={{
                left: '32px',
                transform: `translateX(${activeNavIndex * 100}%)`,
                width: 'calc((100% - 64px) / 5)',
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
    </MainPetContext.Provider>
  )
}

export default MainLayout
