import { breakpointsTailwind, useMediaQuery } from '@vueuse/core'

export const useIsMobile = (breakpoint: keyof typeof breakpointsTailwind = 'md') =>
  useMediaQuery(`(max-width: ${breakpointsTailwind[breakpoint] - 1}px)`)
