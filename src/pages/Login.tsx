const Login = () => {
  return (
    <section className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-3xl items-center">
      <div className="w-full rounded-3xl bg-white/80 p-8 shadow-sm">
        <p className="text-sm font-medium text-orange-500">Placeholder page</p>
        <h2 className="mt-2 text-2xl font-semibold">Login</h2>
        <p className="mt-3 text-sm text-stone-600">
          Login route placeholder for AI宠物记忆空间. Detailed UI starts in a
          later phase.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            className="rounded-full bg-orange-500 px-4 py-2 text-sm font-medium text-white"
            href="/create-pet"
          >
            进入创建宠物
          </a>
          <a
            className="rounded-full bg-orange-100 px-4 py-2 text-sm font-medium text-orange-700"
            href="/register"
          >
            去注册
          </a>
        </div>
      </div>
    </section>
  )
}

export default Login
