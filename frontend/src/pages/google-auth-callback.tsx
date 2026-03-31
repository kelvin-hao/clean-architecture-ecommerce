import { useEffect } from 'react'
import { Loader2, ShieldCheck } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

import { useAuthStore } from '~/store/auth.store'
import type { AuthUser } from '~/types/auth.type'

export default function GoogleAuthCallbackPage() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)

  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, '')
    const params = new URLSearchParams(hash)

    const accessToken = params.get('accessToken')
    const refreshToken = params.get('refreshToken')
    const redirectTo = params.get('redirect') || '/'
    const rawUser = params.get('user')
    const error = params.get('error')

    window.history.replaceState(null, document.title, window.location.pathname)

    if (error) {
      toast.error(error)
      navigate('/login', { replace: true })
      return
    }

    if (!accessToken || !refreshToken || !rawUser) {
      toast.error('Google login failed. Please try again.')
      navigate('/login', { replace: true })
      return
    }

    try {
      const user = JSON.parse(rawUser) as AuthUser

      setAuth({
        user,
        accessToken,
        refreshToken
      })

      toast.success(`Welcome back${user.name ? `, ${user.name}` : ''}!`)
      navigate(redirectTo, { replace: true })
    } catch {
      toast.error('Unable to complete Google login. Please try again.')
      navigate('/login', { replace: true })
    }
  }, [navigate, setAuth])

  return (
    <div className='flex min-h-screen items-center justify-center bg-linear-to-br from-slate-950 via-indigo-950 to-slate-900 p-6'>
      <div className='w-full max-w-md space-y-4 rounded-3xl border border-white/10 bg-white/10 p-8 text-center text-white shadow-2xl backdrop-blur-xl'>
        <div className='mx-auto flex size-14 items-center justify-center rounded-2xl bg-white/10'>
          <ShieldCheck className='size-7 text-cyan-300' />
        </div>

        <div className='space-y-2'>
          <h1 className='text-2xl font-semibold'>Completing Google sign-in</h1>
          <p className='text-sm text-slate-300'>Please wait while we securely finish your login and redirect you.</p>
        </div>

        <div className='flex items-center justify-center gap-2 text-sm text-cyan-200'>
          <Loader2 className='size-4 animate-spin' />
          Signing you in...
        </div>
      </div>
    </div>
  )
}
