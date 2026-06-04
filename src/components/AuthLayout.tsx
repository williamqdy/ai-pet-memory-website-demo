import type { ReactNode } from 'react'

type AuthLayoutProps = {
  children: ReactNode
}

const features = [
  {
    icon: '照',
    title: '照片与回忆',
    description: '珍藏每个美好瞬间',
    tone: 'from-orange-400 to-amber-300',
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

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <section className="relative mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl overflow-hidden rounded-[2rem] bg-[#fff6e9] shadow-sm lg:grid-cols-[1.35fr_0.95fr]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(255,188,91,0.22),transparent_28%),radial-gradient(circle_at_72%_26%,rgba(172,176,232,0.16),transparent_24%),radial-gradient(circle_at_86%_78%,rgba(255,145,91,0.14),transparent_22%)]" />
      <div className="pointer-events-none absolute left-8 top-28 h-5 w-5 rounded-full border-4 border-orange-200 opacity-70" />
      <div className="pointer-events-none absolute bottom-12 left-24 h-4 w-4 rounded-full bg-orange-200 opacity-80" />
      <div className="pointer-events-none absolute right-12 top-12 h-7 w-7 rounded-full bg-orange-100 opacity-90" />

      <div className="relative flex min-h-[680px] flex-col justify-between px-8 py-8 sm:px-12 lg:px-14">
        <header className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-amber-300 text-sm font-black text-white shadow-sm">
            AI
          </div>
          <h1 className="text-2xl font-black tracking-normal text-stone-950">
            AI宠物记忆空间
          </h1>
        </header>

        <div className="grid items-center gap-8 py-10 md:grid-cols-[220px_1fr] lg:grid-cols-[230px_1fr]">
          <ul className="z-10 flex flex-col gap-7">
            {features.map((feature) => (
              <li className="flex items-center gap-4" key={feature.title}>
                <span
                  className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.tone} text-base font-black text-white shadow-sm`}
                >
                  {feature.icon}
                </span>
                <span>
                  <span className="block text-base font-bold text-stone-900">
                    {feature.title}
                  </span>
                  <span className="mt-1 block text-sm font-medium text-stone-600">
                    {feature.description}
                  </span>
                </span>
              </li>
            ))}
          </ul>

          <div className="relative mx-auto flex h-[420px] w-full max-w-[520px] items-end justify-center">
            <div className="absolute left-1/2 top-6 h-12 w-52 -translate-x-1/2 rounded-[999px] border-4 border-amber-300 opacity-90 shadow-[0_0_18px_rgba(251,191,36,0.45)]" />
            <div className="absolute bottom-3 h-8 w-[88%] rounded-full bg-orange-200/40 blur-xl" />
            <div className="relative h-[360px] w-[320px]">
              <div className="absolute left-1/2 top-0 h-24 w-24 -translate-x-[95px] rotate-[-18deg] rounded-[12px_80px_20px_80px] bg-orange-300 shadow-inner" />
              <div className="absolute left-1/2 top-0 h-24 w-24 translate-x-[10px] rotate-[18deg] rounded-[80px_12px_80px_20px] bg-stone-100 shadow-inner" />
              <div className="absolute bottom-0 left-1/2 h-[300px] w-[300px] -translate-x-1/2 overflow-hidden rounded-[46%_46%_42%_42%] bg-stone-100 shadow-xl">
                <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-b from-orange-300 to-orange-100" />
                <div className="absolute inset-y-0 left-1/2 w-px bg-white/90" />
                <div className="absolute left-16 top-[112px] h-16 w-16 rounded-full bg-white/45" />
                <div className="absolute right-16 top-[112px] h-16 w-16 rounded-full bg-orange-100/60" />
                <div className="absolute left-[72px] top-[120px] h-16 w-16 rounded-full bg-stone-950">
                  <div className="absolute right-3 top-3 h-5 w-5 rounded-full bg-white" />
                </div>
                <div className="absolute right-[72px] top-[120px] h-16 w-16 rounded-full bg-stone-950">
                  <div className="absolute right-3 top-3 h-5 w-5 rounded-full bg-white" />
                </div>
                <div className="absolute left-1/2 top-[183px] h-5 w-7 -translate-x-1/2 rounded-full bg-rose-300" />
                <div className="absolute left-[132px] top-[212px] h-8 w-8 rounded-b-full border-b-4 border-r-4 border-stone-700" />
                <div className="absolute right-[132px] top-[212px] h-8 w-8 rounded-b-full border-b-4 border-l-4 border-stone-700" />
                <div className="absolute bottom-[82px] left-1/2 h-8 w-36 -translate-x-1/2 rounded-full bg-gradient-to-r from-orange-400 to-sky-300" />
              </div>
            </div>
          </div>
        </div>

        <div className="h-16" />
      </div>

      <div className="relative flex items-center justify-center border-t border-orange-100 bg-orange-50/40 px-6 py-8 lg:border-l lg:border-t-0">
        {children}
      </div>
    </section>
  )
}

export default AuthLayout
