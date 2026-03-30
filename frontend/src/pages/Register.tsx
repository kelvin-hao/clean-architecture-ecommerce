import { RegisterForm } from '~/features/auth/register-form'

export default function RegisterPage() {
  return (
    <div className='min-h-screen grid lg:grid-cols-2'>
      <div className='relative hidden lg:flex flex-col justify-between overflow-hidden p-12 text-white rounded-r-3xl'>
        <div className='absolute inset-0 bg-linear-to-br from-blue-600 via-indigo-600 to-purple-700' />

        <div className='absolute -top-20 -left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl' />
        <div className='absolute bottom-0 right-0 w-72 h-72 bg-purple-400/20 rounded-full blur-3xl' />

        <div className='absolute inset-0 backdrop-blur-[2px]' />

        <div className='relative z-10 flex flex-col justify-between h-full'>
          <div className='flex items-center gap-2'>
            <div className='p-4 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-lg'>
              Ecommerce
            </div>
          </div>

          <div className='space-y-6'>
            <h2 className='text-4xl xl:text-5xl font-bold leading-tight'>Start your journey with us</h2>

            <p className='text-lg text-blue-100 max-w-md'>
              Discover premium products, lightning-fast checkout, and a seamless shopping experience built for modern
              users.
            </p>

            <div className='flex flex-col gap-3 text-sm text-blue-100'>
              <div className='flex items-center gap-2'>
                <span className='w-2 h-2 bg-white rounded-full' />
                Secure payments
              </div>
              <div className='flex items-center gap-2'>
                <span className='w-2 h-2 bg-white rounded-full' />
                Fast delivery
              </div>
              <div className='flex items-center gap-2'>
                <span className='w-2 h-2 bg-white rounded-full' />
                24/7 support
              </div>
            </div>
          </div>

          <p className='text-sm text-blue-200'>© 2026 YourShop. All rights reserved.</p>
        </div>
      </div>

      <div className='flex items-center justify-center bg-gray-50 p-6'>
        <RegisterForm />
      </div>
    </div>
  )
}
