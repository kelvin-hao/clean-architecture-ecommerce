import axiosClient from '~/lib/axios'
import type { ApiResponse } from '~/types'
import type { VendorRegistrationFormValues } from '~/schemas/vendor.schema'

export interface IVendor {
  _id: string
  user_id: string
  shop_name: string
  shop_slug: string
  shop_logo?: string
  shop_banner?: string
  description?: string
  verified?: boolean
  status_application: 'pending' | 'approved' | 'rejected'
  reject_reason?: string
  createdAt: string
  updatedAt: string
}

export const vendorApi = {
  registerVendor: async (data: VendorRegistrationFormValues): Promise<IVendor> => {
    const res = await axiosClient.post<ApiResponse<{ vendor: IVendor }>>('/vendors', data)
    return res.data.data.vendor
  },

  getMyVendor: async (): Promise<IVendor | null> => {
    try {
      const res = await axiosClient.get<ApiResponse<{ vendor: IVendor }>>('/vendors/me')
      return res.data.data.vendor
    } catch (error: any) {
      // Return null if user is not a vendor (404 error)
      if (error.response?.status === 404) {
        return null
      }
      throw error
    }
  }
}
