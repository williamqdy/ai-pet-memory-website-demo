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
        className="w-full max-w-[430px] rounded-[2rem] bg-white/90 px-8 py-9 shadow-[0_18px_48px_rgba(190,104,42,0.18)] backdrop-blur"
        onSubmit={handleSubmit}
      >
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-4 border-orange-500 text-lg font-black text-orange-500">
          AI
        </div>

        <div className="mt-6 text-center">
          <p className="text-3xl font-black text-stone-950">欢迎回来</p>
          <p className="mt-3 text-base font-medium text-stone-700">
            登录你的宠物记忆空间
          </p>
        </div>

        <div className="mt-8 space-y-5">
          <label className="block">
            <span className="text-sm font-bold text-stone-900">用户名</span>
            <input
              className="mt-2 h-12 w-full rounded-2xl border border-stone-200 bg-white/80 px-4 text-sm outline-none transition placeholder:text-stone-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
              onChange={(event) => setUsername(event.target.value)}
              placeholder="请输入用户名"
              type="text"
              value={username}
            />
          </label>

          <label className="block">
            <span className="text-sm font-bold text-stone-900">密码</span>
            <span className="mt-2 flex h-12 items-center rounded-2xl border border-stone-200 bg-white/80 px-4 transition focus-within:border-orange-400 focus-within:ring-4 focus-within:ring-orange-100">
              <input
                className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-stone-400"
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
          <button
            className="text-sm font-medium text-orange-500"
            type="button"
          >
            忘记密码?
          </button>
        </div>

        {error ? (
          <p className="mt-4 rounded-2xl bg-orange-50 px-4 py-3 text-sm font-medium text-orange-700">
            {error}
          </p>
        ) : null}

        <button
          className="mt-6 h-14 w-full rounded-2xl bg-gradient-to-r from-orange-600 to-orange-500 text-lg font-bold text-white shadow-[0_12px_24px_rgba(234,88,12,0.24)] transition hover:from-orange-500 hover:to-orange-400"
          type="submit"
        >
          登录
        </button>

        <div className="my-5 flex items-center gap-4 text-sm text-stone-400">
          <span className="h-px flex-1 bg-stone-200" />
          <span>或</span>
          <span className="h-px flex-1 bg-stone-200" />
        </div>

        <a
          className="flex h-12 w-full items-center justify-center rounded-2xl border border-orange-500 text-base font-bold text-orange-500 transition hover:bg-orange-50"
          href="/register"
        >
          立即注册
        </a>

        <p className="mt-7 text-center text-xs leading-6 text-stone-500">
          登录即代表你同意我们的《用户协议》与《隐私政策》
        </p>
      </form>
    </AuthLayout>
  )
}

export default Login
