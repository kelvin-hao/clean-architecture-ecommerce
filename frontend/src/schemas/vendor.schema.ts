import { z } from 'zod'

export const vendorRegistrationSchema = z.object({
  shop_name: z
    .string()
    .min(3, 'Shop name must be at least 3 characters')
    .max(100, 'Shop name must be at most 100 characters')
    .trim(),
  description: z.string().max(500, 'Description must be at most 500 characters').trim().optional().nullable()
})

export type VendorRegistrationFormValues = z.infer<typeof vendorRegistrationSchema>
