import {
  AlertCircle,
  BadgeCheck,
  CheckCircle,
  CreditCard,
  Loader2,
  LogOut,
  Plus,
  Shield,
  ShieldCheck,
  Store,
  Trash2,
  X
} from 'lucide-react'
import { Button } from '../ui/button'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { vendorRegistrationSchema, type VendorRegistrationFormValues } from '~/schemas/vendor.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useLogout, useProfile } from '~/hooks/useAuth'
import { useMyVendor, useRegisterVendor } from '~/hooks/useVendor'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import type { ApiError } from '~/types'
import { useAuthStore } from '~/store/auth.store'
import { Input } from '../ui/input'

const paymentMethods = [
  { id: 1, type: 'Visa', last4: '4242', expiry: '12/25', label: 'Primary' },
  { id: 2, type: 'Mastercard', last4: '5555', expiry: '08/26', label: '' }
]

const Setting = () => {
  const profileQuery = useProfile()
  const storedUser = useAuthStore((s) => s.user)
  const user = profileQuery.data ?? storedUser

  const vendorQuery = useMyVendor()
  const navigate = useNavigate()

  const logoutMutation = useLogout()

  const registerVendorMutation = useRegisterVendor()

  const [showPaymentForm, setShowPaymentForm] = useState(false)
  const [showVendorForm, setShowVendorForm] = useState(false)

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
  return (
    <div>
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
                  <Button size='sm' variant='outline' className='rounded-lg' onClick={() => setShowPaymentForm(false)}>
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
                    <Button variant='outline' size='sm' className='h-8 rounded-lg text-red-600 hover:text-red-700'>
                      <Trash2 className='size-3.5' />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Vendor Section: Show dashboard if vendor, else show registration */}
          <div className='border-t border-slate-200 pt-8'>
            {vendorQuery.data || storedUser?.roles?.includes('vendor') ? (
              <div>
                <h2 className='text-xl font-bold text-slate-900 mb-6 flex items-center gap-2'>
                  <Store className='size-5' />
                  Vendor Dashboard
                </h2>

                <div className='space-y-4'>
                  <div className='rounded-2xl border border-slate-200 p-5 hover:shadow-md transition-shadow'>
                    <div className='flex items-start justify-between'>
                      <div className='flex-1'>
                        <p className='font-bold text-xl text-slate-900'>{vendorQuery.data?.shop_name || 'Your Shop'}</p>
                        {vendorQuery.data?.description && (
                          <p className='text-sm text-slate-600 mt-2'>{vendorQuery.data.description}</p>
                        )}
                        {vendorQuery.data && (
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
                                  <p className='text-xs text-red-500 mt-2'>Reason: {vendorQuery.data.reject_reason}</p>
                                )}
                              </div>
                            ) : (
                              <div className='flex items-center gap-2'>
                                <AlertCircle className='size-4 text-amber-600' />
                                <span className='text-xs font-semibold text-amber-600'>Pending Approval</span>
                              </div>
                            )}
                          </div>
                        )}
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
                    Expand your business and sell on our marketplace. Register as a vendor to reach more customers.
                  </p>
                </div>

                {showVendorForm ? (
                  <div className='rounded-2xl border border-slate-200 p-6 bg-linear-to-br from-slate-50 to-blue-50 mb-6'>
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
                        <BadgeCheck className='size-5 text-blue-600 mt-0.5 shrink-0' />
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
                  <Button onClick={() => setShowVendorForm(true)} className='h-11 w-full rounded-xl font-semibold mb-6'>
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
    </div>
  )
}

export default Setting
