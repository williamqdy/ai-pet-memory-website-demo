import type { ReactNode } from 'react'
import MainNav from './MainNav'

type MainLayoutProps = {
  children: ReactNode
  currentPath: string
}

const MainLayout = ({ children, currentPath }: MainLayoutProps) => {
  return (
    <main className="min-h-screen bg-orange-50 px-6 py-8 text-stone-800">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 rounded-3xl bg-white/80 p-6 shadow-sm">
        <header className="space-y-2">
          <p className="text-sm font-medium text-orange-500">AI宠物记忆空间</p>
          <h1 className="text-2xl font-bold">MainLayout Placeholder</h1>
          <p className="max-w-3xl text-sm leading-6 text-stone-600">
            Shared main app shell placeholder. Detailed header, state switch,
            and page UI will be implemented in later phases.
          </p>
        </header>

        <MainNav currentPath={currentPath} />

        {children}
      </div>
    </main>
  )
}

export default MainLayout
