import mongoose from 'mongoose'
import { BYTE_UNIT } from './const.util'

export const replacePlaceholder = (template: string, params: Record<string, string>) => {
  Object.keys(params).forEach((key) => {
    const placeholder = `{{${key}}}`
    template = template.replace(new RegExp(placeholder, 'g'), params[key])
  })
  return template
}

export const convertToObjectId = (input: string) => {
  return new mongoose.Types.ObjectId(input)
}

export const slugify = (text: string) => {
  if (!text) return ''

  return String(text)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export const handlePageSkip = (page: number, limit: number) => {
  if (!page || !limit) return 0
  if (page <= 0 || limit <= 0) return 0
  return 1 * (page - 1) * limit
}

export const normalizeUrl = (url: string) => {
  // Remove the query parameters from the URL (everything after ?)
  const cleanUrl = url.split('?')[0]

  // Replace MongoDB _id or any dynamic segment with ':id'
  return cleanUrl.replace(/\/[a-fA-F0-9]{24}(?=\/|$)/g, '/:id')
}

export const generateVerificationToken = () => Math.floor(100000 + Math.random() * 900000).toString()

export function generatePassword(): string {
  const length = 8
  let password = ''

  for (let i = 0; i < length; i++) {
    password += Math.floor(Math.random() * 10)
  }

  return password
}

export function formatBytes(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let i = 0

  while (bytes >= BYTE_UNIT && i < units.length - 1) {
    bytes /= BYTE_UNIT
    i++
  }
  const value = new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 2
  }).format(bytes)

  return `${value}${units[i]}`
}
