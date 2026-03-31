import { ArrowRight, BadgeCheck, Package, ShieldCheck, ShoppingCart, Truck } from 'lucide-react'
import { RegisterForm } from '~/features/auth/register-form'

export default function RegisterPage() {
  return (
    <div className='grid min-h-screen lg:grid-cols-2'>
      <div className='relative hidden overflow-hidden bg-slate-950 lg:flex'>
        <div className='absolute inset-0 bg-linear-to-br from-slate-950 via-indigo-950 to-slate-900' />
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(96,165,250,0.35),transparent_0,transparent_35%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.28),transparent_0,transparent_38%)]' />
        <div className='absolute -left-16 top-16 h-56 w-56 rounded-full bg-cyan-400/15 blur-3xl' />
        <div className='absolute bottom-0 right-0 h-72 w-72 rounded-full bg-fuchsia-500/10 blur-3xl' />

        <div className='relative z-10 flex w-full flex-col justify-between p-8 text-white xl:p-12'>
          <div className='flex items-center justify-between gap-4'>
            <div className='inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 backdrop-blur-xl'>
              <ShoppingCart className='size-4 text-cyan-300' />
              <span className='text-sm font-semibold tracking-wide'>Shoppe</span>
            </div>

            <div className='rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-200'>
              New shopping experience
            </div>
          </div>

          <div className='space-y-8'>
            <div className='space-y-4'>
              <p className='text-sm font-medium uppercase tracking-[0.24em] text-blue-200/80'>Create account</p>

              <h2 className='max-w-xl text-4xl font-bold leading-tight xl:text-5xl'>
                Shop smarter with a modern, faster, and secure experience.
              </h2>

              <p className='max-w-xl text-base leading-7 text-slate-300 xl:text-lg'>
                Join thousands of customers managing orders, tracking delivery, and discovering products in one clean
                dashboard.
              </p>
            </div>

            <div className='grid gap-3 sm:grid-cols-3'>
              <div className='rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl'>
                <ShieldCheck className='mb-3 size-5 text-cyan-300' />
                <p className='text-sm font-semibold'>Secure checkout</p>
                <p className='mt-1 text-xs text-slate-300'>Protected payments and verified sign-in.</p>
              </div>

              <div className='rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl'>
                <Truck className='mb-3 size-5 text-violet-300' />
                <p className='text-sm font-semibold'>Fast delivery</p>
                <p className='mt-1 text-xs text-slate-300'>Track orders in real time after checkout.</p>
              </div>

              <div className='rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl'>
                <Package className='mb-3 size-5 text-emerald-300' />
                <p className='text-sm font-semibold'>Premium catalog</p>
                <p className='mt-1 text-xs text-slate-300'>Explore curated products with ease.</p>
              </div>
            </div>

            <div className='rounded-[28px] border border-white/10 bg-white/10 p-5 backdrop-blur-2xl shadow-2xl shadow-cyan-950/20'>
              <div className='mb-4 flex items-center justify-between'>
                <div>
                  <p className='text-sm text-slate-300'>Trusted by modern shoppers</p>
                  <p className='text-xl font-semibold'>Everything you need in one place</p>
                </div>

                <div className='flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs text-cyan-100'>
                  <BadgeCheck className='size-3.5 text-cyan-300' />
                  Verified platform
                </div>
              </div>

              <div className='grid grid-cols-3 gap-3'>
                <div className='rounded-2xl bg-slate-900/40 p-3'>
                  <p className='text-2xl font-bold'>12k+</p>
                  <p className='mt-1 text-xs text-slate-300'>active customers</p>
                </div>
                <div className='rounded-2xl bg-slate-900/40 p-3'>
                  <p className='text-2xl font-bold'>99.9%</p>
                  <p className='mt-1 text-xs text-slate-300'>checkout uptime</p>
                </div>
                <div className='rounded-2xl bg-slate-900/40 p-3'>
                  <p className='text-2xl font-bold'>24/7</p>
                  <p className='mt-1 text-xs text-slate-300'>support care</p>
                </div>
              </div>
            </div>
          </div>

          <div className='flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300 backdrop-blur-xl'>
            <p>Start now and verify your email in less than a minute.</p>
            <div className='flex items-center gap-2 font-medium text-white'>
              Quick onboarding
              <ArrowRight className='size-4' />
            </div>
          </div>
        </div>
      </div>

      <div className='flex items-center justify-center bg-gray-50 p-6 sm:p-8'>
        <RegisterForm />
      </div>
    </div>
  )
}
