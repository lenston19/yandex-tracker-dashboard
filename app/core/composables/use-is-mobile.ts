import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'

export const useIsMobile = () => {
  const { isSmallerOrEqual } = useBreakpoints(breakpointsTailwind)

  const isMobile = isSmallerOrEqual('md')

  return isMobile
}
