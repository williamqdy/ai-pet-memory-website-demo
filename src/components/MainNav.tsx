type MainNavProps = {
  currentPath: string
}

const mainNavItems = [
  { path: '/home', label: '首页' },
  { path: '/timeline', label: '时间线' },
  { path: '/album', label: '相册' },
  { path: '/growth-records', label: '成长记录' },
]

const MainNav = ({ currentPath }: MainNavProps) => {
  return (
    <nav
      aria-label="Main app navigation"
      className="flex flex-wrap gap-2 border-y border-orange-100 py-4"
    >
      {mainNavItems.map((item) => {
        const isActive = item.path === currentPath

        return (
          <a
            aria-current={isActive ? 'page' : undefined}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              isActive
                ? 'bg-orange-500 text-white'
                : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
            }`}
            href={item.path}
            key={item.path}
          >
            {item.label}
          </a>
        )
      })}
    </nav>
  )
}

export default MainNav
