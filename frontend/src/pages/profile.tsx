import { useState } from 'react'
import { BadgeCheck, Home, Package, Settings, User } from 'lucide-react'

import { Header } from '~/components/Header'
import { useProfile } from '~/hooks/useAuth'
import { useAuthStore } from '~/store/auth.store'
import Information from '~/components/profile/Information'
import Order from '~/components/profile/Order'
import Address from '~/components/profile/Address'
import Setting from '~/components/profile/Setting'

type TabType = 'profile' | 'orders' | 'addresses' | 'settings'

export default function ProfilePage() {
  const storedUser = useAuthStore((s) => s.user)
  const profileQuery = useProfile()

  const user = profileQuery.data ?? storedUser

  const [activeTab, setActiveTab] = useState<TabType>('profile')

  const displayName = user?.name || user?.email?.split('@')[0] || 'Customer'
  const primaryRole = user?.roles?.[0] || 'customer'
  const avatarLetter = displayName.charAt(0).toUpperCase() || 'C'

  return (
    <div className='min-h-screen bg-linear-to-br from-slate-50 via-white to-blue-50'>
      <Header user={user} />

      <main className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
        {/* Hero Section */}
        <section className='mb-8 overflow-hidden rounded-3xl bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl'>
          <div className='relative overflow-hidden px-6 py-12 sm:px-8 sm:py-14'>
            {/* Background decorations */}
            <div className='absolute inset-0 opacity-20'>
              <div className='absolute -right-32 -top-32 h-96 w-96 rounded-full bg-blue-500 blur-3xl' />
              <div className='absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-purple-500 blur-3xl' />
            </div>

            <div className='relative z-10'>
              {/* Avatar & Info */}
              <div className='flex items-start gap-6'>
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={displayName}
                    className='size-28 rounded-3xl object-cover ring-4 ring-white/20 shadow-2xl'
                  />
                ) : (
                  <div className='flex size-28 items-center justify-center rounded-3xl bg-linear-to-br from-blue-500 to-purple-500 text-4xl font-bold ring-4 ring-white/20 shadow-2xl'>
                    {avatarLetter}
                  </div>
                )}

                <div className='space-y-3'>
                  <div className='inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold backdrop-blur-md'>
                    <BadgeCheck className='size-3.5 text-cyan-300' />
                    Verified Member
                  </div>
                  <div>
                    <h1 className='text-3xl font-bold sm:text-4xl'>{displayName}</h1>
                    <p className='mt-1 text-slate-300'>{user?.email || 'No email available'}</p>
                  </div>
                  <div className='flex flex-wrap items-center gap-2 text-xs'>
                    <span className='rounded-full bg-emerald-400/20 px-3 py-1 font-semibold text-emerald-100'>
                      {primaryRole === 'user' ? '🛍️ Buyer' : '🏪 vendor'}
                    </span>
                    {user?.two_FA ? (
                      <span className='rounded-full bg-cyan-400/20 px-3 py-1 font-semibold text-cyan-100'>
                        🔒 2FA Enabled
                      </span>
                    ) : (
                      <span className='rounded-full bg-orange-400/20 px-3 py-1 font-semibold text-orange-100'>
                        🔓 2FA Disabled
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tab Navigation */}
        <div className='mb-6 border-b border-slate-200 rounded-t-3xl bg-white'>
          <div className='flex overflow-x-auto'>
            <button
              onClick={() => setActiveTab('profile')}
              className={` cursor-pointer inline-flex items-center gap-2 border-b-2 px-6 py-4 text-sm font-semibold transition-colors whitespace-nowrap ${
                activeTab === 'profile'
                  ? 'border-slate-900 text-slate-900'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className='size-4' />
              Profile
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={` cursor-pointer inline-flex items-center gap-2 border-b-2 px-6 py-4 text-sm font-semibold transition-colors whitespace-nowrap ${
                activeTab === 'orders'
                  ? 'border-slate-900 text-slate-900'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Package className='size-4' />
              Orders
            </button>
            <button
              onClick={() => setActiveTab('addresses')}
              className={` cursor-pointer  inline-flex items-center gap-2 border-b-2 px-6 py-4 text-sm font-semibold transition-colors whitespace-nowrap ${
                activeTab === 'addresses'
                  ? 'border-slate-900 text-slate-900'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Home className='size-4' />
              Addresses
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={` cursor-pointer inline-flex items-center gap-2 border-b-2 px-6 py-4 text-sm font-semibold transition-colors whitespace-nowrap ${
                activeTab === 'settings'
                  ? 'border-slate-900 text-slate-900'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Settings className='size-4' />
              Settings
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className='rounded-b-3xl bg-white shadow-sm'>
          {/* Profile Tab */}
          {activeTab === 'profile' && <Information />}

          {/* Orders Tab */}
          {activeTab === 'orders' && <Order />}

          {/* Addresses Tab */}
          {activeTab === 'addresses' && <Address />}

          {/* Settings Tab */}
          {activeTab === 'settings' && <Setting />}
        </div>
      </main>
    </div>
  )
}
