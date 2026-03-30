import { useEffect, useRef, useState } from 'react'
import { useVerifyOtp, useSendOtp } from '~/hooks/useAuth'
import { toast } from 'sonner'
import { Button } from '~/components/ui/button'
import type { ApiError } from '~/types'
import { useSearchParams } from 'react-router-dom'

export default function VerifyOtpPage() {
  const [searchParams] = useSearchParams()
  const email = searchParams.get('email') || ''
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''))
  const [timeLeft, setTimeLeft] = useState(60)

  const inputsRef = useRef<(HTMLInputElement | null)[]>([])

  const verifyMutation = useVerifyOtp()
  const resendMutation = useSendOtp()

  // ⏱ countdown
  useEffect(() => {
    if (timeLeft <= 0) return
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [timeLeft])

  // 🔢 handle input
  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus()
    }
  }

  const handleVerify = () => {
    const finalOtp = otp.join('')

    if (finalOtp.length < 6) {
      toast.error('Please enter full OTP')
      return
    }

    verifyMutation.mutate(
      { email, otp: finalOtp },
      {
        onSuccess: () => {
          toast.success('Email verified 🎉')
          window.location.href = '/login'
        },
        onError: (err: ApiError) => {
          toast.error(err.message || 'Invalid OTP')
        }
      }
    )
  }

  const handleResend = () => {
    resendMutation.mutate(email, {
      onSuccess: () => {
        toast.success('OTP resent')
        setTimeLeft(60)
      }
    })
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 p-4'>
      <div className='w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6 border border-gray-100'>
        {/* Header */}
        <div className='text-center space-y-2'>
          <h1 className='text-2xl font-semibold'>Verify your email</h1>
          <p className='text-sm text-gray-500'>
            Enter the 6-digit code sent to <span className='font-medium'>{email}</span>
          </p>
        </div>

        {/* OTP INPUT */}
        <div className='flex justify-between gap-2'>
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputsRef.current[index] = el
              }}
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              className='w-12 h-14 text-center border rounded-xl'
            />
          ))}
        </div>

        {/* Verify button */}
        <Button
          onClick={handleVerify}
          disabled={verifyMutation.isPending}
          className='w-full h-11 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition disabled:opacity-50'
        >
          {verifyMutation.isPending ? 'Verifying...' : 'Verify'}
        </Button>

        {/* Resend */}
        <div className='text-center text-sm text-gray-500'>
          {timeLeft > 0 ? (
            <p>
              Resend OTP in <span className='font-medium'>{timeLeft}s</span>
            </p>
          ) : (
            <button onClick={handleResend} className='text-primary font-medium hover:underline'>
              Resend OTP
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
