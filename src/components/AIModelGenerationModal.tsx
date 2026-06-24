import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { PetStatus } from '../types'

const generationSteps = [
  '正在识别宠物轮廓',
  '正在匹配毛色与品种特征',
  '正在生成专属 3D 形象',
  '专属 3D 形象已生成',
] as const

type AIModelGenerationModalProps = {
  isOpen: boolean
  onComplete: () => void
  status: PetStatus
}

const AIModelGenerationModal = ({
  isOpen,
  onComplete,
  status,
}: AIModelGenerationModalProps) => {
  const [progress, setProgress] = useState(0)
  const [activeStepIndex, setActiveStepIndex] = useState(0)
  const onCompleteRef = useRef(onComplete)
  const isActive = status === 'active'

  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  useEffect(() => {
    if (!isOpen) {
      setProgress(0)
      setActiveStepIndex(0)
      return undefined
    }

    const totalDuration = 3600
    const tickDuration = 60
    const startedAt = Date.now()

    setProgress(4)
    setActiveStepIndex(0)

    const timerId = window.setInterval(() => {
      const elapsed = Date.now() - startedAt
      const nextProgress = Math.min(100, Math.round((elapsed / totalDuration) * 100))
      const nextStepIndex = Math.min(
        generationSteps.length - 1,
        Math.floor((nextProgress / 100) * generationSteps.length),
      )

      setProgress(nextProgress)
      setActiveStepIndex(nextStepIndex)

      if (nextProgress >= 100) {
        window.clearInterval(timerId)
        window.setTimeout(() => {
          onCompleteRef.current()
        }, 520)
      }
    }, tickDuration)

    return () => {
      window.clearInterval(timerId)
    }
  }, [isOpen])

  if (!isOpen) {
    return null
  }

  return createPortal(
    <div className="fixed inset-0 z-[120] flex items-center justify-center px-6">
      <style>
        {`
          @keyframes aiModelGenerationOverlayIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          @keyframes aiModelGenerationModalIn {
            from {
              opacity: 0;
              transform: translateY(10px) scale(0.96);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
        `}
      </style>
      <div
        className="absolute inset-0 bg-black/48 backdrop-blur-[2px]"
        style={{ animation: 'aiModelGenerationOverlayIn 200ms ease-out both' }}
      />
      <section
        aria-modal="true"
        className="relative z-[121] w-[520px] max-w-[calc(100vw-48px)] rounded-[30px] border border-white/80 bg-white/94 p-6 shadow-[0_30px_86px_rgba(60,38,18,0.28)] backdrop-blur-md"
        role="dialog"
        style={{
          animation:
            'aiModelGenerationModalIn 240ms cubic-bezier(0.22, 1, 0.36, 1) both',
        }}
      >
        <div className="text-center">
          <p
            className={`text-sm font-black tracking-[0.18em] ${
              isActive ? 'text-orange-400' : 'text-purple-400'
            }`}
          >
            AI PET MODEL
          </p>
          <h2
            className={`mt-2 text-[26px] font-black ${
              isActive ? 'text-orange-600' : 'text-purple-600'
            }`}
          >
            正在生成专属 3D 形象
          </h2>
          <p className="mt-2 text-sm font-semibold text-stone-500">
            根据参考图模拟识别特征，稍等一下就好。
          </p>
        </div>

        <div className="mt-6 overflow-hidden rounded-full bg-stone-100 shadow-inner">
          <div
            className={`h-3 rounded-full bg-gradient-to-r transition-all duration-150 ease-out ${
              isActive
                ? 'from-orange-300 to-orange-500'
                : 'from-purple-300 to-purple-500'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-2 text-right text-xs font-black text-stone-400">
          {progress}%
        </p>

        <div className="mt-5 space-y-3">
          {generationSteps.map((step, index) => {
            const isDone = index < activeStepIndex
            const isCurrent = index === activeStepIndex

            return (
              <div
                className={`flex items-center gap-3 rounded-2xl border px-4 py-3 transition ${
                  isCurrent
                    ? isActive
                      ? 'border-orange-100 bg-orange-50 text-orange-700'
                      : 'border-purple-100 bg-purple-50 text-purple-700'
                    : 'border-white/70 bg-white/70 text-stone-500'
                }`}
                key={step}
              >
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-black ${
                    isDone || isCurrent
                      ? isActive
                        ? 'bg-orange-500 text-white'
                        : 'bg-purple-500 text-white'
                      : 'bg-stone-100 text-stone-400'
                  }`}
                >
                  {isDone ? '✓' : index + 1}
                </span>
                <span className="text-sm font-black">{step}</span>
              </div>
            )
          })}
        </div>
      </section>
    </div>,
    document.body,
  )
}

export default AIModelGenerationModal
