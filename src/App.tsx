import { useEffect, useState } from 'react'
import type { ComponentType } from 'react'
import MainLayout from './components/MainLayout'
import Album from './pages/Album'
import CreatePet from './pages/CreatePet'
import Diary from './pages/Diary'
import GrowthRecords from './pages/GrowthRecords'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Timeline from './pages/Timeline'

type RouteConfig = {
  path: string
  Component: ComponentType
  layout: 'standalone' | 'main'
}

const routes: RouteConfig[] = [
  { path: '/login', Component: Login, layout: 'standalone' },
  { path: '/register', Component: Register, layout: 'standalone' },
  { path: '/create-pet', Component: CreatePet, layout: 'standalone' },
  { path: '/home', Component: Home, layout: 'main' },
  { path: '/timeline', Component: Timeline, layout: 'main' },
  { path: '/album', Component: Album, layout: 'main' },
  { path: '/diary', Component: Diary, layout: 'main' },
  { path: '/growth-records', Component: GrowthRecords, layout: 'main' },
]

const routePaths = routes.map((route) => route.path)

const normalizePath = (pathname: string) => {
  const trimmedPath = pathname.replace(/\/+$/, '')

  return trimmedPath === '' ? '/login' : trimmedPath
}

function App() {
  const [currentPath, setCurrentPath] = useState(() =>
    normalizePath(window.location.pathname),
  )

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(normalizePath(window.location.pathname))
    }

    window.addEventListener('popstate', handlePopState)

    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [])

  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return
      }

      const target = event.target as Element | null
      const anchor = target?.closest('a[href]')

      if (!(anchor instanceof HTMLAnchorElement)) {
        return
      }

      if (anchor.target || anchor.origin !== window.location.origin) {
        return
      }

      const nextPath = normalizePath(anchor.pathname)

      if (!routePaths.includes(nextPath)) {
        return
      }

      event.preventDefault()
      window.history.pushState(null, '', nextPath)
      setCurrentPath(nextPath)
    }

    document.addEventListener('click', handleDocumentClick)

    return () => {
      document.removeEventListener('click', handleDocumentClick)
    }
  }, [])

  const currentRoute =
    routes.find((route) => route.path === currentPath) ?? routes[0]
  const CurrentPage = currentRoute.Component

  if (currentRoute.layout === 'main') {
    return (
      <MainLayout currentPath={currentRoute.path}>
        <CurrentPage />
      </MainLayout>
    )
  }

  return (
    <main className="min-h-screen bg-orange-50 text-stone-800">
      <CurrentPage />
    </main>
  )
}

export default App
