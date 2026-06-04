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
        className="w-full max-w-[430px] rounded-[2rem] bg-white/90 px-8 py-8 shadow-[0_18px_48px_rgba(190,104,42,0.18)] backdrop-blur"
        onSubmit={handleSubmit}
      >
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-4 border-orange-500 text-lg font-black text-orange-500">
          AI
        </div>

        <div className="mt-5 text-center">
          <p className="text-3xl font-black text-stone-950">立即注册</p>
          <p className="mt-2 text-base font-medium text-stone-700">
            注册你的宠物记忆空间账号
          </p>
        </div>

        <div className="mt-6 space-y-4">
          <label className="block">
            <span className="text-sm font-bold text-stone-900">用户名</span>
            <input
              className="mt-2 h-11 w-full rounded-2xl border border-stone-200 bg-white/80 px-4 text-sm outline-none transition placeholder:text-stone-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
              onChange={(event) => setUsername(event.target.value)}
              placeholder="请输入用户名"
              type="text"
              value={username}
            />
          </label>

          <label className="block">
            <span className="text-sm font-bold text-stone-900">邮箱地址</span>
            <input
              className="mt-2 h-11 w-full rounded-2xl border border-stone-200 bg-white/80 px-4 text-sm outline-none transition placeholder:text-stone-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="请输入邮箱地址"
              type="email"
              value={email}
            />
          </label>

          <label className="block">
            <span className="text-sm font-bold text-stone-900">密码</span>
            <span className="mt-2 flex h-11 items-center rounded-2xl border border-stone-200 bg-white/80 px-4 transition focus-within:border-orange-400 focus-within:ring-4 focus-within:ring-orange-100">
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

          <label className="block">
            <span className="text-sm font-bold text-stone-900">确认密码</span>
            <input
              className="mt-2 h-11 w-full rounded-2xl border border-stone-200 bg-white/80 px-4 text-sm outline-none transition placeholder:text-stone-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="请再次输入密码"
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
            />
          </label>
        </div>

        <label className="mt-5 flex items-start gap-3 text-sm leading-6 text-stone-600">
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
          <p className="mt-4 rounded-2xl bg-orange-50 px-4 py-3 text-sm font-medium text-orange-700">
            {error}
          </p>
        ) : null}

        <button
          className="mt-5 h-12 w-full rounded-2xl bg-gradient-to-r from-orange-600 to-orange-500 text-lg font-bold text-white shadow-[0_12px_24px_rgba(234,88,12,0.24)] transition hover:from-orange-500 hover:to-orange-400"
          type="submit"
        >
          立即注册
        </button>

        <p className="mt-5 text-center text-sm text-stone-600">
          已有账号?
          <a className="ml-2 font-bold text-orange-500" href="/login">
            去登录
          </a>
        </p>
      </form>
    </AuthLayout>
  )
}

export default Register
