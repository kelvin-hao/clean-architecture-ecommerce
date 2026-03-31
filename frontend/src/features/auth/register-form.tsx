import { useState } from 'react'
import { CheckCircle2, Eye, EyeOff, Loader2, LockKeyhole, Mail, ShieldCheck, UserRound } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'

import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Separator } from '~/components/ui/separator'
import { useRegister } from '~/hooks/useAuth'
import { registerSchema, type RegisterFormValues } from '~/schemas/register.schema'
import { toast } from 'sonner'
import type { ApiError } from '~/types'
import type { RegisterBody } from '~/types/auth.type'

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false)
  const registerMutation = useRegister()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors, isValid }
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptedTerms: false
    }
  })

  // eslint-disable-next-line react-hooks/incompatible-library
  const password = watch('password') ?? ''

  const passwordChecks = [
    { label: 'At least 8 characters', passed: password.length >= 8 },
    { label: 'Contains a letter', passed: /[A-Za-z]/.test(password) },
    { label: 'Contains a number', passed: /\d/.test(password) }
  ]

  const strength = passwordChecks.filter((rule) => rule.passed).length
  const strengthLabel = ['Too weak', 'Weak', 'Good', 'Strong'][strength]
  const strengthColor =
    strength === 0 ? 'bg-gray-200' : strength === 1 ? 'bg-red-400' : strength === 2 ? 'bg-amber-400' : 'bg-emerald-500'

  const onSubmit = (data: RegisterFormValues) => {
    const body: RegisterBody = {
      email: data.email.trim(),
      password: data.password,
      name: data.name.trim()
    }

    registerMutation.mutate(body, {
      onSuccess: (res) => {
        toast.success('Account created. Verify your email to continue.')
        navigate(`/verify-otp?email=${encodeURIComponent(res.email)}`)
      },
      onError: (err: ApiError) => {
        Object.entries(err.errors ?? {}).forEach(([field, messages]) => {
          if (field === 'name' || field === 'email' || field === 'password') {
            setError(field, {
              type: 'server',
              message: messages?.[0] ?? err.message
            })
          }
        })

        toast.error(err.message || 'Register failed. Please try again')
      }
    })
  }

  return (
    <div className='w-full max-w-md space-y-6 rounded-3xl border border-gray-100 bg-white p-8 shadow-xl'>
      <div className='space-y-3 text-center'>
        <div className='inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700'>
          <ShieldCheck className='size-3.5' />
          Secure account setup
        </div>

        <div className='space-y-1'>
          <h1 className='text-2xl font-semibold text-gray-900'>Create your account</h1>
          <p className='text-sm text-gray-500'>
            Sign up to place orders faster, track deliveries, and manage your wishlist.
          </p>
        </div>
      </div>

      <div className='grid grid-cols-3 gap-2 text-xs'>
        <div className='rounded-xl bg-slate-50 px-3 py-2 text-center font-medium text-slate-700'>Fast checkout</div>
        <div className='rounded-xl bg-slate-50 px-3 py-2 text-center font-medium text-slate-700'>Order tracking</div>
        <div className='rounded-xl bg-slate-50 px-3 py-2 text-center font-medium text-slate-700'>Secure access</div>
      </div>

      <button
        type='button'
        disabled
        className='flex h-11 w-full items-center justify-center gap-3 rounded-lg border text-sm font-medium text-gray-500 opacity-80'
      >
        <img src='https://www.svgrepo.com/show/475656/google-color.svg' alt='Google logo' className='h-5 w-5' />
        <span>Continue with Google</span>
        <span className='rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide'>
          Soon
        </span>
      </button>

      <div className='flex items-center gap-2'>
        <Separator className='flex-1' />
        <span className='text-xs text-gray-400'>or use email</span>
        <Separator className='flex-1' />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
        <div className='space-y-2'>
          <label htmlFor='register-name' className='text-sm font-medium text-gray-700'>
            Full name
          </label>
          <div className='relative'>
            <UserRound className='absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400' />
            <Input
              id='register-name'
              {...register('name')}
              placeholder='John Doe'
              autoComplete='name'
              aria-invalid={Boolean(errors.name)}
              className='h-11 pl-10'
            />
          </div>
          {errors.name && <p className='text-xs text-red-500'>{errors.name.message}</p>}
        </div>

        <div className='space-y-2'>
          <label htmlFor='register-email' className='text-sm font-medium text-gray-700'>
            Email
          </label>
          <div className='relative'>
            <Mail className='absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400' />
            <Input
              id='register-email'
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
          <label htmlFor='register-password' className='text-sm font-medium text-gray-700'>
            Password
          </label>
          <div className='relative'>
            <LockKeyhole className='absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400' />
            <Input
              id='register-password'
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              placeholder='Create a password'
              autoComplete='new-password'
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
            <p className='text-xs text-gray-500'>Use 8 to 30 characters for a secure password.</p>
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
          <label htmlFor='register-confirm-password' className='text-sm font-medium text-gray-700'>
            Confirm password
          </label>
          <Input
            id='register-confirm-password'
            {...register('confirmPassword')}
            placeholder='Re-enter your password'
            type={showPassword ? 'text' : 'password'}
            autoComplete='new-password'
            aria-invalid={Boolean(errors.confirmPassword)}
            className='h-11'
          />
          {errors.confirmPassword && <p className='text-xs text-red-500'>{errors.confirmPassword.message}</p>}
        </div>

        <div className='space-y-2'>
          <label className='flex items-start gap-3 rounded-2xl border border-gray-200 p-3 text-sm text-gray-600'>
            <input type='checkbox' {...register('acceptedTerms')} className='mt-0.5 size-4 rounded border-gray-300' />
            <span>I agree to the Terms of Service and Privacy Policy.</span>
          </label>
          {errors.acceptedTerms && <p className='text-xs text-red-500'>{errors.acceptedTerms.message}</p>}
        </div>

        <Button
          type='submit'
          className='h-11 w-full bg-primary text-white hover:bg-primary/90'
          disabled={!isValid || registerMutation.isPending}
        >
          {registerMutation.isPending ? (
            <>
              <Loader2 className='size-4 animate-spin' />
              Creating account...
            </>
          ) : (
            'Create account'
          )}
        </Button>

        <p className='text-center text-xs text-gray-500'>We will send an OTP code to your email after sign up.</p>
      </form>

      <p className='text-center text-sm text-gray-500'>
        Already have an account?{' '}
        <Link to='/login' className='font-medium text-blue-600 hover:underline'>
          Sign in
        </Link>
      </p>
    </div>
  )
}
