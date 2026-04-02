import { Package } from 'lucide-react'
import { Button } from '../ui/button'

const sampleOrders = [
  { id: '1', date: 'Jan 15, 2025', total: '$89.99', status: 'Delivered', items: 3 },
  { id: '2', date: 'Jan 10, 2025', total: '$125.50', status: 'Shipped', items: 2 },
  { id: '3', date: 'Jan 5, 2025', total: '$45.00', status: 'Delivered', items: 1 }
]

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

const Order = () => {
  return (
    <>
      <div className='p-6 md:p-8'>
        <div className='mb-6'>
          <h2 className='text-xl font-bold text-slate-900'>Order History</h2>
          <p className='text-sm text-slate-600 mt-1'>View and manage your recent orders</p>
        </div>

        <div className='space-y-4'>
          {sampleOrders.map((order) => (
            <div key={order.id} className='rounded-2xl border border-slate-200 p-5 hover:shadow-md transition-shadow'>
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
    </>
  )
}

export default Order
