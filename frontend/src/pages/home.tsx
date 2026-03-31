import { Loader2, LogOut, ShieldCheck, ShoppingBag, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

import { Header } from '~/components/Header'
import { Button } from '~/components/ui/button'
import { useLogout } from '~/hooks/useAuth'
import { useAuthStore } from '~/store/auth.store'
import type { ApiError } from '~/types'

export default function HomePage() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const logoutMutation = useLogout()

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success('Logged out successfully')
        navigate('/login', { replace: true })
      },
      onError: (error: ApiError) => {
        toast.error(error.message || 'Session ended. Redirecting to login.')
        navigate('/login', { replace: true })
      }
    })
  }

  return (
    <div className='min-h-screen bg-linear-to-br from-slate-50 via-white to-blue-50'>
      <Header user={user} />

      <div className='mx-auto max-w-5xl space-y-6 px-6 py-6'>
        <div className='flex flex-col gap-4 rounded-3xl bg-slate-950 p-6 text-white shadow-2xl sm:flex-row sm:items-center sm:justify-between'>
          <div className='space-y-2'>
            <div className='inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-medium'>
              <Sparkles className='size-3.5 text-cyan-300' />
              Signed in successfully
            </div>
            <h1 className='text-3xl font-bold'>Welcome {user?.name || user?.email || 'back'} 👋</h1>
            <p className='text-sm text-slate-300'>Your account is authenticated and ready to use.</p>
          </div>

          <Button
            type='button'
            variant='secondary'
            className='h-11 bg-white text-slate-900 hover:bg-slate-100'
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
          >
            {logoutMutation.isPending ? <Loader2 className='size-4 animate-spin' /> : <LogOut className='size-4' />}
            {logoutMutation.isPending ? 'Logging out...' : 'Log out'}
          </Button>
        </div>

        <div className='grid gap-4 md:grid-cols-3'>
          <div className='rounded-2xl border border-gray-200 bg-white p-5 shadow-sm'>
            <ShieldCheck className='mb-3 size-5 text-emerald-600' />
            <h2 className='font-semibold text-gray-900'>Account secured</h2>
            <p className='mt-1 text-sm text-gray-500'>Your login token is active and stored for this session.</p>
          </div>

          <div className='rounded-2xl border border-gray-200 bg-white p-5 shadow-sm'>
            <ShoppingBag className='mb-3 size-5 text-blue-600' />
            <h2 className='font-semibold text-gray-900'>Ready for shopping</h2>
            <p className='mt-1 text-sm text-gray-500'>
              You can now connect this page to products, cart, or dashboard flows.
            </p>
          </div>

          <div className='rounded-2xl border border-gray-200 bg-white p-5 shadow-sm'>
            <Sparkles className='mb-3 size-5 text-violet-600' />
            <h2 className='font-semibold text-gray-900'>Modern auth flow</h2>
            <p className='mt-1 text-sm text-gray-500'>Register, verify OTP, and login are now visually consistent.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
