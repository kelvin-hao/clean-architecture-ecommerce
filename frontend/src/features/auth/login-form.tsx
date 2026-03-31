import { useState } from 'react'
import { Eye, EyeOff, Loader2, LockKeyhole, Mail, ShieldAlert, ShieldCheck } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'

import { authApi } from '~/apis/auth.api'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Separator } from '~/components/ui/separator'
import { useLogin } from '~/hooks/useAuth'
import { loginSchema, type LoginFormValues } from '~/schemas/login.schema'
import { toast } from 'sonner'
import type { ApiError } from '~/types'
import type { LoginBody } from '~/types/auth.type'

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [generalError, setGeneralError] = useState('')
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const loginMutation = useLogin()
  const redirectTo = searchParams.get('redirect') || '/'

  const {
    register,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const handleGoogleLogin = () => {
    setGeneralError('')
    window.location.assign(authApi.googleLoginUrl(redirectTo))
  }

  const onSubmit = async (data: LoginFormValues) => {
    setGeneralError('')

    const body: LoginBody = {
      email: data.email.trim(),
      password: data.password
    }

    try {
      const res = await loginMutation.mutateAsync(body)

      toast.success(`Welcome back${res.user.name ? `, ${res.user.name}` : ''}!`)
      navigate(redirectTo, { replace: true })
    } catch (error) {
      const err = error as ApiError
      const message =
        err.status === 429
          ? 'Too many login attempts. Please wait a moment and try again.'
          : 'Invalid email or password'

      setGeneralError(message)
      toast.error(message)
    }
  }

  return (
    <div className='w-full max-w-md space-y-6 rounded-3xl border border-gray-100 bg-white p-8 shadow-xl'>
      <div className='space-y-3 text-center'>
        <div className='inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700'>
          <ShieldCheck className='size-3.5' />
          Secure login
        </div>

        <div className='space-y-1'>
          <h1 className='text-2xl font-semibold text-gray-900'>Welcome back</h1>
          <p className='text-sm text-gray-500'>Sign in to continue tracking orders and managing your account.</p>
        </div>
      </div>

      <div className='grid grid-cols-3 gap-2 text-xs'>
        <div className='rounded-xl bg-slate-50 px-3 py-2 text-center font-medium text-slate-700'>Saved carts</div>
        <div className='rounded-xl bg-slate-50 px-3 py-2 text-center font-medium text-slate-700'>Fast checkout</div>
        <div className='rounded-xl bg-slate-50 px-3 py-2 text-center font-medium text-slate-700'>Order history</div>
      </div>

      <button
        type='button'
        onClick={handleGoogleLogin}
        className='flex h-11 w-full items-center justify-center gap-3 rounded-lg border text-sm font-medium text-gray-700 transition hover:bg-gray-50'
      >
        <img src='https://www.svgrepo.com/show/475656/google-color.svg' alt='Google logo' className='h-5 w-5' />
        <span>Continue with Google</span>
      </button>

      <div className='flex items-center gap-2'>
        <Separator className='flex-1' />
        <span className='text-xs text-gray-400'>or use email</span>
        <Separator className='flex-1' />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
        {generalError && (
          <div className='flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700'>
            <ShieldAlert className='mt-0.5 size-4 shrink-0' />
            <span>{generalError}</span>
          </div>
        )}

        <div className='space-y-2'>
          <label htmlFor='login-email' className='text-sm font-medium text-gray-700'>
            Email
          </label>
          <div className='relative'>
            <Mail className='absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400' />
            <Input
              id='login-email'
              {...register('email')}
              placeholder='you@example.com'
              autoComplete='email'
              aria-invalid={Boolean(errors.email)}
              className='h-11 pl-10'
            />
          </div>
          {errors.email && <p className='text-xs text-red-500'>{errors.email.message}</p>}
        </div>

        <div className='space-y-2'>
          <label htmlFor='login-password' className='text-sm font-medium text-gray-700'>
            Password
          </label>
          <div className='relative'>
            <LockKeyhole className='absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400' />
            <Input
              id='login-password'
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              placeholder='Enter your password'
              autoComplete='current-password'
              aria-invalid={Boolean(errors.password)}
              className='h-11 pl-10 pr-10'
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
            <p className='text-xs text-gray-500'>Use the same password you created during registration.</p>
          )}
        </div>

        <div className='flex items-center justify-between gap-3 text-sm'>
          <label className='flex items-center gap-2 text-gray-600'>
            <input type='checkbox' className='size-4 rounded border-gray-300' />
            Remember me
          </label>

          <Link to='/forgot-password' className='font-medium text-blue-600 hover:underline'>
            Forgot password?
          </Link>
        </div>

        <Button
          type='submit'
          className='h-11 w-full bg-primary text-white hover:bg-primary/90'
          disabled={!isValid || loginMutation.isPending}
        >
          {loginMutation.isPending ? (
            <>
              <Loader2 className='size-4 animate-spin' />
              Signing in...
            </>
          ) : (
            'Sign in'
          )}
        </Button>
      </form>

      <p className='text-center text-sm text-gray-500'>
        Don’t have an account?{' '}
        <Link to='/register' className='font-medium text-blue-600 hover:underline'>
          Create account
        </Link>
      </p>
    </div>
  )
}
