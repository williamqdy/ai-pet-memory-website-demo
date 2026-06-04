import { useState } from 'react'
import type { FormEvent } from 'react'
import AuthLayout from '../components/AuthLayout'
import { navigateTo } from '../utils/navigation'
import { getStorageItem, STORAGE_KEYS } from '../utils/storage'
import type { Pet } from '../types'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!username.trim() || !password.trim()) {
      setError('请输入用户名和密码')
      return
    }

    const existingPet = getStorageItem<Pet | null>(STORAGE_KEYS.pet, null)

    navigateTo(existingPet ? '/home' : '/create-pet')
  }

  return (
    <AuthLayout>
      <form
        className="relative z-10 w-full max-w-[430px] rounded-[34px] border border-white/80 bg-white/[0.86] px-9 py-8 shadow-[0_26px_70px_rgba(178,103,38,0.18)] backdrop-blur-md"
        onSubmit={handleSubmit}
      >
        <div className="mx-auto flex h-[76px] w-[76px] items-center justify-center rounded-full border-[3px] border-orange-500 bg-white text-orange-500 shadow-[0_10px_24px_rgba(234,88,12,0.12)]">
          <div className="relative h-11 w-11 overflow-hidden rounded-full">
            <div className="absolute inset-y-0 left-0 w-1/2 bg-orange-500" />
            <div className="absolute inset-y-0 right-0 w-1/2 bg-orange-100" />
            <div className="absolute left-2 top-4 h-4 w-4 rounded-full bg-white" />
            <div className="absolute right-2 top-4 h-4 w-4 rounded-full bg-orange-500" />
          </div>
        </div>

        <div className="mt-5 text-center">
          <div className="flex items-center justify-center gap-4">
            <span className="h-4 w-4 rotate-45 rounded-[4px] bg-orange-300" />
            <h2 className="text-3xl font-black text-stone-950">欢迎回来</h2>
            <span className="h-4 w-4 rotate-45 rounded-[4px] bg-orange-300" />
          </div>
          <p className="mt-3 text-base font-semibold text-stone-700">
            登录你的宠物记忆空间
          </p>
        </div>

        <div className="mt-7 space-y-4">
          <label className="block">
            <span className="text-sm font-black text-stone-900">用户名</span>
            <input
              className="mt-2 h-[50px] w-full rounded-2xl border border-stone-200/90 bg-white/64 px-5 text-sm font-medium outline-none transition placeholder:text-stone-400 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
              onChange={(event) => setUsername(event.target.value)}
              placeholder="请输入用户名"
              type="text"
              value={username}
            />
          </label>

          <label className="block">
            <span className="text-sm font-black text-stone-900">密码</span>
            <span className="mt-2 flex h-[50px] items-center rounded-2xl border border-stone-200/90 bg-white/64 px-5 transition focus-within:border-orange-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-orange-100">
              <input
                className="min-w-0 flex-1 bg-transparent text-sm font-medium outline-none placeholder:text-stone-400"
                onChange={(event) => setPassword(event.target.value)}
                placeholder="请输入密码"
                type={showPassword ? 'text' : 'password'}
                value={password}
              />
              <button
                className="ml-3 text-xs font-bold text-stone-500"
                onClick={() => setShowPassword((value) => !value)}
                type="button"
              >
                {showPassword ? '隐藏' : '显示'}
              </button>
            </span>
          </label>
        </div>

        <div className="mt-3 flex justify-end">
          <button className="text-sm font-bold text-orange-500" type="button">
            忘记密码?
          </button>
        </div>

        {error ? (
          <p className="mt-4 rounded-2xl bg-orange-50 px-4 py-3 text-sm font-semibold text-orange-700">
            {error}
          </p>
        ) : null}

        <button
          className="mt-5 h-[54px] w-full rounded-2xl bg-gradient-to-r from-orange-600 to-orange-500 text-xl font-black text-white shadow-[0_13px_26px_rgba(234,88,12,0.26)] transition hover:from-orange-500 hover:to-orange-400"
          type="submit"
        >
          登录
        </button>

        <div className="my-4 flex items-center gap-4 text-sm font-medium text-stone-400">
          <span className="h-px flex-1 bg-stone-200" />
          <span>或</span>
          <span className="h-px flex-1 bg-stone-200" />
        </div>

        <a
          className="flex h-[50px] w-full items-center justify-center rounded-2xl border border-orange-500 bg-white/35 text-base font-black text-orange-500 transition hover:bg-orange-50"
          href="/register"
        >
          立即注册
        </a>

        <p className="mt-6 text-center text-xs leading-6 text-stone-500">
          登录即代表你同意我们的《用户协议》与《隐私政策》
        </p>
      </form>
    </AuthLayout>
  )
}

export default Login
