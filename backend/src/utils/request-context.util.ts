import { AsyncLocalStorage } from 'async_hooks'

type Store = {
  requestId: string
}

const asyncLocalStorage = new AsyncLocalStorage<Store>()

/**
 * Run a function within a request context
 */
export const runWithRequestContext = (requestId: string, callback: () => void) => {
  asyncLocalStorage.run({ requestId }, callback)
}

/**
 * Get current requestId (SAFE ANYWHERE)
 */
export const getRequestId = (): string | undefined => {
  return asyncLocalStorage.getStore()?.requestId
}
