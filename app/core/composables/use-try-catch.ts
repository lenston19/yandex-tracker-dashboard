export type UseTryCatchHandler<T, U extends unknown[]> = (...args: U) => Promise<Awaited<T>>

export type UseTryCatchReturn<T extends UseTryCatchHandler<ReturnType<T>, Parameters<T>>> = (
  ...args: Parameters<T>
) => Promise<Awaited<ReturnType<T>>> | Promise<undefined>

export function useTryCatch<T extends UseTryCatchHandler<ReturnType<T>, Parameters<T>>>(
  handler: T,
  catchCallback: (e: string) => void = () => {},
  finallyCallback: () => void = () => {}
): UseTryCatchReturn<T> {
  const error = ref<string>('')

  return (async (...args: Parameters<T>) => {
    try {
      const response = await handler(...args)
      error.value = ''
      return response
    } catch (e: unknown) {
      if (isError(e)) {
        const { message } = e
        error.value = Array.isArray(message) ? message.join(', ') : message
      }
      if (catchCallback) {
        catchCallback(error.value)
      }

      console.log({ error: error.value })
    } finally {
      if (finallyCallback) {
        finallyCallback()
      }
    }
  }) as UseTryCatchReturn<T>
}

function isError(value: unknown): value is { message: string } {
  return (
    value !== null &&
    typeof value === 'object' &&
    'message' in value &&
    (typeof value.message === 'string' || Array.isArray(value.message))
  )
}
