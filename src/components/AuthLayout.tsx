import type { ReactNode } from 'react'

type AuthLayoutProps = {
  children: ReactNode
}

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

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#fff3e6] text-stone-950 lg:grid lg:grid-cols-[60fr_40fr]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_16%,rgba(255,198,111,0.24),transparent_24%),radial-gradient(circle_at_55%_50%,rgba(255,255,255,0.58),transparent_32%),radial-gradient(circle_at_83%_12%,rgba(255,226,184,0.45),transparent_22%),linear-gradient(90deg,rgba(255,244,229,0.86),rgba(255,238,217,0.62))]" />
      <div className="pointer-events-none absolute inset-0 opacity-45 [background-image:linear-gradient(90deg,rgba(180,119,56,0.045)_1px,transparent_1px),linear-gradient(rgba(180,119,56,0.035)_1px,transparent_1px)] [background-size:52px_52px]" />

      <div className="relative hidden min-h-screen flex-col px-10 py-7 lg:flex xl:px-12">
        <header className="z-10 flex items-center gap-3">
          <div className="relative h-11 w-11 overflow-hidden rounded-2xl bg-orange-500 shadow-sm">
            <div className="absolute inset-y-0 left-0 w-1/2 bg-orange-600" />
            <div className="absolute inset-y-0 right-0 w-1/2 bg-amber-300" />
            <div className="absolute left-2.5 top-3 h-5 w-5 rounded-full bg-white" />
            <div className="absolute right-2.5 top-3 h-5 w-5 rounded-full bg-white/90" />
          </div>
          <h1 className="text-2xl font-black">AI宠物记忆空间</h1>
        </header>

        <div className="relative flex flex-1 items-center">
          <ul className="z-10 flex w-[250px] flex-col gap-6">
            {features.map((feature) => (
              <li className="flex items-center gap-4" key={feature.title}>
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/70 bg-white/[0.72] shadow-[0_10px_28px_rgba(194,109,39,0.12)] backdrop-blur">
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${feature.tone} text-sm font-black text-white`}
                  >
                    {feature.icon}
                  </span>
                </span>
                <span>
                  <span className="block text-base font-black text-stone-900">
                    {feature.title}
                  </span>
                  <span className="mt-1 block text-sm font-semibold text-stone-600">
                    {feature.description}
                  </span>
                </span>
              </li>
            ))}
          </ul>

          <div className="absolute bottom-[3vh] left-[34%] h-[min(62vh,560px)] w-[min(45vw,620px)]">
            <div className="absolute left-[37%] top-[2%] h-10 w-48 rotate-[-2deg] rounded-[999px] border-[3px] border-amber-300 opacity-90 shadow-[0_0_18px_rgba(251,191,36,0.42)]" />
            <div className="absolute bottom-3 left-[8%] h-12 w-[78%] rounded-full bg-orange-200/45 blur-xl" />

            <div className="absolute left-[18%] top-[17%] h-[24%] w-[24%] rotate-[-18deg] rounded-[18px_76px_20px_86px] bg-gradient-to-br from-orange-400 to-orange-200 shadow-[inset_0_-12px_22px_rgba(194,65,12,0.16)]" />
            <div className="absolute left-[55%] top-[18%] h-[24%] w-[24%] rotate-[18deg] rounded-[80px_18px_80px_20px] bg-gradient-to-br from-stone-100 to-blue-50 shadow-[inset_0_-12px_22px_rgba(148,163,184,0.18)]" />

            <div className="absolute bottom-[6%] left-[12%] h-[74%] w-[64%] overflow-hidden rounded-[48%_48%_42%_42%] bg-stone-100 shadow-[0_26px_70px_rgba(151,79,29,0.26)]">
              <div className="absolute inset-y-0 left-0 w-1/2 bg-[radial-gradient(circle_at_35%_24%,rgba(255,245,227,0.48),transparent_20%),linear-gradient(160deg,#fb923c,#fed7aa_58%,#fff1df)]" />
              <div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_74%_26%,rgba(218,230,255,0.62),transparent_24%),linear-gradient(160deg,#fffaf2,#eef4ff_72%,#ffffff)]" />
              <div className="absolute inset-y-0 left-1/2 w-[3px] -translate-x-1/2 bg-white/92" />

              <div className="absolute left-[20%] top-[33%] h-[19%] w-[19%] rounded-full bg-[#2b160f] shadow-[0_0_0_8px_rgba(255,244,215,0.5)]">
                <div className="absolute right-[20%] top-[18%] h-[32%] w-[32%] rounded-full bg-white" />
                <div className="absolute bottom-[20%] left-[22%] h-[15%] w-[15%] rounded-full bg-amber-400" />
              </div>
              <div className="absolute right-[20%] top-[33%] h-[19%] w-[19%] rounded-full bg-[#2b160f] shadow-[0_0_0_8px_rgba(255,244,215,0.45)]">
                <div className="absolute right-[20%] top-[18%] h-[32%] w-[32%] rounded-full bg-white" />
                <div className="absolute bottom-[20%] left-[22%] h-[15%] w-[15%] rounded-full bg-amber-400" />
              </div>

              <div className="absolute left-[20%] top-[28%] h-8 w-20 rounded-full border-t-4 border-orange-600/30" />
              <div className="absolute right-[20%] top-[29%] h-8 w-20 rounded-full border-t-4 border-slate-300/50" />
              <div className="absolute left-1/2 top-[56%] h-[6%] w-[8%] -translate-x-1/2 rounded-full bg-rose-300" />
              <div className="absolute left-[41%] top-[63%] h-[9%] w-[9%] rounded-b-full border-b-[5px] border-r-[5px] border-stone-700" />
              <div className="absolute right-[41%] top-[63%] h-[9%] w-[9%] rounded-b-full border-b-[5px] border-l-[5px] border-stone-700" />
              <div className="absolute bottom-[19%] left-1/2 h-[8%] w-[44%] -translate-x-1/2 rounded-full bg-gradient-to-r from-orange-400 via-orange-300 to-sky-300 shadow-inner" />
              <div className="absolute bottom-[16%] left-[39%] h-[9%] w-[9%] rounded-full bg-amber-300 shadow" />
              <div className="absolute bottom-[16%] right-[39%] h-[9%] w-[9%] rounded-full bg-slate-200 shadow" />
            </div>

            <div className="absolute right-[6%] top-[32%] h-20 w-20 rotate-[10deg] rounded-xl border-4 border-white bg-white/70 p-2 shadow-[0_18px_34px_rgba(154,92,34,0.16)]">
              <div className="h-full rounded-lg bg-gradient-to-br from-orange-200 to-sky-100" />
            </div>
            <div className="absolute right-[10%] top-[56%] h-20 w-20 rotate-[-12deg] rounded-xl border-4 border-white bg-white/70 p-2 shadow-[0_18px_34px_rgba(154,92,34,0.16)]">
              <div className="h-full rounded-lg bg-gradient-to-br from-amber-200 to-orange-100" />
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute bottom-6 left-8 h-24 w-24 rounded-t-full bg-gradient-to-t from-lime-200 to-transparent opacity-70" />
        <div className="pointer-events-none absolute bottom-8 left-28 h-16 w-16 rounded-full bg-orange-200/60" />
      </div>

      <div className="relative flex min-h-screen items-center justify-center border-orange-100 bg-orange-50/[0.34] px-5 py-5 lg:border-l">
        <div className="pointer-events-none absolute left-8 top-10 h-6 w-6 rounded-full bg-orange-100" />
        <div className="pointer-events-none absolute right-10 bottom-10 h-8 w-8 rounded-full border-4 border-orange-100" />
        {children}
      </div>
    </section>
  )
}

export default AuthLayout
