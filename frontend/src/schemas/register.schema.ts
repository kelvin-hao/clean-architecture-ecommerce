import { z } from 'zod'

export const registerSchema = z
  .object({
    name: z.string().trim().min(3, 'Name must be at least 3 characters').max(50, 'Name must be at most 50 characters'),

    email: z.string().trim().email('Invalid email address'),

    phone_number: z.string().optional(),

    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(30, 'Password must be at most 30 characters'),

    confirmPassword: z.string(),

    acceptedTerms: z.boolean().refine((value) => value, {
      message: 'Please accept the terms to continue'
    })
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  })

export type RegisterFormValues = z.infer<typeof registerSchema>
