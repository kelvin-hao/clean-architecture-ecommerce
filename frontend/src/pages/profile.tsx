import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useMemo, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import {
  BadgeCheck,
  AlertCircle,
  CheckCircle,
  CreditCard,
  Heart,
  Home,
  Loader2,
  LogOut,
  Mail,
  MapPin,
  Package,
  PencilLine,
  Phone,
  Plus,
  Save,
  Settings,
  Shield,
  ShieldCheck,
  ShoppingBag,
  Store,
  Trash2,
  Trophy,
  Upload,
  User,
  UserRound,
  X
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

import { Header } from '~/components/Header'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { useLogout, useProfile, useUpdateProfile } from '~/hooks/useAuth'
import { useMyVendor, useRegisterVendor } from '~/hooks/useVendor'
import { uploadApi } from '~/apis/upload.api'
import { profileSchema, type ProfileFormValues } from '~/schemas/profile.schema'
import { vendorRegistrationSchema, type VendorRegistrationFormValues } from '~/schemas/vendor.schema'
import { useAuthStore } from '~/store/auth.store'
import type { AuthUser } from '~/types/auth.type'
import type { ApiError } from '~/types'

type TabType = 'profile' | 'orders' | 'addresses' | 'settings'

const stats = [
  { label: 'Total spent', value: '$4,250', icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Saved items', value: '12', icon: Heart, color: 'text-rose-600', bg: 'bg-rose-50' },
  { label: 'Member since', value: '2 years', icon: Trophy, color: 'text-amber-600', bg: 'bg-amber-50' }
]

const sampleOrders = [
  { id: '1', date: 'Jan 15, 2025', total: '$89.99', status: 'Delivered', items: 3 },
  { id: '2', date: 'Jan 10, 2025', total: '$125.50', status: 'Shipped', items: 2 },
  { id: '3', date: 'Jan 5, 2025', total: '$45.00', status: 'Delivered', items: 1 }
]

const sampleAddresses = [
  {
    id: 1,
    label: 'Home',
    name: 'John Doe',
    street: '123 Main Street',
    city: 'Ho Chi Minh City',
    state: 'HCM',
    zip: '700000',
    phone: '+84 123 456 789',
    isDefault: true
  }
]

const paymentMethods = [
  { id: 1, type: 'Visa', last4: '4242', expiry: '12/25', label: 'Primary' },
  { id: 2, type: 'Mastercard', last4: '5555', expiry: '08/26', label: '' }
]

const getProfileFormValues = (user?: AuthUser | null): ProfileFormValues => ({
  name: user?.name || user?.email?.split('@')[0] || '',
  phone_number: user?.phone_number || '',
  avatar: user?.avatar || ''
})

export default function ProfilePage() {
  const navigate = useNavigate()
  const storedUser = useAuthStore((s) => s.user)
  const setUser = useAuthStore((s) => s.setUser)
  const logoutMutation = useLogout()
  const profileQuery = useProfile()
  const updateProfileMutation = useUpdateProfile()
  const vendorQuery = useMyVendor()
  const registerVendorMutation = useRegisterVendor()
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState<TabType>('profile')
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [showPaymentForm, setShowPaymentForm] = useState(false)
  const [showVendorForm, setShowVendorForm] = useState(false)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)

  const user = profileQuery.data ?? storedUser
  const formDefaults = useMemo(() => getProfileFormValues(user), [user])

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty }
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: formDefaults
  })

  const {
    register: registerVendor,
    handleSubmit: handleVendorSubmit,
    reset: resetVendorForm,
    formState: { errors: vendorErrors, isSubmitting: isSubmittingVendor }
  } = useForm<VendorRegistrationFormValues>({
    resolver: zodResolver(vendorRegistrationSchema),
    defaultValues: {
      shop_name: '',
      description: ''
    }
  })

  useEffect(() => {
    if (profileQuery.data) {
      setUser(profileQuery.data)
    }
  }, [profileQuery.data, setUser])

  useEffect(() => {
    reset(formDefaults)
  }, [formDefaults, reset])

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success('Logged out successfully')
        navigate('/login', { replace: true })
      },
      onError: (error: ApiError) => {
        toast.error(error.message || 'Session ended. Redirecting to login.')
        navigate('/login', { replace: true })
      }
    })
  }

  const handleCancelEdit = () => {
    reset(formDefaults)
    setIsEditing(false)
  }

  const handleAvatarUpload = async (file: File) => {
    try {
      setIsUploadingAvatar(true)
      const uploadedUrl = await uploadApi.uploadImage(file)

      // Update the form value with the uploaded URL
      const event = new Event('input', { bubbles: true })
      const input = document.querySelector('input[name="avatar"]') as HTMLInputElement
      if (input) {
        input.value = uploadedUrl
        input.dispatchEvent(event)
      }

      toast.success('Avatar uploaded successfully')
    } catch (error) {
      toast.error('Failed to upload avatar. Please try again.')
      console.error('Avatar upload error:', error)
    } finally {
      setIsUploadingAvatar(false)
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file')
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB')
        return
      }

      handleAvatarUpload(file)
    }
  }

  const handleDragDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()

    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) {
      if (file.size <= 5 * 1024 * 1024) {
        handleAvatarUpload(file)
      } else {
        toast.error('Image size must be less than 5MB')
      }
    } else {
      toast.error('Please drop a valid image file')
    }
  }

  const onSubmit = (values: ProfileFormValues) => {
    updateProfileMutation.mutate(
      {
        name: values.name.trim(),
        phone_number: values.phone_number.trim() || undefined,
        avatar: values.avatar.trim() || undefined
      },
      {
        onSuccess: ({ user: updatedUser }) => {
          reset(getProfileFormValues(updatedUser))
          setIsEditing(false)
          toast.success('Profile updated successfully')
        },
        onError: (error: ApiError) => {
          toast.error(error.message || 'Could not update profile. Please try again.')
        }
      }
    )
  }

  const onVendorSubmit = (values: VendorRegistrationFormValues) => {
    registerVendorMutation.mutate(values, {
      onSuccess: () => {
        resetVendorForm()
        setShowVendorForm(false)
        vendorQuery.refetch()
        toast.success('Vendor application submitted successfully!')
      },
      onError: (error) => {
        const apiError = error as unknown as ApiError
        toast.error(apiError?.message || 'Failed to submit vendor application. Please try again.')
      }
    })
  }

  const avatarValue = useWatch({
    control,
    name: 'avatar'
  })

  const displayName = user?.name || user?.email?.split('@')[0] || 'Customer'
  const primaryRole = user?.roles?.[0] || 'customer'
  const avatarLetter = displayName.charAt(0).toUpperCase() || 'C'
  const avatarPreview = avatarValue?.trim() || user?.avatar

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-100 text-emerald-700'
      case 'Shipped':
        return 'bg-amber-100 text-amber-700'
      case 'Processing':
        return 'bg-blue-100 text-blue-700'
      default:
        return 'bg-slate-100 text-slate-700'
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50'>
      <Header user={user} />

      <main className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
        {/* Hero Section */}
        <section className='mb-8 overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl'>
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
                  <div className='flex size-28 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-500 to-purple-500 text-4xl font-bold ring-4 ring-white/20 shadow-2xl'>
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
                      {primaryRole === 'customer' ? '🛍️ Buyer' : '🏪 Seller'}
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
                    <span className='rounded-full bg-blue-400/20 px-3 py-1 font-semibold text-blue-100'>⭐ Member</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Cards */}
        <section className='mb-8 grid gap-4 md:grid-cols-3'>
          {stats.map((item) => {
            const Icon = item.icon
            return (
              <div
                key={item.label}
                className='rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-1'
              >
                <div className='flex items-center gap-4'>
                  <div className={`rounded-2xl ${item.bg} p-3`}>
                    <Icon className={`size-6 ${item.color}`} />
                  </div>
                  <div>
                    <p className='text-sm font-medium text-slate-600'>{item.label}</p>
                    <p className='text-2xl font-bold text-slate-900'>{item.value}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </section>

        {/* Tab Navigation */}
        <div className='mb-6 border-b border-slate-200 rounded-t-3xl bg-white'>
          <div className='flex overflow-x-auto'>
            <button
              onClick={() => setActiveTab('profile')}
              className={`inline-flex items-center gap-2 border-b-2 px-6 py-4 text-sm font-semibold transition-colors whitespace-nowrap ${
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
              className={`inline-flex items-center gap-2 border-b-2 px-6 py-4 text-sm font-semibold transition-colors whitespace-nowrap ${
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
              className={`inline-flex items-center gap-2 border-b-2 px-6 py-4 text-sm font-semibold transition-colors whitespace-nowrap ${
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
              className={`inline-flex items-center gap-2 border-b-2 px-6 py-4 text-sm font-semibold transition-colors whitespace-nowrap ${
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
          {activeTab === 'profile' && (
            <div className='space-y-8 p-6 md:p-8'>
              <div>
                <div className='flex items-center justify-between mb-6'>
                  <div>
                    <h2 className='mb-1 text-xl font-bold text-slate-900'>Personal Information</h2>
                    <p className='text-sm text-slate-600'>Update your account details and profile information</p>
                  </div>
                  <Button
                    type='button'
                    variant={isEditing ? 'destructive' : 'default'}
                    className='h-10 rounded-lg font-semibold whitespace-nowrap'
                    onClick={() => (isEditing ? handleCancelEdit() : setIsEditing(true))}
                  >
                    {isEditing ? <X className='size-4 mr-2' /> : <PencilLine className='size-4 mr-2' />}
                    {isEditing ? 'Cancel' : 'Edit Profile'}
                  </Button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                  <div className='grid gap-6 md:grid-cols-2'>
                    <div className='space-y-2'>
                      <label className='block text-sm font-semibold text-slate-700'>Full Name</label>
                      <Input
                        {...register('name')}
                        disabled={!isEditing || updateProfileMutation.isPending}
                        aria-invalid={Boolean(errors.name)}
                        className='h-11 rounded-xl'
                        placeholder='Enter your full name'
                      />
                      {errors.name && <p className='text-sm text-red-600'>{errors.name.message}</p>}
                    </div>

                    <div className='space-y-2'>
                      <label className='block text-sm font-semibold text-slate-700'>Email Address</label>
                      <Input
                        value={user?.email || ''}
                        disabled
                        className='h-11 rounded-xl bg-slate-100 text-slate-600'
                      />
                      <p className='text-xs text-slate-500'>Email is managed from your account sign-in settings</p>
                    </div>

                    <div className='space-y-2'>
                      <label className='block text-sm font-semibold text-slate-700'>Phone Number</label>
                      <Input
                        {...register('phone_number')}
                        disabled={!isEditing || updateProfileMutation.isPending}
                        aria-invalid={Boolean(errors.phone_number)}
                        className='h-11 rounded-xl'
                        placeholder='+84 123 456 789'
                      />
                      {errors.phone_number && <p className='text-sm text-red-600'>{errors.phone_number.message}</p>}
                    </div>

                    <div className='space-y-2 md:col-span-2'>
                      <label className='block text-sm font-semibold text-slate-700'>Profile Picture</label>

                      {/* Drag & Drop Upload Area */}
                      <div
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleDragDrop}
                        className={`relative rounded-2xl border-2 border-dashed p-8 transition-colors ${
                          isEditing && !updateProfileMutation.isPending
                            ? 'border-slate-300 bg-slate-50 hover:border-blue-400 hover:bg-blue-50 cursor-pointer'
                            : 'border-slate-200 bg-slate-50'
                        }`}
                      >
                        <input
                          type='file'
                          accept='image/*'
                          onChange={handleFileInputChange}
                          disabled={!isEditing || updateProfileMutation.isPending || isUploadingAvatar}
                          className='absolute inset-0 opacity-0 cursor-pointer'
                        />

                        <div className='text-center'>
                          {isUploadingAvatar ? (
                            <>
                              <Loader2 className='size-8 mx-auto mb-2 text-blue-600 animate-spin' />
                              <p className='text-sm font-semibold text-slate-900'>Uploading image...</p>
                            </>
                          ) : (
                            <>
                              <div className='mb-3 inline-flex items-center justify-center rounded-full bg-blue-100 p-3'>
                                <Upload className='size-6 text-blue-600' />
                              </div>
                              <p className='font-semibold text-slate-900'>
                                {isEditing ? 'Drag and drop your image here' : 'Edit profile to upload image'}
                              </p>
                              <p className='mt-1 text-sm text-slate-600'>or click to select file</p>
                              <p className='mt-3 text-xs text-slate-500'>PNG, JPG, GIF up to 5MB</p>
                            </>
                          )}
                        </div>
                      </div>
                      {errors.avatar && <p className='text-sm text-red-600'>{errors.avatar.message}</p>}

                      {/* Hidden input to store avatar URL */}
                      <input type='hidden' {...register('avatar')} aria-invalid={Boolean(errors.avatar)} />
                    </div>
                  </div>

                  {/* Avatar Preview */}
                  <div className='rounded-3xl border-2 border-dashed border-slate-300 bg-gradient-to-br from-slate-50 to-blue-50 p-6'>
                    <div className='flex items-center gap-4'>
                      {avatarPreview ? (
                        <img
                          src={avatarPreview}
                          alt={displayName}
                          className='size-16 rounded-2xl object-cover ring-2 ring-white'
                        />
                      ) : (
                        <div className='flex size-16 items-center justify-center rounded-2xl bg-slate-300 text-2xl font-semibold text-white'>
                          {avatarLetter}
                        </div>
                      )}
                      <div>
                        <p className='font-semibold text-slate-900'>Public Profile Preview</p>
                        <p className='text-sm text-slate-600'>Your avatar updates instantly after saving</p>
                      </div>
                    </div>
                  </div>

                  {/* Info Cards */}
                  <div className='grid gap-4 md:grid-cols-2'>
                    <div className='rounded-2xl border border-slate-200 bg-slate-50 p-4'>
                      <div className='flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2'>
                        <UserRound className='size-4 text-slate-500' />
                        Full Name
                      </div>
                      <p className='text-slate-900'>{displayName}</p>
                    </div>

                    <div className='rounded-2xl border border-slate-200 bg-slate-50 p-4'>
                      <div className='flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2'>
                        <Mail className='size-4 text-slate-500' />
                        Email
                      </div>
                      <p className='text-slate-900'>{user?.email || 'Not set'}</p>
                    </div>

                    <div className='rounded-2xl border border-slate-200 bg-slate-50 p-4'>
                      <div className='flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2'>
                        <Phone className='size-4 text-slate-500' />
                        Phone
                      </div>
                      <p className='text-slate-900'>{user?.phone_number || 'Add a phone number'}</p>
                    </div>

                    <div className='rounded-2xl border border-slate-200 bg-slate-50 p-4'>
                      <div className='flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2'>
                        <MapPin className='size-4 text-slate-500' />
                        Status
                      </div>
                      <p className='capitalize text-slate-900'>{user?.status || 'active'}</p>
                    </div>
                  </div>

                  {/* Form Actions */}
                  {isEditing ? (
                    <div className='flex flex-wrap gap-3 pt-4 border-t border-slate-200'>
                      <Button
                        type='submit'
                        className='h-11 rounded-xl font-semibold'
                        disabled={updateProfileMutation.isPending || !isDirty}
                      >
                        {updateProfileMutation.isPending ? (
                          <Loader2 className='size-4 animate-spin mr-2' />
                        ) : (
                          <Save className='size-4 mr-2' />
                        )}
                        {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
                      </Button>
                      <Button
                        type='button'
                        variant='outline'
                        className='h-11 rounded-xl font-semibold'
                        onClick={handleCancelEdit}
                        disabled={updateProfileMutation.isPending}
                      >
                        <X className='size-4 mr-2' />
                        Cancel
                      </Button>
                    </div>
                  ) : null}
                </form>
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className='p-6 md:p-8'>
              <div className='mb-6'>
                <h2 className='text-xl font-bold text-slate-900'>Order History</h2>
                <p className='text-sm text-slate-600 mt-1'>View and manage your recent orders</p>
              </div>

              <div className='space-y-4'>
                {sampleOrders.map((order) => (
                  <div
                    key={order.id}
                    className='rounded-2xl border border-slate-200 p-5 hover:shadow-md transition-shadow'
                  >
                    <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
                      <div className='flex items-start gap-4'>
                        <div className='rounded-xl bg-blue-50 p-2'>
                          <Package className='size-5 text-blue-600' />
                        </div>
                        <div>
                          <p className='font-semibold text-slate-900'>Order #{order.id}</p>
                          <p className='text-sm text-slate-600'>
                            {order.date} • {order.items} items
                          </p>
                        </div>
                      </div>
                      <div className='flex items-center justify-between md:gap-6 flex-wrap'>
                        <div className='text-right'>
                          <p className='font-bold text-slate-900'>{order.total}</p>
                          <span
                            className={`text-xs font-semibold px-2.5 py-1 rounded-full inline-block ${getStatusBadge(order.status)}`}
                          >
                            {order.status}
                          </span>
                        </div>
                        <Button variant='outline' className='h-9 rounded-lg'>
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Addresses Tab */}
          {activeTab === 'addresses' && (
            <div className='p-6 md:p-8'>
              <div className='mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
                <div>
                  <h2 className='text-xl font-bold text-slate-900'>Saved Addresses</h2>
                  <p className='text-sm text-slate-600 mt-1'>Manage your delivery addresses</p>
                </div>
                <Button
                  onClick={() => setShowAddressForm(!showAddressForm)}
                  className='h-10 rounded-xl font-semibold'
                  variant={showAddressForm ? 'outline' : 'default'}
                >
                  <Plus className='size-4 mr-2' />
                  Add Address
                </Button>
              </div>

              {showAddressForm && (
                <div className='mb-6 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-6'>
                  <p className='font-semibold text-slate-900 mb-4'>Add New Address</p>
                  <div className='grid gap-4 md:grid-cols-2'>
                    <Input placeholder='Label (Home, Office, etc.)' className='h-10 rounded-lg' />
                    <Input placeholder='Full Name' className='h-10 rounded-lg' />
                    <Input placeholder='Street Address' className='h-10 rounded-lg md:col-span-2' />
                    <Input placeholder='City' className='h-10 rounded-lg' />
                    <Input placeholder='Postal Code' className='h-10 rounded-lg' />
                    <Input placeholder='Phone Number' className='h-10 rounded-lg md:col-span-2' />
                  </div>
                  <div className='flex gap-3 mt-4'>
                    <Button size='sm' className='rounded-lg'>
                      Save Address
                    </Button>
                    <Button
                      size='sm'
                      variant='outline'
                      className='rounded-lg'
                      onClick={() => setShowAddressForm(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              <div className='grid gap-4 md:grid-cols-2'>
                {sampleAddresses.map((address) => (
                  <div
                    key={address.id}
                    className='rounded-2xl border border-slate-200 p-5 relative hover:shadow-md transition-shadow'
                  >
                    {address.isDefault && (
                      <div className='absolute top-4 right-4 bg-blue-100 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-full'>
                        Default
                      </div>
                    )}
                    <div className='pr-20'>
                      <div className='flex items-start gap-3 mb-4'>
                        <Home className='size-5 text-slate-600 mt-0.5' />
                        <div>
                          <p className='font-semibold text-slate-900'>{address.label}</p>
                          <p className='text-sm text-slate-600'>{address.name}</p>
                        </div>
                      </div>
                      <div className='space-y-1 text-sm text-slate-600 mb-4'>
                        <p>{address.street}</p>
                        <p>
                          {address.city}, {address.state} {address.zip}
                        </p>
                        <p>{address.phone}</p>
                      </div>
                      <div className='flex gap-2'>
                        <Button variant='outline' size='sm' className='h-8 rounded-lg'>
                          Edit
                        </Button>
                        <Button variant='outline' size='sm' className='h-8 rounded-lg text-red-600 hover:text-red-700'>
                          <Trash2 className='size-3.5' />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className='p-6 md:p-8'>
              <div className='space-y-8'>
                {/* Security Settings */}
                <div>
                  <h2 className='text-xl font-bold text-slate-900 mb-6 flex items-center gap-2'>
                    <Shield className='size-5' />
                    Security & Privacy
                  </h2>
                  <div className='space-y-4'>
                    <div className='rounded-2xl border border-slate-200 p-5 hover:shadow-md transition-shadow'>
                      <div className='flex items-start justify-between'>
                        <div className='flex items-start gap-4'>
                          <div className='rounded-xl bg-emerald-50 p-2 mt-1'>
                            <ShieldCheck className='size-5 text-emerald-600' />
                          </div>
                          <div>
                            <p className='font-semibold text-slate-900'>Two-Factor Authentication</p>
                            <p className='text-sm text-slate-600 mt-1'>
                              {user?.two_FA ? '✓ Enabled for extra protection' : 'Not enabled yet'}
                            </p>
                          </div>
                        </div>
                        <Button variant={user?.two_FA ? 'outline' : 'default'} size='sm' className='rounded-lg'>
                          {user?.two_FA ? 'Manage' : 'Enable'}
                        </Button>
                      </div>
                    </div>

                    <div className='rounded-2xl border border-slate-200 p-5 hover:shadow-md transition-shadow'>
                      <div className='flex items-start justify-between'>
                        <div className='flex items-start gap-4'>
                          <div className='rounded-xl bg-blue-50 p-2 mt-1'>
                            <BadgeCheck className='size-5 text-blue-600' />
                          </div>
                          <div>
                            <p className='font-semibold text-slate-900'>Login Activity</p>
                            <p className='text-sm text-slate-600 mt-1'>Monitor your recent login attempts</p>
                          </div>
                        </div>
                        <Button variant='outline' size='sm' className='rounded-lg'>
                          View
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Methods */}
                <div>
                  <div className='mb-6 flex items-center justify-between'>
                    <h2 className='text-xl font-bold text-slate-900 flex items-center gap-2'>
                      <CreditCard className='size-5' />
                      Payment Methods
                    </h2>
                    <Button onClick={() => setShowPaymentForm(!showPaymentForm)} size='sm' className='rounded-lg'>
                      <Plus className='size-4 mr-2' />
                      Add Card
                    </Button>
                  </div>

                  {showPaymentForm && (
                    <div className='mb-6 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-6'>
                      <div className='grid gap-4 md:grid-cols-2'>
                        <Input placeholder='Card Holder Name' className='h-10 rounded-lg md:col-span-2' />
                        <Input placeholder='Card Number' className='h-10 rounded-lg md:col-span-2' />
                        <Input placeholder='MM/YY' className='h-10 rounded-lg' />
                        <Input placeholder='CVC' className='h-10 rounded-lg' />
                      </div>
                      <div className='flex gap-3 mt-4'>
                        <Button size='sm' className='rounded-lg'>
                          Add Payment Method
                        </Button>
                        <Button
                          size='sm'
                          variant='outline'
                          className='rounded-lg'
                          onClick={() => setShowPaymentForm(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className='grid gap-4 md:grid-cols-2'>
                    {paymentMethods.map((method) => (
                      <div
                        key={method.id}
                        className='rounded-2xl border border-slate-200 p-5 relative hover:shadow-md transition-shadow'
                      >
                        {method.label && (
                          <div className='absolute top-4 right-4 bg-blue-100 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-full'>
                            {method.label}
                          </div>
                        )}
                        <div className='flex items-center gap-4 mb-4 pr-16'>
                          <div className='text-3xl'>💳</div>
                          <div>
                            <p className='font-semibold text-slate-900'>{method.type}</p>
                            <p className='text-sm text-slate-600'>•••• {method.last4}</p>
                          </div>
                        </div>
                        <p className='text-xs text-slate-600 mb-4'>Expires {method.expiry}</p>
                        <div className='flex gap-2'>
                          <Button variant='outline' size='sm' className='h-8 rounded-lg flex-1'>
                            Edit
                          </Button>
                          <Button
                            variant='outline'
                            size='sm'
                            className='h-8 rounded-lg text-red-600 hover:text-red-700'
                          >
                            <Trash2 className='size-3.5' />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Vendor Registration */}
                <div className='border-t border-slate-200 pt-8'>
                  {vendorQuery.data ? (
                    <div>
                      <h2 className='text-xl font-bold text-slate-900 mb-6 flex items-center gap-2'>
                        <Store className='size-5' />
                        Vendor Dashboard
                      </h2>

                      <div className='space-y-4'>
                        <div className='rounded-2xl border border-slate-200 p-5 hover:shadow-md transition-shadow'>
                          <div className='flex items-start justify-between'>
                            <div className='flex-1'>
                              <p className='font-bold text-xl text-slate-900'>{vendorQuery.data.shop_name}</p>
                              {vendorQuery.data.description && (
                                <p className='text-sm text-slate-600 mt-2'>{vendorQuery.data.description}</p>
                              )}
                              <div className='flex items-center gap-2 mt-3'>
                                {vendorQuery.data.status_application === 'approved' ? (
                                  <div className='flex items-center gap-2'>
                                    <CheckCircle className='size-4 text-emerald-600' />
                                    <span className='text-xs font-semibold text-emerald-600'>Verified Vendor</span>
                                  </div>
                                ) : vendorQuery.data.status_application === 'rejected' ? (
                                  <div>
                                    <div className='flex items-center gap-2'>
                                      <AlertCircle className='size-4 text-red-600' />
                                      <span className='text-xs font-semibold text-red-600'>Application Rejected</span>
                                    </div>
                                    {vendorQuery.data.reject_reason && (
                                      <p className='text-xs text-red-500 mt-2'>
                                        Reason: {vendorQuery.data.reject_reason}
                                      </p>
                                    )}
                                  </div>
                                ) : (
                                  <div className='flex items-center gap-2'>
                                    <AlertCircle className='size-4 text-amber-600' />
                                    <span className='text-xs font-semibold text-amber-600'>Pending Approval</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        <Button variant='outline' className='h-11 w-full rounded-xl font-semibold'>
                          <Store className='size-4 mr-2' />
                          Manage Shop
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className='mb-6'>
                        <h2 className='text-xl font-bold text-slate-900 flex items-center gap-2 mb-2'>
                          <Store className='size-5 text-blue-600' />
                          Become a Vendor
                        </h2>
                        <p className='text-sm text-slate-600'>
                          Expand your business and sell on our marketplace. Register as a vendor to reach more
                          customers.
                        </p>
                      </div>

                      {showVendorForm ? (
                        <div className='rounded-2xl border border-slate-200 p-6 bg-gradient-to-br from-slate-50 to-blue-50 mb-6'>
                          <h3 className='text-lg font-semibold text-slate-900 mb-4'>Vendor Registration</h3>
                          <form onSubmit={handleVendorSubmit(onVendorSubmit)} className='space-y-4'>
                            <div className='space-y-2'>
                              <label className='block text-sm font-semibold text-slate-700'>Shop Name</label>
                              <Input
                                {...registerVendor('shop_name')}
                                placeholder='Enter your shop name'
                                className='h-10 rounded-lg'
                              />
                              {vendorErrors.shop_name && (
                                <p className='text-sm text-red-600 flex items-center gap-1'>
                                  <AlertCircle className='size-3.5' />
                                  {vendorErrors.shop_name.message}
                                </p>
                              )}
                            </div>

                            <div className='space-y-2'>
                              <label className='block text-sm font-semibold text-slate-700'>Shop Description</label>
                              <textarea
                                {...registerVendor('description')}
                                placeholder='Describe your shop and products (optional)'
                                className='w-full p-2.5 text-sm border border-slate-300 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200'
                                rows={4}
                              />
                              {vendorErrors.description && (
                                <p className='text-sm text-red-600 flex items-center gap-1'>
                                  <AlertCircle className='size-3.5' />
                                  {vendorErrors.description.message}
                                </p>
                              )}
                            </div>

                            <div className='bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3'>
                              <BadgeCheck className='size-5 text-blue-600 mt-0.5 flex-shrink-0' />
                              <div className='text-sm text-blue-700'>
                                <p className='font-semibold'>What happens next?</p>
                                <ul className='mt-2 space-y-1 list-disc list-inside'>
                                  <li>Your application will be reviewed by our team</li>
                                  <li>You'll receive an email with the approval status</li>
                                  <li>Once approved, you can start selling immediately</li>
                                </ul>
                              </div>
                            </div>

                            <div className='flex gap-3 pt-2'>
                              <Button
                                type='submit'
                                className='flex-1 h-10 rounded-lg font-semibold'
                                disabled={isSubmittingVendor || registerVendorMutation.isPending}
                              >
                                {registerVendorMutation.isPending ? (
                                  <>
                                    <Loader2 className='size-4 animate-spin mr-2' />
                                    Submitting...
                                  </>
                                ) : (
                                  <>
                                    <Store className='size-4 mr-2' />
                                    Apply to Become Vendor
                                  </>
                                )}
                              </Button>
                              <Button
                                type='button'
                                variant='outline'
                                className='flex-1 h-10 rounded-lg font-semibold'
                                onClick={() => setShowVendorForm(false)}
                              >
                                <X className='size-4 mr-2' />
                                Cancel
                              </Button>
                            </div>
                          </form>
                        </div>
                      ) : (
                        <Button
                          onClick={() => setShowVendorForm(true)}
                          className='h-11 w-full rounded-xl font-semibold mb-6'
                        >
                          <Store className='size-4 mr-2' />
                          Get Started as Vendor
                        </Button>
                      )}
                    </div>
                  )}
                </div>

                {/* Account Actions */}
                <div className='border-t border-slate-200 pt-8'>
                  <h2 className='text-xl font-bold text-slate-900 mb-6'>Account Actions</h2>
                  <div className='space-y-3'>
                    <Button
                      type='button'
                      variant='outline'
                      className='h-11 w-full justify-start rounded-xl font-semibold text-slate-600 hover:text-slate-900'
                    >
                      Change Password
                    </Button>
                    <Button
                      type='button'
                      variant='outline'
                      className='h-11 w-full justify-start rounded-xl font-semibold text-slate-600 hover:text-slate-900'
                    >
                      Privacy Settings
                    </Button>
                    <Button
                      type='button'
                      variant='destructive'
                      className='h-11 w-full justify-start rounded-xl font-semibold'
                      onClick={handleLogout}
                      disabled={logoutMutation.isPending}
                    >
                      {logoutMutation.isPending ? (
                        <Loader2 className='size-4 animate-spin mr-2' />
                      ) : (
                        <LogOut className='size-4 mr-2' />
                      )}
                      {logoutMutation.isPending ? 'Logging out...' : 'Log Out'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
