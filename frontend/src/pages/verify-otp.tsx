import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowLeft, Loader2, MailCheck, RefreshCcw, ShieldCheck } from 'lucide-react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'

import { Button } from '~/components/ui/button'
import { useSendOtp, useVerifyOtp } from '~/hooks/useAuth'
import { toast } from 'sonner'
import type { ApiError } from '~/types'

const OTP_LENGTH = 6

export default function VerifyOtpPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const email = (searchParams.get('email') || '').trim()
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''))
  const [timeLeft, setTimeLeft] = useState(60)
  const [redirectCountdown, setRedirectCountdown] = useState<number | null>(null)

  const inputsRef = useRef<(HTMLInputElement | null)[]>([])

  const verifyMutation = useVerifyOtp()
  const resendMutation = useSendOtp()

  const isOtpComplete = useMemo(() => otp.every((digit) => digit !== ''), [otp])

  useEffect(() => {
    inputsRef.current[0]?.focus()
  }, [])

  useEffect(() => {
    if (timeLeft <= 0) return

    const timer = window.setInterval(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)

    return () => window.clearInterval(timer)
  }, [timeLeft])

  useEffect(() => {
    if (redirectCountdown === null) return

    if (redirectCountdown <= 0) {
      navigate('/login')
      return
    }

    const redirectTimer = window.setTimeout(() => {
      setRedirectCountdown((prev) => (prev === null ? null : prev - 1))
    }, 1000)

    return () => window.clearTimeout(redirectTimer)
  }, [redirectCountdown, navigate])

  const handleChange = (value: string, index: number) => {
    const digits = value.replace(/\D/g, '')
    if (!digits) {
      const nextOtp = [...otp]
      nextOtp[index] = ''
      setOtp(nextOtp)
      return
    }

    const nextOtp = [...otp]

    if (digits.length > 1) {
      digits
        .slice(0, OTP_LENGTH)
        .split('')
        .forEach((digit, digitIndex) => {
          nextOtp[digitIndex] = digit
        })

      setOtp(nextOtp)
      inputsRef.current[Math.min(digits.length, OTP_LENGTH) - 1]?.focus()
      return
    }

    nextOtp[index] = digits
    setOtp(nextOtp)

    if (index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (event.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus()
    }

    if (event.key === 'ArrowLeft' && index > 0) {
      inputsRef.current[index - 1]?.focus()
    }

    if (event.key === 'ArrowRight' && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus()
    }

    if (event.key === 'Enter') {
      handleVerify()
    }
  }

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault()
    const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH)

    if (!pasted) return

    const nextOtp = Array(OTP_LENGTH).fill('')
    pasted.split('').forEach((digit, index) => {
      nextOtp[index] = digit
    })

    setOtp(nextOtp)
    inputsRef.current[Math.min(pasted.length, OTP_LENGTH) - 1]?.focus()
  }

  const handleVerify = () => {
    if (!email) {
      toast.error('Missing email address. Please register again.')
      navigate('/register')
      return
    }

    const finalOtp = otp.join('')

    if (finalOtp.length < OTP_LENGTH) {
      toast.error('Please enter the full 6-digit OTP')
      return
    }

    verifyMutation.mutate(
      { email, otp: finalOtp },
      {
        onSuccess: () => {
          toast.success('Email verified successfully 🎉 You will be redirected to login in 10 seconds.')
          setRedirectCountdown(10)
        },
        onError: (err: ApiError) => {
          toast.error(err.message || 'Invalid or expired OTP')
        }
      }
    )
  }

  const handleResend = () => {
    if (!email) {
      toast.error('Missing email address. Please register again.')
      navigate('/register')
      return
    }

    resendMutation.mutate(email, {
      onSuccess: (res) => {
        toast.success(`A new OTP was sent to ${res.email}`)
        setTimeLeft(res.expiredIn || 60)
        setOtp(Array(OTP_LENGTH).fill(''))
        inputsRef.current[0]?.focus()
      },
      onError: (err: ApiError) => {
        toast.error(err.message || 'Unable to resend OTP')
      }
    })
  }

  const formattedTime = `${String(Math.floor(timeLeft / 60)).padStart(2, '0')}:${String(timeLeft % 60).padStart(2, '0')}`

  return (
    <div className='min-h-screen bg-slate-950'>
      <div className='grid min-h-screen lg:grid-cols-2'>
        <div className='relative hidden overflow-hidden lg:flex'>
          <div className='absolute inset-0 bg-linear-to-br from-slate-950 via-indigo-950 to-slate-900' />
          <div className='absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.35),transparent_0,transparent_35%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.25),transparent_0,transparent_40%)]' />
          <div className='relative z-10 flex h-full flex-col justify-between p-10 text-white xl:p-14'>
            <div className='inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm backdrop-blur-xl'>
              <ShieldCheck className='size-4 text-cyan-300' />
              Secure verification
            </div>

            <div className='space-y-6'>
              <div className='space-y-3'>
                <p className='text-sm font-medium uppercase tracking-[0.24em] text-blue-200/80'>One more step</p>
                <h1 className='max-w-xl text-4xl font-bold leading-tight xl:text-5xl'>
                  Confirm your email to activate your account.
                </h1>
                <p className='max-w-lg text-base leading-7 text-slate-300 xl:text-lg'>
                  We sent a 6-digit code to your inbox. Enter it below to verify your account and continue securely.
                </p>
              </div>

              <div className='grid gap-3 sm:grid-cols-2'>
                <div className='rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl'>
                  <p className='text-sm font-semibold'>Fast verification</p>
                  <p className='mt-1 text-xs text-slate-300'>Complete account activation in under a minute.</p>
                </div>
                <div className='rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl'>
                  <p className='text-sm font-semibold'>Protected access</p>
                  <p className='mt-1 text-xs text-slate-300'>Your email is confirmed before first login.</p>
                </div>
              </div>
            </div>

            <div className='rounded-2xl border border-white/10 bg-white/10 p-4 text-sm text-slate-300 backdrop-blur-xl'>
              Tip: you can paste the full OTP code directly into any box.
            </div>
          </div>
        </div>

        <div className='flex items-center justify-center bg-gray-50 p-4 sm:p-6'>
          <div className='w-full max-w-md space-y-6 rounded-3xl border border-gray-100 bg-white p-8 shadow-2xl'>
            <Link
              to='/register'
              className='inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-800'
            >
              <ArrowLeft className='size-4' />
              Back to register
            </Link>

            <div className='space-y-3 text-center'>
              <div className='mx-auto flex size-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600'>
                <MailCheck className='size-7' />
              </div>

              <div className='space-y-1'>
                <h2 className='text-2xl font-semibold text-gray-900'>Verify your email</h2>
                <p className='text-sm text-gray-500'>
                  Enter the 6-digit code sent to{' '}
                  <span className='font-semibold text-gray-700'>{email || 'your email'}</span>
                </p>
              </div>
            </div>

            {!email && (
              <div className='rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700'>
                Email is missing from the link. Please register again to receive a new OTP.
              </div>
            )}

            <div className='space-y-3'>
              <div className='flex justify-between gap-2'>
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      inputsRef.current[index] = el
                    }}
                    value={digit}
                    onChange={(event) => handleChange(event.target.value, index)}
                    onKeyDown={(event) => handleKeyDown(event, index)}
                    onPaste={handlePaste}
                    inputMode='numeric'
                    maxLength={1}
                    className='h-14 w-12 rounded-2xl border border-gray-200 text-center text-lg font-semibold text-gray-900 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10 sm:w-14'
                  />
                ))}
              </div>

              <p className='text-center text-xs text-gray-500'>
                Use the code from your email. The code expires for security reasons.
              </p>
            </div>

            <Button
              onClick={handleVerify}
              disabled={!email || !isOtpComplete || verifyMutation.isPending || redirectCountdown !== null}
              className='h-11 w-full rounded-xl bg-primary text-white hover:bg-primary/90 disabled:opacity-50'
            >
              {verifyMutation.isPending ? (
                <>
                  <Loader2 className='size-4 animate-spin' />
                  Verifying...
                </>
              ) : redirectCountdown !== null ? (
                `Redirecting to login in ${redirectCountdown}s...`
              ) : (
                'Verify email'
              )}
            </Button>

            {redirectCountdown !== null && (
              <div className='rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700'>
                Account verified successfully. Redirecting to the login page in{' '}
                <span className='font-semibold'>{redirectCountdown}s</span>.
              </div>
            )}

            <div className='rounded-2xl bg-gray-50 p-4 text-center'>
              <p className='text-sm text-gray-600'>Didn’t get the code?</p>

              {timeLeft > 0 ? (
                <p className='mt-1 text-sm font-medium text-gray-900'>Resend available in {formattedTime}</p>
              ) : (
                <button
                  type='button'
                  onClick={handleResend}
                  disabled={!email || resendMutation.isPending}
                  className='mt-2 inline-flex items-center gap-2 font-medium text-primary hover:underline disabled:opacity-50'
                >
                  {resendMutation.isPending ? (
                    <Loader2 className='size-4 animate-spin' />
                  ) : (
                    <RefreshCcw className='size-4' />
                  )}
                  Resend OTP
                </button>
              )}
            </div>

            <p className='text-center text-sm text-gray-500'>
              Wrong email?{' '}
              <Link to='/register' className='font-medium text-blue-600 hover:underline'>
                Create account again
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
