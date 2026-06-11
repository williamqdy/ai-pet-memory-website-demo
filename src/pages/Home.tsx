import { useMainPetLayout } from '../components/MainLayout'

type HomeCardProps = {
  children?: React.ReactNode
  className?: string
  contentClassName?: string
  icon?: string
  iconImageClassName?: string
  iconSrc?: string
  title: string
}

const HomeCard = ({
  children,
  className = '',
  contentClassName = '',
  icon,
  iconImageClassName = 'h-11 w-11',
  iconSrc,
  title,
}: HomeCardProps) => (
  <article
    className={`rounded-[20px] border border-white/70 bg-white/82 px-4 py-3.5 shadow-[0_14px_34px_rgba(116,72,28,0.10)] ${className}`}
  >
    <div className="flex items-center gap-2.5">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-lg shadow-inner">
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
    {children ? (
      <div className={`mt-2.5 ${contentClassName}`}>{children}</div>
    ) : null}
  </article>
)

const PhotoGrid = () => (
  <div className="grid grid-cols-2 gap-1.5">
    {['#f7caa2', '#d8c6ff', '#ffd98e', '#f2b7d2'].map((color, index) => (
      <div
        className="h-12 rounded-xl border border-white/70 shadow-inner"
        key={color}
        style={{
          background: `linear-gradient(135deg, ${color}, rgba(255,255,255,0.85))`,
        }}
      >
        <span className="sr-only">珍贵瞬间 {index + 1}</span>
      </div>
    ))}
  </div>
)

const Home = () => {
  const { ageText, pet, status, theme } = useMainPetLayout()
  const isMemorial = status === 'memorial'
  const petImage =
    pet.avatar ||
    (isMemorial
      ? '/images/auth/create-pet-page/memorial_select_partner_icon.png'
      : '/images/auth/create-pet-page/active_select_partner_icon.png')

  return (
    <div
      className={`relative h-full overflow-hidden px-7 py-4 ${
        isMemorial ? 'bg-[#fbf8ff]' : 'bg-[#fffaf1]'
      }`}
    >
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-white/70 to-transparent" />
      <div className="relative z-10 grid h-full grid-cols-[minmax(190px,0.88fr)_minmax(260px,1.24fr)_minmax(190px,0.88fr)] items-center gap-5">
        <div className="flex h-[330px] flex-col gap-3">
          <HomeCard
            className={isMemorial ? 'flex flex-1 flex-col' : 'h-[112px]'}
            contentClassName={
              isMemorial ? 'flex flex-1 flex-col justify-center pb-6' : ''
            }
            icon={isMemorial ? '✦' : '☀'}
            iconImageClassName="h-[65px] w-[65px] max-h-none max-w-none"
            iconSrc={
              isMemorial ? undefined : '/images/auth/home-page/mood_icon.png'
            }
            title="今日心情"
          >
            <p className={`text-[22px] leading-tight font-black ${theme.primary}`}>
              {isMemorial ? '安详' : '开心'}
            </p>
          </HomeCard>

          {!isMemorial ? (
            <>
              <HomeCard
                className="flex-1"
                iconImageClassName="h-[65px] w-[65px] max-h-none max-w-none translate-x-[2px]"
                iconSrc="/images/auth/home-page/food_icon.png"
                title="今日饮食"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[20px] leading-tight font-black text-stone-800">已记录</p>
                  <span className="rounded-full bg-orange-50 px-2.5 py-1 text-xs font-black text-orange-500">
                    小鱼干
                  </span>
                </div>
              </HomeCard>

              <HomeCard
                className="flex-1"
                iconImageClassName="h-[65px] w-[65px] max-h-none max-w-none translate-x-[2px]"
                iconSrc="/images/auth/home-page/activity_icon.png"
                title="今日活动"
              >
                <p className="text-[20px] leading-tight font-black text-stone-800">
                  散步 30 分钟
                </p>
                <div className="mt-3 h-2 rounded-full bg-orange-100">
                  <div className="h-full w-2/3 rounded-full bg-orange-400" />
                </div>
              </HomeCard>
            </>
          ) : null}
        </div>

        <div className="flex h-full flex-col items-center justify-center">
          <div
            className={`relative flex h-[min(30vh,270px)] w-[min(27vw,330px)] items-center justify-center rounded-[34px] ${
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

          <div className="mt-4 flex items-center gap-2.5 rounded-full bg-white/86 px-[18px] py-2.5 shadow-[0_12px_28px_rgba(116,72,28,0.12)]">
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
            iconSrc={
              isMemorial
                ? undefined
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
            <HomeCard className="flex-1" icon="▧" title="珍贵瞬间">
              <PhotoGrid />
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
                  <div className="h-12 w-14 rounded-xl bg-gradient-to-br from-orange-200 to-white shadow-inner" />
                  <div>
                    <p className="text-[13px] font-black leading-5 text-stone-800">
                      今天 10:30
                    </p>
                    <p className="mt-1 text-xs font-semibold leading-4 text-stone-500">
                      新增一张午睡照片
                    </p>
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
