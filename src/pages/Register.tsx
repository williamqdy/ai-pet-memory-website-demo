import { useState } from 'react'
import type { FormEvent } from 'react'
import AuthLayout from '../components/AuthLayout'
import { navigateTo } from '../utils/navigation'
import { setStorageItem, STORAGE_KEYS } from '../utils/storage'
import type { User } from '../types'

const Register = () => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (
      !username.trim() ||
      !email.trim() ||
      !password.trim() ||
      !confirmPassword.trim()
    ) {
      setError('请完整填写注册信息')
      return
    }

    if (password !== confirmPassword) {
      setError('两次输入的密码不一致')
      return
    }

    if (!agreed) {
      setError('请先阅读并同意用户协议')
      return
    }

    const user: User = {
      id: `user-${Date.now()}`,
      username: username.trim(),
      email: email.trim(),
    }

    setStorageItem(STORAGE_KEYS.user, user)
    navigateTo('/create-pet')
  }

  return (
    <AuthLayout>
      <form
        className="relative z-10 w-full max-w-[430px] rounded-[34px] border border-white/80 bg-white/[0.86] px-9 py-6 shadow-[0_26px_70px_rgba(178,103,38,0.18)] backdrop-blur-md"
        onSubmit={handleSubmit}
      >
        <div className="mx-auto flex h-[68px] w-[68px] items-center justify-center rounded-full border-[3px] border-orange-500 bg-white text-orange-500 shadow-[0_10px_24px_rgba(234,88,12,0.12)]">
          <div className="relative h-10 w-10 overflow-hidden rounded-full">
            <div className="absolute inset-y-0 left-0 w-1/2 bg-orange-500" />
            <div className="absolute inset-y-0 right-0 w-1/2 bg-orange-100" />
            <div className="absolute left-2 top-3.5 h-4 w-4 rounded-full bg-white" />
            <div className="absolute right-2 top-3.5 h-4 w-4 rounded-full bg-orange-500" />
          </div>
        </div>

        <div className="mt-4 text-center">
          <div className="flex items-center justify-center gap-4">
            <span className="h-4 w-4 rotate-45 rounded-[4px] bg-orange-300" />
            <h2 className="text-3xl font-black text-stone-950">立即注册</h2>
            <span className="h-4 w-4 rotate-45 rounded-[4px] bg-orange-300" />
          </div>
          <p className="mt-2 text-base font-semibold text-stone-700">
            注册你的宠物记忆空间账号
          </p>
        </div>

        <div className="mt-5 space-y-3">
          <label className="block">
            <span className="text-sm font-black text-stone-900">用户名</span>
            <input
              className="mt-1.5 h-[44px] w-full rounded-2xl border border-stone-200/90 bg-white/64 px-5 text-sm font-medium outline-none transition placeholder:text-stone-400 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
              onChange={(event) => setUsername(event.target.value)}
              placeholder="请输入用户名"
              type="text"
              value={username}
            />
          </label>

          <label className="block">
            <span className="text-sm font-black text-stone-900">邮箱地址</span>
            <input
              className="mt-1.5 h-[44px] w-full rounded-2xl border border-stone-200/90 bg-white/64 px-5 text-sm font-medium outline-none transition placeholder:text-stone-400 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="请输入邮箱地址"
              type="email"
              value={email}
            />
          </label>

          <label className="block">
            <span className="text-sm font-black text-stone-900">密码</span>
            <span className="mt-1.5 flex h-[44px] items-center rounded-2xl border border-stone-200/90 bg-white/64 px-5 transition focus-within:border-orange-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-orange-100">
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

          <label className="block">
            <span className="text-sm font-black text-stone-900">确认密码</span>
            <input
              className="mt-1.5 h-[44px] w-full rounded-2xl border border-stone-200/90 bg-white/64 px-5 text-sm font-medium outline-none transition placeholder:text-stone-400 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="请再次输入密码"
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
            />
          </label>
        </div>

        <label className="mt-4 flex items-start gap-3 text-sm leading-6 text-stone-600">
          <input
            checked={agreed}
            className="mt-1 h-4 w-4 rounded border-stone-300 text-orange-500"
            onChange={(event) => setAgreed(event.target.checked)}
            type="checkbox"
          />
          <span>
            我已阅读并同意
            <span className="font-bold text-orange-500">《用户协议》</span>
            与
            <span className="font-bold text-orange-500">《隐私政策》</span>
          </span>
        </label>

        {error ? (
          <p className="mt-3 rounded-2xl bg-orange-50 px-4 py-2.5 text-sm font-semibold text-orange-700">
            {error}
          </p>
        ) : null}

        <button
          className="mt-4 h-[50px] w-full rounded-2xl bg-gradient-to-r from-orange-600 to-orange-500 text-xl font-black text-white shadow-[0_13px_26px_rgba(234,88,12,0.26)] transition hover:from-orange-500 hover:to-orange-400"
          type="submit"
        >
          立即注册
        </button>

        <p className="mt-4 border-b border-stone-200 pb-4 text-center text-sm font-medium text-stone-600">
          已有账号?
          <a className="ml-2 font-black text-orange-500" href="/login">
            去登录
          </a>
        </p>

        <p className="mt-3 text-center text-xs leading-6 text-stone-500">
          登录即代表你同意我们的《用户协议》与《隐私政策》
        </p>
      </form>
    </AuthLayout>
  )
}

export default Register
