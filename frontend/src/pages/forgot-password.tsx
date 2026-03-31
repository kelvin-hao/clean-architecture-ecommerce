import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Loader2, Mail, MailCheck, ShieldCheck, Sparkles } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'

import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { useForgotPassword } from '~/hooks/useAuth'
import { forgotPasswordSchema, type ForgotPasswordFormValues } from '~/schemas/forgot-password.schema'
import type { ApiError } from '~/types'

export default function ForgotPasswordPage() {
  const [submittedEmail, setSubmittedEmail] = useState('')
  const forgotPasswordMutation = useForgotPassword()

  const {
    register,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: 'onChange',
    defaultValues: {
      email: ''
    }
  })

  const onSubmit = (data: ForgotPasswordFormValues) => {
    const email = data.email.trim().toLowerCase()

    forgotPasswordMutation.mutate(
      { email },
      {
        onSuccess: (res) => {
          setSubmittedEmail(email)
          toast.success(res.message)
        },
        onError: (err: ApiError) => {
          toast.error(err.message || 'Unable to send reset link. Please try again.')
        }
      }
    )
  }

  return (
    <div className='min-h-screen bg-slate-950'>
      <div className='grid min-h-screen lg:grid-cols-2'>
        <div className='relative hidden overflow-hidden lg:flex'>
          <div className='absolute inset-0 bg-linear-to-br from-slate-950 via-indigo-950 to-slate-900' />
          <div className='absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.35),transparent_0,transparent_35%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.18),transparent_0,transparent_40%)]' />
          <div className='absolute -left-16 top-16 h-56 w-56 rounded-full bg-cyan-400/15 blur-3xl' />
          <div className='absolute bottom-0 right-0 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl' />

          <div className='relative z-10 flex w-full flex-col justify-between p-8 text-white xl:p-12'>
            <div className='inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm backdrop-blur-xl'>
              <Sparkles className='size-4 text-cyan-300' />
              Account recovery
            </div>

            <div className='space-y-8'>
              <div className='space-y-4'>
                <p className='text-sm font-medium uppercase tracking-[0.24em] text-blue-200/80'>Forgot password</p>
                <h1 className='max-w-xl text-4xl font-bold leading-tight xl:text-5xl'>
                  Recover access with a cleaner, secure reset flow.
                </h1>
                <p className='max-w-lg text-base leading-7 text-slate-300 xl:text-lg'>
                  Enter your email and we’ll send you a reset link so you can create a new password in minutes.
                </p>
              </div>

              <div className='grid gap-3'>
                <div className='rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl'>
                  <p className='text-sm font-semibold'>1. Enter your email</p>
                  <p className='mt-1 text-xs text-slate-300'>We’ll prepare a secure recovery link for your account.</p>
                </div>
                <div className='rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl'>
                  <p className='text-sm font-semibold'>2. Check your inbox</p>
                  <p className='mt-1 text-xs text-slate-300'>
                    Open the email and follow the password reset instructions.
                  </p>
                </div>
                <div className='rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl'>
                  <p className='text-sm font-semibold'>3. Set a strong password</p>
                  <p className='mt-1 text-xs text-slate-300'>Choose a fresh password and sign in again safely.</p>
                </div>
              </div>
            </div>

            <div className='rounded-2xl border border-white/10 bg-white/10 p-4 text-sm text-slate-300 backdrop-blur-xl'>
              For privacy, the same message is shown whether the email exists or not.
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

            {submittedEmail ? (
              <div className='space-y-5'>
                <div className='mx-auto flex size-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600'>
                  <MailCheck className='size-8' />
                </div>

                <div className='space-y-2 text-center'>
                  <h2 className='text-2xl font-semibold text-gray-900'>Check your inbox</h2>
                  <p className='text-sm leading-6 text-gray-500'>
                    If an account exists for <span className='font-medium text-gray-700'>{submittedEmail}</span>, a
                    password reset link has been sent.
                  </p>
                </div>

                <div className='rounded-2xl bg-slate-50 p-4 text-sm text-slate-600'>
                  Didn’t receive it? Check your spam folder, or try again with another email address.
                </div>

                <div className='grid gap-3 sm:grid-cols-2'>
                  <Button asChild className='h-11 w-full'>
                    <Link to='/login'>Return to login</Link>
                  </Button>

                  <Button type='button' variant='outline' className='h-11 w-full' onClick={() => setSubmittedEmail('')}>
                    Try another email
                  </Button>
                </div>
              </div>
            ) : (
              <div className='space-y-5'>
                <div className='space-y-3 text-center'>
                  <div className='inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700'>
                    <ShieldCheck className='size-3.5' />
                    Secure reset request
                  </div>

                  <div className='space-y-1'>
                    <h2 className='text-2xl font-semibold text-gray-900'>Forgot your password?</h2>
                    <p className='text-sm text-gray-500'>
                      Enter your account email and we’ll send you a secure reset link.
                    </p>
                  </div>
                </div>

                <div className='grid grid-cols-2 gap-2 text-xs'>
                  <div className='rounded-xl bg-slate-50 px-3 py-2 text-center font-medium text-slate-700'>
                    Fast recovery
                  </div>
                  <div className='rounded-xl bg-slate-50 px-3 py-2 text-center font-medium text-slate-700'>
                    Private flow
                  </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
                  <div className='space-y-2'>
                    <label htmlFor='forgot-password-email' className='text-sm font-medium text-gray-700'>
                      Email
                    </label>
                    <div className='relative'>
                      <Mail className='absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400' />
                      <Input
                        id='forgot-password-email'
                        {...register('email')}
                        type='email'
                        placeholder='you@example.com'
                        autoComplete='email'
                        className='h-11 pl-10'
                        aria-invalid={Boolean(errors.email)}
                      />
                    </div>
                    {errors.email && <p className='text-xs text-red-500'>{errors.email.message}</p>}
                  </div>

                  <div className='rounded-2xl border border-gray-200 bg-gray-50 p-3 text-xs text-gray-600'>
                    We’ll send a secure recovery email if your account exists in the system.
                  </div>

                  <Button
                    type='submit'
                    className='h-11 w-full bg-primary text-white hover:bg-primary/90'
                    disabled={!isValid || forgotPasswordMutation.isPending}
                  >
                    {forgotPasswordMutation.isPending ? (
                      <>
                        <Loader2 className='size-4 animate-spin' />
                        Sending link...
                      </>
                    ) : (
                      'Send reset link'
                    )}
                  </Button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
