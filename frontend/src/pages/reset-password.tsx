import { useEffect, useMemo, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, CheckCircle2, Eye, EyeOff, Loader2, LockKeyhole, ShieldCheck } from 'lucide-react'
import { useForm, useWatch } from 'react-hook-form'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'

import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { useResetPassword } from '~/hooks/useAuth'
import { resetPasswordSchema, type ResetPasswordFormValues } from '~/schemas/reset-password.schema'
import type { ApiError } from '~/types'

export default function ResetPasswordPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [redirectCountdown, setRedirectCountdown] = useState<number | null>(null)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const resetPasswordMutation = useResetPassword()
  const token = searchParams.get('token') || ''

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onChange',
    defaultValues: {
      password: '',
      confirmPassword: ''
    }
  })

  const password = useWatch({ control, name: 'password' }) || ''
  const passwordChecks = useMemo(
    () => [
      { label: 'At least 8 characters', passed: password.length >= 8 },
      { label: 'Contains a letter', passed: /[A-Za-z]/.test(password) },
      { label: 'Contains a number', passed: /\d/.test(password) }
    ],
    [password]
  )
  const strength = passwordChecks.filter((rule) => rule.passed).length
  const strengthLabel = ['Too weak', 'Weak', 'Good', 'Strong'][strength]
  const strengthColor =
    strength === 0 ? 'bg-gray-200' : strength === 1 ? 'bg-red-400' : strength === 2 ? 'bg-amber-400' : 'bg-emerald-500'

  useEffect(() => {
    if (redirectCountdown === null) return

    if (redirectCountdown <= 0) {
      navigate('/login', { replace: true })
      return
    }

    const timer = window.setTimeout(() => {
      setRedirectCountdown((prev) => (prev === null ? null : prev - 1))
    }, 1000)

    return () => window.clearTimeout(timer)
  }, [navigate, redirectCountdown])

  const onSubmit = (data: ResetPasswordFormValues) => {
    if (!token) {
      toast.error('Reset token is missing or invalid.')
      return
    }

    resetPasswordMutation.mutate(
      {
        token,
        newPassword: data.password
      },
      {
        onSuccess: (res) => {
          toast.success(res.message || 'Password reset successfully. Please login again.')
          setRedirectCountdown(3)
        },
        onError: (err: ApiError) => {
          toast.error(err.message || 'Unable to reset password. Please request a new link.')
        }
      }
    )
  }

  return (
    <div className='min-h-screen bg-slate-950'>
      <div className='grid min-h-screen lg:grid-cols-2'>
        <div className='relative hidden overflow-hidden lg:flex'>
          <div className='absolute inset-0 bg-linear-to-br from-slate-950 via-orange-950 to-slate-900' />
          <div className='absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.28),transparent_0,transparent_36%),radial-gradient(circle_at_bottom_right,rgba(239,68,68,0.22),transparent_0,transparent_40%)]' />
          <div className='absolute -left-16 top-16 h-56 w-56 rounded-full bg-orange-400/15 blur-3xl' />
          <div className='absolute bottom-0 right-0 h-72 w-72 rounded-full bg-rose-500/10 blur-3xl' />

          <div className='relative z-10 flex w-full flex-col justify-between p-8 text-white xl:p-12'>
            <div className='inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm backdrop-blur-xl'>
              Password update
            </div>

            <div className='space-y-8'>
              <div className='space-y-4'>
                <p className='text-sm font-medium uppercase tracking-[0.24em] text-orange-200/80'>Reset password</p>
                <h1 className='max-w-xl text-4xl font-bold leading-tight xl:text-5xl'>
                  Create a fresh password and protect your account.
                </h1>
                <p className='max-w-lg text-base leading-7 text-slate-300 xl:text-lg'>
                  Choose a strong new password to finish your recovery flow and sign in again securely.
                </p>
              </div>

              <div className='grid gap-3'>
                <div className='rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl'>
                  <p className='text-sm font-semibold'>Secure reset link</p>
                  <p className='mt-1 text-xs text-slate-300'>
                    Your recovery link is private and expires automatically.
                  </p>
                </div>
                <div className='rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl'>
                  <p className='text-sm font-semibold'>Strong password recommended</p>
                  <p className='mt-1 text-xs text-slate-300'>
                    Use a new password with letters, numbers, and at least 8 characters.
                  </p>
                </div>
              </div>
            </div>

            <div className='rounded-2xl border border-white/10 bg-white/10 p-4 text-sm text-slate-300 backdrop-blur-xl'>
              Tip: avoid reusing old passwords to keep your account safer.
            </div>
          </div>
        </div>

        <div className='flex items-center justify-center bg-gray-50 p-4 sm:p-6'>
          <div className='w-full max-w-md space-y-6 rounded-3xl border border-gray-100 bg-white p-8 shadow-2xl'>
            <Link
              to='/login'
              className='inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-800'
            >
              <ArrowLeft className='size-4' />
              Back to login
            </Link>

            <div className='space-y-3 text-center'>
              <div className='inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-700'>
                <ShieldCheck className='size-3.5' />
                Secure password change
              </div>

              <div className='space-y-1'>
                <h2 className='text-2xl font-semibold text-gray-900'>Set a new password</h2>
                <p className='text-sm text-gray-500'>Enter your new password below to complete the recovery process.</p>
              </div>
            </div>

            {!token && (
              <div className='rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700'>
                Reset token is missing or invalid. Please request a new password reset link.
              </div>
            )}

            {redirectCountdown !== null ? (
              <div className='space-y-4'>
                <div className='mx-auto flex size-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600'>
                  <CheckCircle2 className='size-8' />
                </div>

                <div className='rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-center text-sm text-emerald-700'>
                  Password changed successfully. Redirecting to login in{' '}
                  <span className='font-semibold'>{redirectCountdown}s</span>.
                </div>

                <Button asChild className='h-11 w-full'>
                  <Link to='/login'>Go to login now</Link>
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
                <div className='space-y-2'>
                  <label htmlFor='reset-password' className='text-sm font-medium text-gray-700'>
                    New password
                  </label>
                  <div className='relative'>
                    <LockKeyhole className='absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400' />
                    <Input
                      id='reset-password'
                      {...register('password')}
                      type={showPassword ? 'text' : 'password'}
                      autoComplete='new-password'
                      placeholder='Enter new password'
                      className='h-11 pl-10 pr-10'
                      aria-invalid={Boolean(errors.password)}
                    />
                    <button
                      type='button'
                      onClick={() => setShowPassword((prev) => !prev)}
                      className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400'
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.password ? (
                    <p className='text-xs text-red-500'>{errors.password.message}</p>
                  ) : (
                    <p className='text-xs text-gray-500'>Use a strong password you haven’t used before.</p>
                  )}
                </div>

                <div className='rounded-2xl bg-gray-50 p-3'>
                  <div className='mb-2 flex items-center justify-between text-xs font-medium'>
                    <span className='text-gray-600'>Password strength</span>
                    <span className={strength >= 2 ? 'text-emerald-600' : 'text-amber-600'}>{strengthLabel}</span>
                  </div>

                  <div className='mb-3 flex gap-1'>
                    {[1, 2, 3].map((level) => (
                      <div
                        key={level}
                        className={`h-1.5 flex-1 rounded-full ${strength >= level ? strengthColor : 'bg-gray-200'}`}
                      />
                    ))}
                  </div>

                  <div className='grid gap-1 text-xs text-gray-500'>
                    {passwordChecks.map((rule) => (
                      <div key={rule.label} className='flex items-center gap-2'>
                        <CheckCircle2 className={`size-3.5 ${rule.passed ? 'text-emerald-500' : 'text-gray-300'}`} />
                        <span>{rule.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className='space-y-2'>
                  <label htmlFor='reset-confirm-password' className='text-sm font-medium text-gray-700'>
                    Confirm password
                  </label>
                  <Input
                    id='reset-confirm-password'
                    {...register('confirmPassword')}
                    type={showPassword ? 'text' : 'password'}
                    autoComplete='new-password'
                    placeholder='Confirm new password'
                    className='h-11'
                    aria-invalid={Boolean(errors.confirmPassword)}
                  />
                  {errors.confirmPassword && <p className='text-xs text-red-500'>{errors.confirmPassword.message}</p>}
                </div>

                <Button
                  type='submit'
                  className='h-11 w-full bg-primary text-white hover:bg-primary/90'
                  disabled={!token || !isValid || resetPasswordMutation.isPending}
                >
                  {resetPasswordMutation.isPending ? (
                    <>
                      <Loader2 className='size-4 animate-spin' />
                      Updating password...
                    </>
                  ) : (
                    'Reset password'
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
