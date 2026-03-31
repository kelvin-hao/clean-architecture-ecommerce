import { useMutation, useQuery } from '@tanstack/react-query'
import { vendorApi } from '~/apis/vendor.api'
import type { VendorRegistrationFormValues } from '~/schemas/vendor.schema'

export const useMyVendor = () => {
  return useQuery({
    queryKey: ['my-vendor'],
    queryFn: () => vendorApi.getMyVendor(),
    retry: 1
  })
}

export const useRegisterVendor = () => {
  return useMutation({
    mutationFn: (data: VendorRegistrationFormValues) => vendorApi.registerVendor(data)
  })
}
