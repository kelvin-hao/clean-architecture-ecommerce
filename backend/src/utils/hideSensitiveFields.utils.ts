type AnyObject = Record<string, unknown>

const DEFAULT_SENSITIVE_FIELDS = [
  'password',
  'confirmPassword',
  'token',
  'accessToken',
  'refreshToken',
  'authorization',
  'apiKey',
  'secret',
  'creditCard',
  'cardNumber',
  'cvv',
  'otp'
]

interface MaskOptions {
  mask?: string
  sensitiveFields?: string[]
}

export function hideSensitiveFields<T extends AnyObject>(data: T, options: MaskOptions = {}): T {
  const { mask = '***', sensitiveFields = DEFAULT_SENSITIVE_FIELDS } = options

  const seen = new WeakSet()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sanitize = (obj: any): any => {
    if (obj === null || typeof obj !== 'object') return obj

    if (seen.has(obj)) return obj
    seen.add(obj)

    if (Array.isArray(obj)) return obj.map(sanitize)

    const result: AnyObject = {}

    for (const key of Object.keys(obj)) {
      const lowerKey = key.toLowerCase()

      const isSensitive = sensitiveFields.some((field) => lowerKey.includes(field))

      result[key] = isSensitive ? mask : sanitize(obj[key])
    }

    return result
  }

  return sanitize(data) as T // ✅ preserve type
}
