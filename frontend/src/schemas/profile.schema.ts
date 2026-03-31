import { z } from 'zod'

const phonePattern = /^\+?[0-9()\-\s]{8,20}$/

export const profileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, 'Full name must be at least 3 characters long')
    .max(50, 'Full name must be at most 50 characters long'),
  phone_number: z
    .string()
    .trim()
    .refine((value) => !value || phonePattern.test(value), {
      message: 'Phone number must be valid'
    }),
  avatar: z
    .string()
    .trim()
    .refine((value) => !value || z.string().url().safeParse(value).success, {
      message: 'Avatar must be a valid URL'
    })
})

export type ProfileFormValues = z.infer<typeof profileSchema>
