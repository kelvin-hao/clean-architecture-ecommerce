import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Separator } from '~/components/ui/separator'
import { registerSchema, type RegisterFormValues } from '~/schemas/register.schema'
import { Link, useNavigate } from 'react-router-dom'
import { useRegister } from '~/hooks/useAuth'
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
    watch,
    formState: { errors, isValid }
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange'
  })

  // eslint-disable-next-line react-hooks/incompatible-library
  const password = watch('password')

  const strength = password?.length > 10 ? 3 : password?.length > 6 ? 2 : password ? 1 : 0

  const onSubmit = (data: RegisterFormValues) => {
    const body: RegisterBody = {
      email: data.email,
      password: data.password,
      name: data.name
    }

    registerMutation.mutate(body, {
      onSuccess: (res) => {
        console.log(res)
        navigate(`/verify-otp?email=${res.email}`)
      },
      onError: (err: ApiError) => {
        console.log(err)
        toast.error(err.message || 'Register failed. Please try again')
      }
    })
  }

  return (
    <div className='w-full max-w-md space-y-6 p-8 rounded-2xl bg-white shadow-xl border border-gray-100'>
      {/* Header */}

      {/* Google Button */}
      <button className='w-full flex items-center justify-center gap-3 border rounded-lg h-11 hover:bg-gray-50 transition'>
        <img src='https://www.svgrepo.com/show/475656/google-color.svg' className='w-5 h-5' />
        <span className='text-sm font-medium'>Continue with Google</span>
      </button>

      {/* Divider */}
      <div className='flex items-center gap-2'>
        <Separator className='flex-1' />
        <span className='text-xs text-gray-400'>OR</span>
        <Separator className='flex-1' />
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
        <Input {...register('name')} placeholder='Full name' />
        {errors.name && <p className='text-xs text-red-500'>{errors.name.message}</p>}
        <Input {...register('email')} placeholder='Email' />
        {errors.email && <p className='text-xs text-red-500'>{errors.email.message}</p>}

        {/* Password */}
        <div className='relative'>
          <Input
            {...register('password')}
            type={showPassword ? 'text' : 'password'}
            placeholder='Password'
            className='pr-10'
          />
          <button
            type='button'
            onClick={() => setShowPassword(!showPassword)}
            className='absolute right-3 top-3 text-gray-400'
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {/* Strength */}
        <div className='flex gap-1'>
          {[1, 2, 3].map((lvl) => (
            <div key={lvl} className={`h-1 flex-1 rounded-full ${strength >= lvl ? 'bg-primary' : 'bg-gray-200'}`} />
          ))}
        </div>
        <Input {...register('confirmPassword')} placeholder='Confirm password' type='password' />
        {errors.confirmPassword && <p className='text-xs text-red-500'>{errors.confirmPassword.message}</p>}
        {/* Submit */}
        <Button
          type='submit'
          className='w-full h-11 bg-primary hover:bg-blue-600  text-white'
          disabled={!isValid || registerMutation.isPending}
        >
          {registerMutation.isPending ? 'Creating...' : 'Create account'}
        </Button>
      </form>

      {/* Footer */}
      <p className='text-sm text-center text-gray-500'>
        Already have an account?{' '}
        <Link to='/login' className='text-blue-600 hover:underline'>
          Sign up
        </Link>
      </p>
    </div>
  )
}
