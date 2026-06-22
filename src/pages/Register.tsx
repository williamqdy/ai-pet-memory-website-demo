import { useState } from 'react'
import type { FormEvent } from 'react'
import LoginAuthLayout, { authCardBaseClass } from '../components/LoginAuthLayout'
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
      password: password.trim(),
    }

    setStorageItem(STORAGE_KEYS.user, user)
    navigateTo('/create-pet')
  }

  return (
    <LoginAuthLayout>
      <form
        className={`${authCardBaseClass} px-[clamp(22px,2.1vw,32px)] pt-[clamp(12px,1.6vh,18px)] pb-[clamp(16px,2vh,22px)]`}
        onSubmit={handleSubmit}
      >
        <div className="mx-auto flex h-[clamp(42px,3.6vw,50px)] w-[clamp(42px,3.6vw,50px)] items-center justify-center">
          <img
            alt="AI宠物记忆空间标志"
            className="pointer-events-none h-full w-full select-none object-contain"
            src="/images/auth/login-page/pet_logo.png"
          />
        </div>

        <div className="mt-1 text-center">
          <div className="flex items-center justify-center gap-4">
            <span className="h-3.5 w-3.5 rotate-45 rounded-[4px] bg-orange-300" />
            <h2 className="text-[clamp(22px,1.7vw,26px)] font-black text-stone-950">立即注册</h2>
            <span className="h-3.5 w-3.5 rotate-45 rounded-[4px] bg-orange-300" />
          </div>
          <p className="mt-0.5 text-[13px] font-semibold text-stone-700">
            注册你的宠物记忆空间账号
          </p>
        </div>

        <div className="mt-2 space-y-1">
          <label className="block">
            <span className="text-[12px] font-black leading-4 text-stone-900">用户名</span>
            <input
              className="mt-0.5 h-[36px] w-full rounded-2xl border border-stone-200/90 bg-white/70 px-4 text-sm font-medium outline-none transition placeholder:text-stone-400 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
              onChange={(event) => setUsername(event.target.value)}
              placeholder="请输入用户名"
              type="text"
              value={username}
            />
          </label>

          <label className="block">
            <span className="text-[12px] font-black leading-4 text-stone-900">邮箱地址</span>
            <input
              className="mt-0.5 h-[36px] w-full rounded-2xl border border-stone-200/90 bg-white/70 px-4 text-sm font-medium outline-none transition placeholder:text-stone-400 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="请输入邮箱地址"
              type="email"
              value={email}
            />
          </label>

          <label className="block">
            <span className="text-[12px] font-black leading-4 text-stone-900">密码</span>
            <span className="mt-0.5 flex h-[36px] items-center rounded-2xl border border-stone-200/90 bg-white/70 px-4 transition focus-within:border-orange-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-orange-100">
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
            <span className="text-[12px] font-black leading-4 text-stone-900">确认密码</span>
            <input
              className="mt-0.5 h-[36px] w-full rounded-2xl border border-stone-200/90 bg-white/70 px-4 text-sm font-medium outline-none transition placeholder:text-stone-400 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="请再次输入密码"
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
            />
          </label>
        </div>

        <label className="mt-1.5 flex items-start gap-2 text-[11px] leading-4 text-stone-600">
          <input
            checked={agreed}
            className="mt-0.5 h-4 w-4 rounded border-stone-300 text-orange-500"
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

        <p
          aria-live="polite"
          className={`mt-1 flex h-6 items-center rounded-xl bg-orange-50 px-3 text-[11px] font-semibold text-orange-700 ${
            error ? 'visible' : 'invisible'
          }`}
        >
          {error || '请完整填写注册信息'}
        </p>

        <button
          className="mt-1.5 h-[42px] w-full rounded-2xl bg-gradient-to-r from-orange-600 to-orange-500 text-base font-black text-white shadow-[0_13px_26px_rgba(234,88,12,0.26)] transition hover:from-orange-500 hover:to-orange-400"
          type="submit"
        >
          立即注册
        </button>

        <p className="mt-1.5 border-b border-stone-200 pb-1.5 text-center text-xs font-medium text-stone-600">
          已有账号?
          <a className="ml-2 font-black text-orange-500" href="/login">
            去登录
          </a>
        </p>

        <p className="mt-1 text-center text-[11px] leading-4 text-stone-500">
          登录即代表你同意我们的《用户协议》与《隐私政策》
        </p>
      </form>
    </LoginAuthLayout>
  )
}

export default Register
