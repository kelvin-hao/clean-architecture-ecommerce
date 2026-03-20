/**
 * A list of common sensitive field names to hide by default.
 */
const COMMON_SENSITIVE_FIELDS = [
  'password',
  'token',
  'accessToken',
  'refreshToken',
  'apiKey',
  'secret',
  'creditCard',
  'cvv'
]

/**
 * Recursively clones an object while hiding specified sensitive fields.
 *
 * @param data The object or data to sanitize.
 * @param fieldsToHide An array of string keys to hide. Defaults to common sensitive fields.
 * @returns A new object with sensitive fields redacted.
 */
export function hideSensitiveFields<T>(data: T, fieldsToHide: string[] = COMMON_SENSITIVE_FIELDS): T {
  // Use a Set for faster lookups (O(1) vs O(n) for an array)
  const sensitiveFieldSet = new Set(fieldsToHide.map((field) => field.toLowerCase()))

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function recurse(currentData: any): any {
    // If the data is not an object (e.g., string, number, null), return it as is
    if (typeof currentData !== 'object' || currentData === null) {
      return currentData
    }

    // Handle arrays by recursively calling this function on each item
    if (Array.isArray(currentData)) {
      return currentData.map((item) => recurse(item))
    }

    // Handle objects by cloning and redacting sensitive fields
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const newObject: { [key: string]: any } = {}
    for (const key in currentData) {
      // Ensure we only process the object's own properties
      if (Object.prototype.hasOwnProperty.call(currentData, key)) {
        if (sensitiveFieldSet.has(key.toLowerCase())) {
          newObject[key] = '[REDACTED]'
        } else {
          // If the key is not sensitive, process its value recursively
          newObject[key] = recurse(currentData[key])
        }
      }
    }
    return newObject
  }

  return recurse(data)
}
