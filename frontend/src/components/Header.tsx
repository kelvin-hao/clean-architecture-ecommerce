import { Bell, ChevronDown, Heart, LayoutGrid, Search, ShoppingCart, Sparkles, Store, UserRound } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import type { AuthUser } from '~/types/auth.type'

type HeaderProps = {
  user?: AuthUser | null
}

const quickLinks = ['Deals', 'Vendors', 'Categories', 'New arrivals']

export function Header({ user }: HeaderProps) {
  return (
    <header className='sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl'>
      <div className='mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8'>
        <div className='flex flex-col gap-3'>
          <div className='flex flex-wrap items-center justify-between gap-3'>
            <div className='flex items-center gap-3'>
              <Link to='/' className='flex items-center gap-3'>
                <div className='flex size-10 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg shadow-slate-900/15'>
                  <Store className='size-5' />
                </div>

                <div>
                  <p className='text-base font-bold text-slate-900'>VendorVerse</p>
                  <p className='text-xs text-slate-500'>Multi-vendor marketplace</p>
                </div>
              </Link>

              <div className='hidden items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 md:inline-flex'>
                <Sparkles className='size-3.5' />
                Trusted sellers · Fast delivery
              </div>
            </div>

            <div className='flex items-center gap-2'>
              <Button variant='ghost' size='icon-sm' className='rounded-full'>
                <Heart className='size-4' />
              </Button>
              <Button variant='ghost' size='icon-sm' className='rounded-full'>
                <Bell className='size-4' />
              </Button>
              <Button variant='outline' className='hidden h-10 rounded-full md:inline-flex'>
                <ShoppingCart className='size-4' />
                Cart (2)
              </Button>

              <Button asChild variant='outline' className='h-10 rounded-full px-3'>
                <Link to='/profile'>
                  <UserRound className='size-4' />
                  <span className='max-w-28 truncate'>{user?.name || user?.email || 'Account'}</span>
                  <ChevronDown className='size-4 text-slate-500' />
                </Link>
              </Button>
            </div>
          </div>

          <div className='flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between'>
            <div className='flex flex-1 items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2'>
              <Search className='size-4 text-slate-400' />
              <Input
                placeholder='Search products, brands, and vendors...'
                className='h-9 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0'
              />
            </div>

            <div className='flex flex-wrap items-center gap-2'>
              <Button variant='outline' className='h-10 rounded-full'>
                <LayoutGrid className='size-4' />
                Browse categories
              </Button>

              {quickLinks.map((item) => (
                <button
                  key={item}
                  type='button'
                  className='rounded-full px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900'
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
