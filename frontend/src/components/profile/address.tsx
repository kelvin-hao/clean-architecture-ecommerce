import { Home, Plus, SquarePen, Trash2 } from 'lucide-react'
import { Button } from '../ui/button'
import { useState } from 'react'
import { Input } from '../ui/input'

const sampleAddresses = [
  {
    id: 1,
    label: 'Home',
    name: 'Huynh Nhat Hao',
    street: '123 Main Street',
    city: 'Ho Chi Minh City',
    state: 'HCM',
    zip: '700000',
    phone: '+84 123 456 789',
    isDefault: true
  }
]

const Address = () => {
  const [showAddressForm, setShowAddressForm] = useState(false)
  return (
    <div>
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
              <Button size='sm' variant='outline' className='rounded-lg' onClick={() => setShowAddressForm(false)}>
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
                    <SquarePen className='size-3.5' />
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
    </div>
  )
}

export default Address
