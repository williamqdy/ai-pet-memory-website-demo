import { useState } from 'react'
import type { FormEvent } from 'react'
import LoginAuthLayout, { authCardBaseClass } from '../components/LoginAuthLayout'
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
    <LoginAuthLayout>
      <form
        className={`${authCardBaseClass} px-[clamp(24px,2.6vw,38px)] py-[clamp(16px,2.1vh,24px)]`}
        onSubmit={handleSubmit}
      >
        <div className="mx-auto flex h-[clamp(50px,4.3vw,62px)] w-[clamp(50px,4.3vw,62px)] items-center justify-center">
          <img
            alt="AI宠物记忆空间标志"
            className="pointer-events-none h-[clamp(46px,3.9vw,58px)] w-[clamp(46px,3.9vw,58px)] select-none object-contain"
            src="/images/auth/login-page/pet_logo.png"
          />
        </div>

        <div className="mt-2 text-center">
          <div className="flex items-center justify-center gap-4">
            <span className="h-3.5 w-3.5 rotate-45 rounded-[4px] bg-orange-300" />
            <h2 className="text-[clamp(24px,2vw,28px)] font-black text-stone-950">
              欢迎回来
            </h2>
            <span className="h-3.5 w-3.5 rotate-45 rounded-[4px] bg-orange-300" />
          </div>
          <p className="mt-1 text-sm font-semibold text-stone-700">
            登录你的宠物记忆空间
          </p>
        </div>

        <div className="mt-4 space-y-2.5">
          <label className="block">
            <span className="text-[13px] font-black leading-4 text-stone-900">用户名</span>
            <input
              className="mt-1.5 h-[44px] w-full rounded-2xl border border-stone-200/90 bg-white/70 px-5 text-sm font-medium outline-none transition placeholder:text-stone-400 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
              onChange={(event) => setUsername(event.target.value)}
              placeholder="请输入用户名"
              type="text"
              value={username}
            />
          </label>

          <label className="block">
            <span className="text-[13px] font-black leading-4 text-stone-900">密码</span>
            <span className="mt-1.5 flex h-[44px] items-center rounded-2xl border border-stone-200/90 bg-white/70 px-5 transition focus-within:border-orange-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-orange-100">
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

        <div className="mt-2 flex justify-end">
          <button className="text-xs font-bold text-orange-500" type="button">
            忘记密码？
          </button>
        </div>

        <p
          aria-live="polite"
          className={`mt-2 flex h-6 items-center rounded-xl bg-orange-50 px-3 text-xs font-semibold text-orange-700 ${
            error ? 'visible' : 'invisible'
          }`}
        >
          {error || '请输入用户名和密码'}
        </p>

        <button
          className="mt-2 h-[48px] w-full rounded-2xl bg-gradient-to-r from-orange-600 to-orange-500 text-lg font-black text-white shadow-[0_13px_26px_rgba(234,88,12,0.26)] transition hover:from-orange-500 hover:to-orange-400"
          type="submit"
        >
          登录
        </button>

        <div className="my-2.5 flex items-center gap-4 text-xs font-medium text-stone-400">
          <span className="h-px flex-1 bg-stone-200" />
          <span>或</span>
          <span className="h-px flex-1 bg-stone-200" />
        </div>

        <a
          className="flex h-[44px] w-full items-center justify-center rounded-2xl border border-orange-500 bg-white/40 text-sm font-black text-orange-500 transition hover:bg-orange-50"
          href="/register"
        >
          立即注册
        </a>

        <p className="mt-3 text-center text-xs leading-5 text-stone-500">
          登录即代表你同意我们的《用户协议》与《隐私政策》
        </p>
      </form>
    </LoginAuthLayout>
  )
}

export default Login
