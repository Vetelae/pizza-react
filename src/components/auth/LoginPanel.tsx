import { useCallback, useEffect, useRef, useState } from 'react'
import { FaTimes } from 'react-icons/fa'
import { useAuthStore } from '@/store/authStore'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'
import VerifyEmail from './VerifyEmail'
import ForgotPasswordForm from './ForgotPasswordForm'

type View = 'login' | 'register' | 'verify' | 'forgot'

const viewTitles: Record<View, string> = {
  login: 'Sign in',
  register: 'Create account',
  verify: 'Check your email',
  forgot: 'Reset password',
}

export default function LoginPanel() {
  const [view, setView] = useState<View>('login')
  const { isLoginOpen, closeLogin } = useAuthStore()
  const panelRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const previouslyFocusedElementRef = useRef<HTMLElement | null>(null)

  const onClose = useCallback(() => {
    closeLogin()
    setTimeout(() => setView('login'), 300)
  }, [closeLogin])

  useEffect(() => {
    if (!isLoginOpen) return

    previouslyFocusedElementRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null

    const focusableSelector = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(',')

    const animationFrame = requestAnimationFrame(() => {
      titleRef.current?.focus()
    })

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }

      if (event.key !== 'Tab' || !panelRef.current) return

      const focusableElements = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(focusableSelector),
      )

      if (focusableElements.length === 0) {
        event.preventDefault()
        panelRef.current.focus()
        return
      }

      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]
      const activeElement = document.activeElement
      const activeElementIsFocusable = focusableElements.includes(
        activeElement as HTMLElement,
      )

      if (!panelRef.current.contains(activeElement) || !activeElementIsFocusable) {
        event.preventDefault()
        const focusTarget = event.shiftKey ? lastElement : firstElement
        focusTarget.focus()
      } else if (event.shiftKey && activeElement === firstElement) {
        event.preventDefault()
        lastElement.focus()
      } else if (!event.shiftKey && activeElement === lastElement) {
        event.preventDefault()
        firstElement.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      cancelAnimationFrame(animationFrame)
      document.removeEventListener('keydown', handleKeyDown)
      previouslyFocusedElementRef.current?.focus()
    }
  }, [isLoginOpen, onClose])

  useEffect(() => {
    if (!isLoginOpen) return

    const animationFrame = requestAnimationFrame(() => {
      titleRef.current?.focus()
    })

    return () => cancelAnimationFrame(animationFrame)
  }, [isLoginOpen, view])

  useEffect(() => {
    document.documentElement.style.overflow = isLoginOpen ? 'hidden' : ''
    return () => {
      document.documentElement.style.overflow = ''
    }
  }, [isLoginOpen])

  return (
    <>
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${
          isLoginOpen
            ? 'pointer-events-auto opacity-100'
            : 'pointer-events-none opacity-0'
        }`}
      />

      <aside
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-panel-title"
        className={`fixed top-0 right-0 z-50 flex h-full w-full max-w-full flex-col
          overflow-y-auto border-l border-orange/30 bg-white p-5 outline-none
          transition-transform duration-300 ease-in-out sm:w-96 sm:p-6 ${
            isLoginOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2
            ref={titleRef}
            id="login-panel-title"
            tabIndex={-1}
            className="text-xl font-bold text-zinc-900 outline-none"
          >
            {viewTitles[view]}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close panel"
            className="rounded-lg p-2 text-zinc-400 transition-colors
              hover:bg-zinc-100 hover:text-zinc-700 focus-visible:outline-2
              focus-visible:outline-offset-2 focus-visible:outline-orange"
          >
            <FaTimes aria-hidden="true" />
          </button>
        </div>

        {view === 'login' && (
          <LoginForm
            onRegisterClick={() => setView('register')}
            onForgotClick={() => setView('forgot')}
          />
        )}
        {view === 'register' && (
          <RegisterForm
            onLoginClick={() => setView('login')}
            onVerifyClick={() => setView('verify')}
          />
        )}
        {view === 'verify' && (
          <VerifyEmail onLoginClick={() => setView('login')} />
        )}
        {view === 'forgot' && (
          <ForgotPasswordForm onLoginClick={() => setView('login')} />
        )}
      </aside>
    </>
  )
}
