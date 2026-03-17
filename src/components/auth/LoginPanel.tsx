import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'
import VerifyEmail from './VerifyEmail'

type View = 'login' | 'register' | 'verify'

export default function LoginPanel() {
  const [view, setView] = useState<View>('login')
  const { isLoginOpen, closeLogin } = useAuthStore()

  useEffect(() => {
    if (!isLoginOpen) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isLoginOpen])

  useEffect(() => {
    document.body.style.overflow = isLoginOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isLoginOpen])

  const onClose = () => {
    closeLogin()
    setTimeout(() => setView('login'), 300)
  }

  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300
          ${isLoginOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      />

      {/* Panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Sign in"
        className={`fixed top-0 right-0 h-full w-80 bg-white dark:bg-zinc-900
          border-l border-zinc-100 dark:border-zinc-800 z-50
          flex flex-col p-8 transition-transform duration-300 ease-in-out
          ${isLoginOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            {view === 'login' && 'Sign in'}
            {view === 'register' && 'Create account'}
            {view === 'verify' && 'Check your email'}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close panel"
            className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200
              p-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* View switcher */}
        {view === 'login' && (
          <LoginForm onRegisterClick={() => setView('register')} />
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
      </aside>
    </>
  )
}