import { useEffect, useState } from 'react'
import type { ComponentType, MouseEvent } from 'react'
import Album from './pages/Album'
import CreatePet from './pages/CreatePet'
import Diary from './pages/Diary'
import GrowthRecords from './pages/GrowthRecords'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Timeline from './pages/Timeline'
import { initializeDemoStorage } from './utils/storage'

type RouteConfig = {
  path: string
  label: string
  Component: ComponentType
}

const appRoutes: RouteConfig[] = [
  { path: '/login', label: 'Login', Component: Login },
  { path: '/register', label: 'Register', Component: Register },
  { path: '/create-pet', label: 'CreatePet', Component: CreatePet },
  { path: '/home', label: 'Home', Component: Home },
  { path: '/timeline', label: 'Timeline', Component: Timeline },
  { path: '/album', label: 'Album', Component: Album },
  { path: '/diary', label: 'Diary', Component: Diary },
  { path: '/growth-records', label: 'GrowthRecords', Component: GrowthRecords },
]

const normalizePath = (pathname: string) => {
  const trimmedPath = pathname.replace(/\/+$/, '')

  return trimmedPath === '' ? '/login' : trimmedPath
}

function App() {
  const [currentPath, setCurrentPath] = useState(() =>
    normalizePath(window.location.pathname),
  )

  useEffect(() => {
    initializeDemoStorage()

    const handlePopState = () => {
      setCurrentPath(normalizePath(window.location.pathname))
    }

    window.addEventListener('popstate', handlePopState)

    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [])

  const currentRoute =
    appRoutes.find((route) => route.path === currentPath) ?? appRoutes[0]
  const CurrentPage = currentRoute.Component

  const handleRouteClick = (
    event: MouseEvent<HTMLAnchorElement>,
    path: string,
  ) => {
    event.preventDefault()

    if (path !== currentPath) {
      window.history.pushState(null, '', path)
      setCurrentPath(path)
    }
  }

  return (
    <main className="min-h-screen bg-orange-50 px-6 py-8 text-stone-800">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 rounded-3xl bg-white/80 p-6 shadow-sm">
        <header className="space-y-2">
          <p className="text-sm font-medium text-orange-500">AI宠物记忆空间</p>
          <h1 className="text-3xl font-bold">Phase 1 Basic Project Structure</h1>
          <p className="max-w-3xl text-sm leading-6 text-stone-600">
            Placeholder routes, shared data types, mock data, and localStorage
            helpers are ready for later UI phases.
          </p>
        </header>

        <nav
          aria-label="Phase 1 route preview"
          className="flex flex-wrap gap-2 border-y border-orange-100 py-4"
        >
          {appRoutes.map((route) => {
            const isActive = route.path === currentRoute.path

            return (
              <a
                aria-current={isActive ? 'page' : undefined}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? 'bg-orange-500 text-white'
                    : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                }`}
                href={route.path}
                key={route.path}
                onClick={(event) => handleRouteClick(event, route.path)}
              >
                {route.label}
              </a>
            )
          })}
        </nav>

        <CurrentPage />
      </div>
    </main>
  )
}

export default App
