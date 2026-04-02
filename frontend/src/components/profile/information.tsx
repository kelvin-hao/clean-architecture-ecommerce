import { Loader2, Mail, MapPin, Phone, Save, SquarePen, Upload, UserRound, X } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { useEffect, useMemo, useState } from 'react'
import { profileSchema, type ProfileFormValues } from '~/schemas/profile.schema'
import type { AuthUser } from '~/types/auth.type'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useWatch } from 'react-hook-form'
import { useProfile, useUpdateProfile } from '~/hooks/useAuth'
import { useAuthStore } from '~/store/auth.store'
import { uploadApi } from '~/apis/upload.api'
import { toast } from 'sonner'
import type { ApiError } from '~/types'

const Information = () => {
  const profileQuery = useProfile()
  const storedUser = useAuthStore((s) => s.user)
  const user = profileQuery.data ?? storedUser
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const setUser = useAuthStore((s) => s.setUser)
  const updateProfileMutation = useUpdateProfile()

  const getProfileFormValues = (user?: AuthUser | null): ProfileFormValues => ({
    name: user?.name || user?.email?.split('@')[0] || '',
    phone_number: user?.phone_number || '',
    avatar: user?.avatar || ''
  })

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

  const avatarValue = useWatch({
    control,
    name: 'avatar'
  })

  const displayName = user?.name || user?.email?.split('@')[0] || 'Customer'
  const avatarLetter = displayName.charAt(0).toUpperCase() || 'C'
  const avatarPreview = avatarValue?.trim() || user?.avatar

  useEffect(() => {
    reset(formDefaults)
  }, [formDefaults, reset])

  useEffect(() => {
    if (profileQuery.data) {
      setUser(profileQuery.data)
    }
  }, [profileQuery.data, setUser])

  return (
    <>
      <div className='space-y-8 p-6 md:p-8'>
        <div className='flex flex-wrap items-center justify-between gap-3 mb-6'>
          <div>
            <h2 className='mb-1 text-xl font-bold text-slate-900'>Personal Information</h2>
            <p className='text-sm text-slate-600'>Update your account details and profile information</p>
          </div>
          <Button
            type='button'
            variant={isEditing ? 'destructive' : 'secondary'}
            className='h-10 rounded-full px-4 font-semibold whitespace-nowrap transition'
            onClick={() => (isEditing ? handleCancelEdit() : setIsEditing(true))}
          >
            {isEditing ? <X className='size-4 mr-2' /> : <SquarePen className='size-4 mr-2' />}
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
              <Input value={user?.email || ''} disabled className='h-11 rounded-xl bg-slate-100 text-slate-600' />
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
          <div className='rounded-3xl border-2 border-dashed border-slate-300 bg-linear-to-br from-slate-50 to-blue-50 p-6'>
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
            <div className='flex flex-wrap items-center justify-end gap-3 pt-4 mt-3 border-t border-slate-200'>
              <Button
                type='submit'
                className='h-11 rounded-full px-6 font-semibold transition shadow-sm hover:shadow-md'
                disabled={updateProfileMutation.isPending || !isDirty}
              >
                {updateProfileMutation.isPending ? (
                  <Loader2 className='size-4 animate-spin mr-2' />
                ) : (
                  <Save className='size-4 mr-2' />
                )}
                {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          ) : null}
        </form>
      </div>
    </>
  )
}

export default Information
