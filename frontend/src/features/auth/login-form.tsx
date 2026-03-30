import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router-dom'

import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Separator } from '~/components/ui/separator'

import { loginSchema, type LoginFormValues } from '~/schemas/login.schema'

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid }
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange'
  })

  const onSubmit = (data: LoginFormValues) => {
    console.log('LOGIN', data)
  }

  return (
    <div className='w-full max-w-md space-y-6 p-8 rounded-2xl bg-white shadow-xl border border-gray-100'>
      {/* Header */}
      <div className='space-y-1 text-center'>
        <h1 className='text-2xl font-semibold'>Welcome back 👋</h1>
        <p className='text-sm text-gray-500'>Login to continue your journey</p>
      </div>

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
        {/* Email */}
        <div>
          <Input {...register('email')} placeholder='Email' />
          {errors.email && <p className='text-xs text-red-500 mt-1'>{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div>
          <div className='relative flex'>
            <Input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              placeholder='Password'
              className='pr-10 '
            />
            <button
              type='button'
              onClick={() => setShowPassword(!showPassword)}
              className='absolute right-3 top-3 text-gray-400 mb-10 '
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {errors.password && <p className='text-xs text-red-500 mt-1'>{errors.password.message}</p>}
        </div>

        {/* Forgot password */}
        <div className='flex justify-end'>
          <Link to='/forgot-password' className='text-sm text-blue-600 hover:underline'>
            Forgot password?
          </Link>
        </div>

        {/* Submit */}
        <Button
          type='submit'
          className='w-full h-11 bg-primary hover:bg-primary/90 text-white'
          disabled={!isValid || isSubmitting}
        >
          {isSubmitting ? 'Logging in...' : 'Login'}
        </Button>
      </form>

      {/* Footer */}
      <p className='text-sm text-center text-gray-500'>
        Don’t have an account?{' '}
        <Link to='/register' className='text-blue-600  hover:underline'>
          Sign up
        </Link>
      </p>
    </div>
  )
}
