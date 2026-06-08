import type { ReactNode } from 'react'

type LoginAuthLayoutProps = {
  children: ReactNode
}

export const authCardBaseClass =
  'relative z-20 h-[clamp(560px,72dvh,640px)] max-h-[calc(100dvh-48px)] w-[clamp(360px,28vw,500px)] overflow-hidden rounded-[32px] border border-white/85 bg-white/[0.88] shadow-[0_24px_64px_rgba(178,103,38,0.18)] backdrop-blur-md'

const features = [
  {
    icon: '相',
    title: '照片与回忆',
    description: '珍藏每个美好瞬间',
    tone: 'from-orange-500 to-amber-300',
  },
  {
    icon: '时',
    title: '成长时间线',
    description: '记录成长的每一步',
    tone: 'from-amber-400 to-yellow-300',
  },
  {
    icon: '记',
    title: '日记与心情',
    description: '写下爱的点点滴滴',
    tone: 'from-rose-400 to-orange-300',
  },
  {
    icon: 'AI',
    title: 'AI智能回顾',
    description: '智能生成回忆相册',
    tone: 'from-lime-400 to-emerald-300',
  },
]

const featureIconSrcs = [
  '/images/auth/login-page/photo_memory_icon.png',
  '/images/auth/login-page/growth_timeline_icon.png',
  '/images/auth/login-page/diary_mood_icon.png',
  '/images/auth/login-page/ai_review_icon.png',
]

const LoginAuthLayout = ({ children }: LoginAuthLayoutProps) => {
  return (
    <section className="relative h-[100dvh] w-full overflow-hidden text-stone-950">
      <img
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover object-center"
        src="/images/auth/login-page/login-background.png"
      />

      <img
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[clamp(28px,4vh,48px)] left-[clamp(28px,3.5vw,64px)] z-[1] w-[clamp(155px,14vw,245px)] select-none"
        src="/images/auth/login-page/login-e1.png"
      />
      <img
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[clamp(43px,4vh,63px)] left-[calc(clamp(57%,59.8vw,61%)_-_30px)] z-[1] w-[clamp(168px,14.4vw,264px)] -translate-x-1/2 select-none"
        src="/images/auth/login-page/login-e2.png"
      />

      <div className="relative z-10 flex h-full w-full">
        <div className="relative hidden h-full w-[60%] lg:block">
          <header className="absolute left-[clamp(28px,3.5vw,64px)] top-[clamp(24px,4vh,52px)] z-20 flex items-center gap-3">
            <img
              alt="AI宠物记忆空间标志"
              className="pointer-events-none h-[clamp(42px,3vw,48px)] w-[clamp(42px,3vw,48px)] select-none object-contain"
              src="/images/auth/login-page/pet_logo.png"
            />
            <h1 className="text-[clamp(20px,1.8vw,28px)] font-black">
              AI宠物记忆空间
            </h1>
          </header>

          <ul className="absolute left-[clamp(34px,4.7vw,88px)] top-[49%] z-20 flex w-[clamp(230px,18vw,280px)] -translate-y-1/2 flex-col gap-[clamp(12px,2vh,22px)]">
            {features.map((feature, index) => (
              <li className="flex items-center gap-3" key={feature.title}>
                    <span className="flex h-[clamp(41px,3.9vw,49px)] w-[clamp(41px,3.9vw,49px)] shrink-0 items-center justify-center">
                      <img
                        alt={feature.title}
                        className="pointer-events-none h-[clamp(41px,3.9vw,49px)] w-[clamp(41px,3.9vw,49px)] select-none object-contain"
                        src={featureIconSrcs[index]}
                      />
                </span>
                <span>
                  <span className="block text-[clamp(12px,0.92vw,14px)] font-black text-stone-900">
                    {feature.title}
                  </span>
                  <span className="mt-0.5 block text-[clamp(10px,0.76vw,12px)] font-semibold text-stone-600">
                    {feature.description}
                  </span>
                </span>
              </li>
            ))}
          </ul>

          <div className="absolute left-[calc(67%_-_70px)] top-[51%] z-10 w-[clamp(610px,52vw,940px)] -translate-x-1/2 -translate-y-1/2">
            <img
              alt=""
              aria-hidden="true"
              className="pointer-events-none h-auto max-h-[min(82vh,820px)] w-full select-none object-contain drop-shadow-[0_24px_46px_rgba(151,79,29,0.18)]"
              src="/images/auth/login-page/login-e3.png"
            />
          </div>
        </div>

        <div className="flex h-full w-full items-center justify-center px-[clamp(20px,4vw,72px)] py-[clamp(16px,3vh,32px)] lg:w-[40%]">
          {children}
        </div>
      </div>
    </section>
  )
}

export default LoginAuthLayout
