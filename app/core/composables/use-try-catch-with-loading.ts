import { useToggle } from '@vueuse/core'
import { useTryCatch, type UseTryCatchHandler } from './use-try-catch'

export interface UseTryCatchWithLoadingOptions {
  catchCallback?: (e: string) => void
  finallyCallback?: () => void
}

export function useTryCatchWithLoading<T extends UseTryCatchHandler<ReturnType<T>, Parameters<T>>>(
  handler: T,
  { catchCallback, finallyCallback }: UseTryCatchWithLoadingOptions = {
    catchCallback: _e => {},
    finallyCallback: () => {}
  }
) {
  const [isLoading, toggleLoading] = useToggle()

  const runWithTryCatch = useTryCatch(handler, catchCallback, finallyCallback)

  async function runWithLoading(...args: Parameters<typeof handler>) {
    try {
      toggleLoading(true)

      return await runWithTryCatch(...args)
    } finally {
      toggleLoading(false)
    }
  }

  return {
    isLoading,
    runWithLoading,
    runWithTryCatch,
    startLoading: toggleLoading(true),
    finishLoading: toggleLoading(false)
  }
}
